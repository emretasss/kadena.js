import {
  ChainId,
  IClient,
  ICommand,
  ICommandResult,
  IPactCommand,
  ISignFunction,
  ITransactionDescriptor,
  IUnsignedCommand,
  Pact,
  createClient,
  createTransaction,
  isSignedTransaction,
  signWithChainweaver,
} from '@kadena/client';

import {
  composePactCommand,
  continuation,
  execution,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';
import { asyncPipe } from './asyncPipe';

type SubmitOne = (transaction: ICommand) => Promise<ITransactionDescriptor>;

interface INetworkOptions {
  networkId: string;
  chainId?: ChainId;
  baseUrl: string;
}

type ICallOptions =
  | {
      chainId?: ChainId;
      signers?: IPactCommand['signers'];
      sender?: ISender;
      mode: 'dirtyRead';
      data?: any;
    }
  | {
      chainId?: ChainId;
      signers: IPactCommand['signers'];
      sender: ISender;
      mode: 'preflight' | 'submit';
      data?: any;
    }
  | {
      chainId?: ChainId;
      targetChainId: ChainId;
      signers: IPactCommand['signers'];
      sender: ISender;
      targetSender: ISender;
      mode: 'crossChain';
      data?: any;
    };

export interface ISender {
  account: string;
  keys: string[];
}

const createGasSignature = (
  keys?: string[],
): {
  signers: Array<{
    pubKey: string;
    scheme: 'ED25519';
    clist: [{ name: 'coin.GAS'; args: [] }];
  }>;
} => {
  if (!keys) return { signers: [] };
  return {
    signers: keys.map((key) => ({
      pubKey: key,
      scheme: 'ED25519',
      clist: [{ name: 'coin.GAS', args: [] }],
    })),
  };
};

function onlySucceed(response: ICommandResult) {
  if (response.result.status === 'success') {
    return response;
  }
  throw response.result.error;
}

const validateSign = (
  tx: IUnsignedCommand,
  signedTx: ICommand | IUnsignedCommand,
) => {
  const { sigs, hash } = signedTx;
  const txWidthSigs = { ...tx, sigs };
  if (txWidthSigs.hash !== hash) {
    throw new Error('Hash mismatch');
  }
  if (!isSignedTransaction(txWidthSigs)) {
    throw new Error('Signing failed');
  }
  return txWidthSigs;
};

export function kadenaFactory(
  { networkId, chainId: rootChainId, baseUrl }: INetworkOptions,
  sign: ISignFunction,
) {
  const client: Omit<IClient, 'submit'> & { submit: SubmitOne } =
    createClient(baseUrl);

  const safeSigned = async (tx: IUnsignedCommand) => {
    const signedTx = await sign(tx);
    return validateSign(tx, signedTx);
  };

  return <T extends string, M extends (...args: any[]) => T>(method: M) =>
    ({
      args,
      options,
    }: {
      args: [...Parameters<M>];
      options: ICallOptions;
    }) => {
      // const options: ICallOptions = inputArgs.pop()!;
      const chainId: ChainId = options.chainId || rootChainId!;

      const execCommand = composePactCommand(
        execution(method(...args)),
        setNetworkId(networkId),
        setMeta({ chainId }),
        {
          payload: {
            exec: {
              data: options.data ?? {},
            },
          },
        },
      );

      const commandWithSigners = (
        sender: ISender,
        ...signers: IPactCommand['signers']
      ) =>
        composePactCommand(
          execCommand,
          setMeta({ senderAccount: sender!.account }),
          createGasSignature(sender!.keys),
          {
            signers: signers!,
          },
        )();

      const dirtyRead = asyncPipe(
        () => undefined,
        execCommand,
        createTransaction,
        client.dirtyRead,
        onlySucceed,
      );

      const submit = asyncPipe(
        commandWithSigners,
        createTransaction,
        safeSigned,
        client.submit,
      );

      const submitListen = asyncPipe(submit, client.listen, onlySucceed);

      const preflight = asyncPipe(
        commandWithSigners,
        createTransaction,
        safeSigned,
        client.preflight,
        onlySucceed,
      );

      async function crossChain(
        targetChainId: ChainId,
        senderSource: ISender,
        senderTarget: ISender,
        ...signers: IPactCommand['signers']
      ) {
        await preflight(senderTarget, ...signers);

        const request = await submit(senderSource, ...signers);
        const result = await client.listen(request);
        const submitResult = onlySucceed(result);
        if (!result.continuation) return submitResult;
        const proof = await client.pollCreateSpv(request, targetChainId);
        const cont = result.continuation;

        const contTx = composePactCommand(
          continuation({
            pactId: cont.pactId,
            step: cont.step + 1,
            proof: proof,
          }),
          setNetworkId(networkId),
          setMeta({
            chainId: targetChainId,
            senderAccount: senderTarget.account,
          }),
          createGasSignature(senderTarget.keys),
        );

        return asyncPipe(
          contTx,
          createTransaction,
          safeSigned,
          client.submit,
          client.listen,
          onlySucceed,
        )();
      }

      switch (options.mode) {
        case 'dirtyRead':
          return dirtyRead();
        case 'preflight':
          return preflight(options.sender, ...options.signers);
        case 'submit':
          return submitListen(options.sender, ...options.signers);
        case 'crossChain':
          return crossChain(
            options.targetChainId,
            options.sender!,
            options.targetSender!,
            ...options.signers!,
          );
      }
    };
}
