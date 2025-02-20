import { Command } from 'commander';
import { writeFileSync } from 'fs';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import path from 'path';
import * as RCFC from '../../utils/retrieveContractFromChain';
import { retrieveContract } from '../retrieve-contract';

const restHandlers = [
  rest.post(
    'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact/api/v1/local',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ result: { data: { code: 'some pactCode' } } }),
      );
    },
  ),
];

vi.mock('fs', () => ({ writeFileSync: vi.fn() }));

const server = setupServer(...restHandlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const createAndRunProgram = async (): Promise<void> => {
  const program = new Command('retrieve-contract');
  const action = retrieveContract(program, '0.0.0');

  await action({
    out: '/some/path/to/contract.pact',
    module: 'free.crankk01',
    api: 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact',
    chain: 0,
    network: 'mainnet',
  });
};

describe('retrieve-contract', () => {
  it('calls retrieveContractFromChain', async () => {
    const spy = vi.spyOn(RCFC, 'retrieveContractFromChain');

    await createAndRunProgram();

    expect(spy).toHaveBeenCalledWith(
      'free.crankk01',
      'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact',
      0,
      'mainnet',
    );
  });

  it('writes the contract to file', async () => {
    await createAndRunProgram();

    expect(writeFileSync).toBeCalledWith(
      path.resolve('some', 'path', 'to', 'contract.pact'),
      'some pactCode',
      'utf8',
    );
  });
});
