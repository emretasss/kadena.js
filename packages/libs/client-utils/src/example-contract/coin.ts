import { ChainId, Pact, readKeyset, signWithChainweaver } from '@kadena/client';
import { ISender, kadenaFactory } from '../utils/kadenaFactory';

const kadenaClient = kadenaFactory(
  { networkId: 'mainnet01', baseUrl: '', chainId: '0' },
  signWithChainweaver,
);

const coinTransfer = kadenaClient(Pact.modules.coin['transfer']);
const coinGetBalance = kadenaClient(Pact.modules.coin['get-balance']);
const coinCrossChain = kadenaClient(
  Pact.modules.coin.defpact['transfer-crosschain'],
);

export const transfer = (
  sender: ISender,
  receiver: string,
  amount: string,
  mode: 'preflight' | 'submit',
  chainId?: ChainId,
) =>
  coinTransfer({
    args: [sender.account, receiver, { decimal: amount }],
    options: {
      mode,
      chainId,
      sender,
      signers: sender.keys.map((key) => ({
        pubKey: key,
        clist: [
          {
            name: 'coin.TRANSFER',
            args: [sender.account, receiver, { decimal: amount }],
          },
        ],
      })),
    },
  });

export const getBalance = (account: string, chainId: ChainId) =>
  coinGetBalance({
    args: [account],
    options: {
      mode: 'dirtyRead',
      chainId,
    },
  });

export const crossChainTransfer = (
  sender: ISender & { chainId: ChainId },
  receiver: {
    account: string;
    chainId: ChainId;
    keyset: { keys: string[]; pred: 'keys-all' | 'keys-one' | 'keys-tow' };
  },
  amount: string,
) =>
  coinCrossChain({
    args: [
      sender.account,
      receiver.account,
      readKeyset('receiver-guard'),
      receiver.chainId,
      { decimal: amount },
    ],
    options: {
      mode: 'crossChain',
      chainId: sender.chainId,
      targetChainId: receiver.chainId,
      signers: sender.keys.map((key) => ({
        pubKey: key,
        clist: [
          {
            name: 'coin.TRANSFER',
            args: [sender.account, receiver.account, { decimal: amount }],
          },
        ],
      })),
      sender,
      targetSender: { account: 'kadena-xchain', keys: [] },
      data: {
        'receiver-guard': {
          keys: receiver.keyset.keys,
          pred: receiver.keyset.pred,
        },
      },
    },
  });
