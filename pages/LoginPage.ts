import { Locator, Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotButton: Locator;
  readonly errorAlert: Locator;
  readonly usernameRequired: Locator;
  readonly passwordRequired: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = this.page.getByPlaceholder('Username');
    this.passwordInput = this.page.getByPlaceholder('Password');
    this.loginButton = this.page.locator("button[type='submit']");
    this.forgotButton = this.page.locator('.oxd-text.oxd-text--p.orangehrm-login-forgot-header');
    this.errorAlert = this.page.getByText('Invalid credentials');
    this.usernameRequired = this.usernameInput.locator('..').locator('..').locator('.oxd-input-group__message');
    this.passwordRequired = this.passwordInput.locator('..').locator('..').locator('.oxd-input-group__message');
  }

  async goToLoginPage(loginUrl: string): Promise<void> {
    await this.page.goto(loginUrl);
    console.log('Login page open');
  }

  async verifyLoginPage(expectedUrl: string, expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
    const actualTitle = await this.page.title();
    expect(actualTitle).toBe(expectedTitle);
    console.log('Title is verified');
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    console.log('Login credentials entered');
  }

  async clickOnLoginBtn(): Promise<void> {
    await this.loginButton.click();
    console.log('Login button clicked');
  }

  async verifyInvalidCredentialsAttempt(): Promise<void> {
    await expect(this.errorAlert).toHaveText("Invalid credentials");
    console.log("Invalid credentials alert verified");
  }

  async verifyRequiredFieldBelowUsername(): Promise<void> {
    await expect(this.usernameRequired).toHaveText('Required');
  }

  async verifyRequiredFieldBelowPassword(): Promise<void> {
    await expect(this.passwordRequired).toHaveText('Required');
  }
}
