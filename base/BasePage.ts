import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickOnElement(element: Locator): Promise<void> {
    await element.click();
  }

  async isVisible(element: Locator): Promise<void> {
    await expect(element).toBeVisible();
  }

  async enterText(element: Locator, text: string): Promise<void> {
    await element.fill(text);
  }

  async getTextFromElement(element: Locator): Promise<string | null> {
    return await element.textContent();
  }

  async getAttributeValue(element: Locator, attribute: string): Promise<string | null> {
    return await element.getAttribute(attribute);
  }

  async waitForElement(element: Locator, timeout = 10000): Promise<void> {
    await element.waitFor({ timeout });
  }

  async navigateToUrl(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async isEnabled(element: Locator): Promise<void> {
    await expect(element).toBeEnabled();
  }

  async hasText(element: Locator, text: string): Promise<void> {
    await expect(element).toHaveText(text);
  }

}
