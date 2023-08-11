import type { Locator, Page } from '@playwright/test';

export default class AccountTransactionsPage {
  private readonly page: Page;
  private cboChainId: Locator;
  private txtAccount: Locator;
  private btnSearch: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.cboChainId = this.page.getByRole('combobox', {
      name: /select chain id/i,
    });
    this.txtAccount = this.page.getByRole('textbox', { name: /account/i });
    this.btnSearch = this.page.getByRole('button', {
      name: /search for transactions/i,
    });
  }

  public async setChainId(chainId: string): Promise<string[]> {
    return this.cboChainId.selectOption(chainId);
  }

  public async setAccount(account: string): Promise<void> {
    return this.txtAccount.fill(account);
  }

  public async findTransaction(
    chainId: string,
    account: string,
  ): Promise<void> {
    await this.setChainId(chainId);
    await this.setAccount(account);
  }
}
