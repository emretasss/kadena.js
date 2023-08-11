import type { Locator, Page } from '@playwright/test';

export default class NavHeaderComponent {
  private readonly page: Page;
  private readonly banner: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.banner = this.page.getByRole('banner');
  }

  public async goToTransactions(): Promise<void> {
    return this.banner.getByRole('link', { name: 'Transactions' }).click();
  }

  public async goToFaucet(): Promise<void> {
    return this.banner.getByRole('link', { name: 'Faucet' }).click();
  }

  public async goToAccount(): Promise<void> {
    return this.banner.getByRole('link', { name: 'Account' }).click();
  }
}
