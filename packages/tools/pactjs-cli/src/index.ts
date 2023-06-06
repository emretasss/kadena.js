#!/usr/bin/env node
import { generateCommands as generateMarmaladeCommands } from './tools/marmalade';
import { generateCommands as generatePactCommands } from './tools/pactjs';

import { program } from 'commander';
import { readFileSync } from 'fs';
import { join } from 'path';

const packageJson: { version: string } = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8'),
);

// marmalade
generateMarmaladeCommands(program, packageJson.version);

// pactjs
generatePactCommands(program, packageJson.version);

program
  .description(
    'The kadena CLI (command line interface) for developing on the kadena blockchain',
  )
  .version(packageJson.version)
  .parse();
