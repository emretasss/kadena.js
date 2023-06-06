/*

    Tool accompanying @kadena/pactjs-core and @kadena/pactjs-client to generate 
    TypeScript definitions and Pact client

*/

import { contractGenerateCommand } from './contract-generate';
import { retrieveContractCommand } from './retrieve-contract';
import { templateGenerateCommand } from './template-generate';

import { Command } from 'commander';

export function generateCommands(program: Command, version: string): void {
  contractGenerateCommand(program, version);
  templateGenerateCommand(program, version);
  retrieveContractCommand(program, version);
}
