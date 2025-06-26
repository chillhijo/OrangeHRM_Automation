import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class LoginPage extends BasePage {
  usernameInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;
  forgotButton: Locator;
  errorAlert: Locator;
  usernameRequired: Locator;
  passwordRequired: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.getByPlaceholder('Username');
    this.passwordInput = this.page.getByPlaceholder('Password');
    this.loginButton = this.page.locator("button[type='submit']");
    this.forgotButton = this.page.locator('.oxd-text.oxd-text--p.orangehrm-login-forgot-header');
    this.errorAlert = this.page.getByText('Invalid credentials');
    this.usernameRequired = this.usernameInput.locator('..').locator('..').locator('.oxd-input-group__message');
    this.passwordRequired = this.passwordInput.locator('..').locator('..').locator('.oxd-input-group__message');
  }

  async goToLoginPage(loginUrl: string): Promise<void> {
    await this.navigateToUrl(loginUrl);
    console.log('Login page open');
  }

  async verifyLoginPage(expectedUrl: string, expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
    const actualTitle = await this.page.title();
    expect(actualTitle).toBe(expectedTitle);
    console.log('Title is verified');
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.enterText(this.usernameInput, username);
    await this.enterText(this.passwordInput, password);
    console.log('Login credentials entered');
  }

  async clickOnLoginBtn(): Promise<void> {
    await this.clickOnElement(this.loginButton);
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
