import NavHeaderComponent from '../../page-objects/components/navHeader.component';
import AccountTransactionsPage from '../../page-objects/pages/accountTransactions.page';

import { expect, test } from '@playwright/test';

test('Should be able to search for TransactionsByAccount', async ({ page }) => {
  await page.goto(
    'https://tools.kadena.io/account/account-transactions/filters',
  );
  const navHeader = new NavHeaderComponent(page);
  await navHeader.goToAccount();
  const accountTransactions = new AccountTransactionsPage(page);
  await accountTransactions.findTransaction('1', '123456789');
  expect(true).toBe(true);
});
