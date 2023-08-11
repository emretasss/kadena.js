import type { Locator, Page } from '@playwright/test';

export default class AccordionComponent {
  private readonly page: Page;
  private readonly container: Locator;
  private component: Locator;
  private accordion: Locator;
  private expandButton: Locator;

  /**
   This is the standard page object for the accordion component in Kadena's react-ui.
   @param {page} page provides methods to interact with a single tab in a Browser
   @param container on the parent page that contains the accordion
   @param {string} label label for specific accordion to use.
   */

  public constructor(page: Page, container: Locator, label: string | RegExp) {
    this.page = page;
    this.container = container;
    this.component = this.container.getByTestId('kda-accordion-wrapper');
    this.accordion = this.component.locator('al-ds-accordion', {
      hasText: label,
    });
    this.expandButton = this.component.locator('.accordion-header__icon');
  }

  /**
   * expand an accordion if available
   * @returns void
   */
  public async expand(): Promise<void> {
    const classes = await this.component.getAttribute('class');
    if (classes !== null && !classes.includes('collapsible--expanded')) {
      await this.expandButton.click();
    }
  }
}
