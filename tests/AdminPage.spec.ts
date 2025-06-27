import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { AdminPage } from "../pages/AdminPage";
import data from "../configuration/properties.json";
import { Helper } from "../utils/Helper";

test.describe("Admin page tests", () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    const home = new HomePage(page);
    adminPage = new AdminPage(page);

    await login.goToLoginPage(data.url.loginUrl);
    await login.verifyLoginPage(data.url.loginUrl, data.titles.loginTitle);
    await login.enterCredentials(data.user.validUser, data.user.validPass);
    await login.clickOnLoginBtn();
    await home.navigateToAdminPAge(data.url.adminPageUrl);
  });

  test("Verify Admin page URL and navbar items", async () => {
    await adminPage.verifyAdminPageUrl(data.url.adminPageUrl);
    await adminPage.verifyAdminNavBar();
  });

  test("Verify Admin search section is visible and enabled", async () => {
    await adminPage.verifyAdminSearchSection();
  });

  test("Search by username and validate results", async () => {
    await adminPage.searchUserByUsername(data.user.admin);
    await adminPage.verifyTableData(1, data.user.admin);
  });

  test("Search by invalid username and validate no records", async () => {
    await adminPage.searchUserByUsername(data.user.invalidUser);
    await adminPage.expectNoResultsMessage();
  });

  test("Search by role: Admin", async () => {
    await adminPage.searchUserByUserRole("Admin");
    await adminPage.verifyTableData(2, "Admin");
  });

  test("Search by role: ESS", async () => {
    await adminPage.searchUserByUserRole("ESS");
    await adminPage.verifyTableData(2, "ESS");
  });

  test("Search by status: Enabled", async () => {
    await adminPage.searchUserByStatus("Enabled");
    await adminPage.verifyTableData(4, "Enabled");
  });

  test("Search by status: Disabled", async () => {
    await adminPage.searchUserByStatus("Disabled");
    await adminPage.verifyTableData(4, "Disabled");
  });

  //To fasten up the test and number of functions in the example, choose to write this test in this way 
  test('Add user form - valid data', async ({ page }) => {
    await adminPage.initiateCreatingNewUser();

    //Pick an User Role
    const userRoleDropdown = page.locator("label:has-text('User Role')").locator('xpath=../../..').locator('.oxd-select-text');
    await userRoleDropdown.click();
    await page.locator("div[role='listbox'] >> text=ESS").click();

    // Fill Employee Name (autocomplete)
    const employeeInput = page.getByPlaceholder('Type for hints...');
    await employeeInput.pressSequentially('user');

    const autoOption = page.locator('.oxd-autocomplete-option').first();
    await autoOption.waitFor({ state: 'visible' });
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

    // Finish creation by clicking Save
    await page.getByRole('button', { name: 'Save' }).click();

    // Search and verify new user
    await adminPage.verifyAdminPageUrl(data.url.adminPageUrl);
    await adminPage.verifyAdminNavBar();
    await adminPage.searchUserByUsername(username);
    await adminPage.verifyTableData(1, username);
  });
});
