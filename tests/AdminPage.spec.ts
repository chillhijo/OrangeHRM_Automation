import { test, expect } from '@playwright/test';
import { AdminPage } from '../pages/AdminPage';
import { Helper } from '../utils/Helper';
import data from '../configuration/properties.json';
import { HomePage } from '../pages/HomePage';

test.describe('Admin page tests (with storageState)', () => {
  let homePage: HomePage;
  let adminPage: AdminPage;

  // Reusing login session via storageState – beforeEach is used only to instantiate page object.
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    adminPage = new AdminPage(page);
    await page.goto(data.url.adminPageUrl);
  });

  test('Verify Admin page URL and navbar items', async () => {
    await adminPage.verifyAdminPageUrl(data.url.adminPageUrl);
    await adminPage.verifyAdminNavBar();
  });

  test('Verify Admin search section is visible and enabled', async () => {
    await adminPage.verifyAdminSearchSection();
  });

  test('Search by username and validate results', async () => {
    await adminPage.searchUserByUsername(data.user.admin);
    await adminPage.verifyTableData(1, data.user.admin);
  });

  test('Search by invalid username and validate no records', async () => {
    await adminPage.searchUserByUsername(data.user.invalidUser);
    await adminPage.expectNoResultsMessage();
  });

  test('Search by role: Admin', async () => {
    await adminPage.searchUserByUserRole('Admin');
    await adminPage.verifyTableData(2, 'Admin');
  });

  test('Search by role: ESS', async () => {
    await adminPage.searchUserByUserRole('ESS');
    await adminPage.verifyTableData(2, 'ESS');
  });

  test('Search by status: Enabled', async () => {
    await adminPage.searchUserByStatus('Enabled');
    await adminPage.verifyTableData(4, 'Enabled');
  });

  test('Search by status: Disabled', async () => {
    await adminPage.searchUserByStatus('Disabled');
    await adminPage.verifyTableData(4, 'Disabled');
  });

  test('Add user form - valid data', async ({ page }) => {
    await adminPage.initiateCreatingNewUser();

    // Pick User Role
    const userRoleDropdown = page.locator("label:has-text('User Role')").locator('xpath=../../..').locator('.oxd-select-text');
    await userRoleDropdown.click();
    await page.locator("div[role='listbox'] >> text=ESS").click();

    // Fill Employee Name (autocomplete)
    const employeeInput = page.getByPlaceholder('Type for hints...');
    await employeeInput.pressSequentially('du');

    const autoOption = page.locator('.oxd-autocomplete-option').first();
    await expect(autoOption).not.toHaveText('Searching', { timeout: 5000 });
    await autoOption.click();

    // Choose Status
    const statusDropdown = page.locator("label:has-text('Status')").locator('xpath=../../..').locator('.oxd-select-text');
    await statusDropdown.click();
    await page.locator("div[role='listbox'] >> text=Enabled").click();

    // Fill Username
    const username = 'testuser_' + Helper.randomString(6);
    const usernameInput = page.locator("label:has-text('Username')").locator('xpath=../../..').locator('input');
    await usernameInput.fill(username);

    // Enter Passwords
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill('StrongPass123!');
    await passwordInputs.nth(1).fill('StrongPass123!');

    // Save
    // await page.getByRole('button', { name: 'Save' }).click();

    // // Wait for state
    // await page.waitForURL(/viewSystemUsers/, { timeout: 15000 });

    // await Promise.all([
    //   page.waitForURL(data.url.adminPageUrl, { timeout: 10000 }),
    //   page.getByRole('button', { name: 'Save' }).click(),
    // ]);
// Klik i čekanje URL-a sa regexom i dužim timeoutom
    await Promise.all([
      page.waitForURL(/viewSystemUsers/, { timeout: 15000 }),
      page.getByRole('button', { name: 'Save' }).click(),
    ]);

// Sačekaj da se pojavi "Add" dugme na listi korisnik

    // Verify
    await adminPage.verifyAdminPageUrl(data.url.adminPageUrl);
    await adminPage.verifyAdminNavBar();
    await adminPage.searchUserByUsername(username);
    await adminPage.verifyTableData(1, username);
  });
});
