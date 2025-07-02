import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import data from '../configuration/properties.json';

test.describe('HomePage tests (with storageState)', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  // Note: Using beforeEach only for Page Object instantiation.
  // Login is not repeated here – session reuse is achieved via storageState in playwright.config.ts.
  // To ensure tests pass, we need to navigate to the Dashboard page because each new test
  // creates a new browser context that reuses the login session from storageState but
  // does not automatically open any page.

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    await page.goto(data.url.dasboardUrl);
  });

  test('Verify Dashboard page is loaded with correct URL and title', async () => {
    await homePage.verifyDashboardPage(data.url.dasboardUrl, data.titles.dashboardTitle);
  });

  test('Verify sections are visible on Dashboard page', async () => {
    await homePage.verifySectionsOnDashboardPage();
  });

  test('Verify left side menu contains all expected items', async () => {
    await homePage.verifyLeftSideMenu();
  });

  test('Verify Assign Leave button is visible, enabled, and clickable', async () => {
    await homePage.makeAssignLeave();
  });

  test('Navigate to Admin page using left side menu link', async () => {
    await homePage.navigateToAdminPAge(data.url.adminPageUrl);
  });

  test('Logout from HomePage', async () => {
    await homePage.lougoutFromOrangeHRM();
    await loginPage.verifyLoginPage(data.url.loginUrl, data.titles.loginTitle);
  });
});
