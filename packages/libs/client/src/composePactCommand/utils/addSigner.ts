import {
  ICapabilityItem,
  IPactCommand,
  ISignerDetail,
} from '../../interfaces/IPactCommand';

interface IAddSigner {
  (publicKey: string): () => Partial<IPactCommand>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <TCommand extends any>(
    publicKey: string,
    capability: (withCapability: ExtractType<TCommand>) => ICapabilityItem[],
  ): TCommand;

  (signerDetail: ISignerDetail): () => Partial<IPactCommand>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <TCommand extends any>(
    signerDetail: ISignerDetail,
    capability: (withCapability: ExtractType<TCommand>) => ICapabilityItem[],
  ): TCommand;
}

/**
 * @alpha
 */
export const addSigner: IAddSigner = ((
  first:
    | string
    | { publicKey: string; scheme?: 'ED25519' | 'ETH'; address?: string },
  capability: (
    withCapability: (
      name: string,
      ...args: unknown[]
    ) => { name: string; args: unknown[] },
  ) => ICapabilityItem[],
): unknown => {
  const {
    publicKey: pubKey,
    scheme = 'ED25519',
    address = undefined,
  } = typeof first === 'object' ? first : { publicKey: first };
  let clist: undefined | Array<{ name: string; args: unknown[] }>;
  if (typeof capability === 'function') {
    clist = capability((name: string, ...args: unknown[]) => ({
      name,
      args,
    }));
  }

  return () => ({
    signers: [
      {
        pubKey,
        scheme,
        ...(address !== undefined ? { address } : {}),
        ...(clist !== undefined ? { clist } : {}),
      },
    ],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

export type UnionToIntersection<T> = (
  T extends unknown ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type GeneralCapability = (name: string, ...args: unknown[]) => ICapabilityItem;

type ExtractType<TCmdReducer> = TCmdReducer extends (cmd: {
  payload: infer TPayload;
}) => unknown
  ? TPayload extends { funs: infer TFunctions }
    ? TFunctions extends Array<infer TFunction>
      ? UnionToIntersection<TFunction> extends { capability: infer TCapability }
        ? TCapability
        : GeneralCapability
      : GeneralCapability
    : GeneralCapability
  : GeneralCapability;
