import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import data from '../configuration/properties.json';

test.describe('HomePage tests', () => {
  let homePage: HomePage;
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    homePage = new HomePage(page);
    await login.goToLoginPage(data.url.loginUrl);
    await login.verifyLoginPage(data.url.loginUrl, data.titles.loginTitle);
    await login.enterCredentials(data.user.validUser, data.user.validPass);
    await login.clickOnLoginBtn();
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
    await login.verifyLoginPage(data.url.loginUrl, data.titles.loginTitle);
  })
})