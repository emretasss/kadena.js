import type { Locator, Page } from '@playwright/test';

export default class ButtonComponent {
  private readonly page: Page;
  private readonly component: Locator;
  /**
   This is the standard page object for the button component in Kadena's react-ui.
   @param {page} page provides methods to interact with a single tab in a Browser
   @param {string} name for the butt
   */

  public constructor(page: Page, name: string) {
    this.page = page;
    this.component = this.page.getByRole('button', { name: `${name}` });
  }

  public async click(): Promise<void> {
    await this.component.click();
  }
}
