import './Query/account';
import './Query/block';
import './Query/blocksFromHeight';
import './Query/chainAccount';
import './Query/completedBlockHeights';
import './Query/lastBlockHeight';
import './Query/maximumConfirmationDepth';
import './Query/transactions';
import './Query/transfers';
import './Subscription/event';
import './Subscription/newBlocks';
import './Subscription/transaction';
import { builder } from './builder';
import './objects/Block';
import './objects/ChainModuleAccount';
import './objects/Event';
import './objects/Guard';
import './objects/MinerKey';
import './objects/ModuleAccount';
import './objects/TotalCount';
import './objects/Transaction';
import './objects/Transfer';

builder.queryType({});
// no mutation fields defined yet, hence commented
// builder.mutationType({});
builder.subscriptionType({});
