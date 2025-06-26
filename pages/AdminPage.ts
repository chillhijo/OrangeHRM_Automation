import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class AdminPage extends BasePage {

    addUserBtn: Locator;
    resetBtn: Locator;
    searchBtn: Locator;
    userManagementTab: Locator;
    jobTab: Locator;
    organizationTab: Locator;
    qualificationsTab: Locator;
    nationalitiesTab: Locator;
    corporateBrandingTab: Locator;
    configurationTab: Locator;
    helpButton: Locator;
    usernameInputSearch: Locator;
    userRoleSearch: Locator;
    employeeNameSearch: Locator;
    statusSearch: Locator;
    adminOptionRole: Locator;
    autocompleteSuggestion: (name: string) => Locator;

    constructor(page: Page) {
        super(page);
        this.addUserBtn = page.getByRole('button', { name: 'Add' });
        this.resetBtn = page.getByRole('button', { name: 'Reset' });
        this.searchBtn = page.getByRole('button', { name: 'Search' });
        this.userManagementTab = page.locator('span.oxd-topbar-body-nav-tab-item', { hasText: 'User Management' });
        this.jobTab = page.getByText('Job', { exact: true });
        this.organizationTab = page.getByText('Organization', { exact: true });
        this.qualificationsTab = page.getByText('Qualifications', { exact: true });
        this.nationalitiesTab = page.getByText('Nationalities', { exact: true });
        this.corporateBrandingTab = page.getByText('Corporate Branding', { exact: true });
        this.configurationTab = page.getByText('Configuration', { exact: true });
        this.helpButton = page.locator('button[title="Help"]');
        this.usernameInputSearch = page.locator("div.oxd-input-group:has(label:has-text('Username')) input");
        this.userRoleSearch = page.locator("div.oxd-input-group:has(label:has-text('User Role')) div.oxd-select-text");
        this.employeeNameSearch = page.getByPlaceholder("Type for hints...");
        this.statusSearch = page.locator("div.oxd-input-group:has(label:has-text('Status')) div.oxd-select-text");
        this.adminOptionRole = page.locator("div[role='listbox'] > div:has-text('Admin')");
        this.autocompleteSuggestion = (name: string) => page.locator(`div.oxd-autocomplete-option:has-text("${name}")`);
    }

    async verifyAdminPageUrl(expectedUrl) {
        await expect(this.page).toHaveURL(expectedUrl);
    }

    async verifyAdminNavBar() {
        await this.isVisible(this.userManagementTab);
        await this.isVisible(this.jobTab);
        await this.isVisible(this.organizationTab);
        await this.isVisible(this.qualificationsTab);
        await this.isVisible(this.nationalitiesTab);
        await this.isVisible(this.corporateBrandingTab);
        await this.isVisible(this.configurationTab);
        await this.isVisible(this.helpButton);
    }
    async verifyAdminSearchSection() {
        await this.isVisible(this.usernameInputSearch);
        await this.isVisible(this.userRoleSearch);
        await this.isVisible(this.employeeNameSearch);
        await this.isVisible(this.statusSearch);
        await this.isEnabled(this.searchBtn);
        await this.isEnabled(this.resetBtn);
    }

    async searchUserByUsername(username: string) {
        await this.usernameInputSearch.fill(username);
        await this.searchBtn.click();
    }

    async searchUserByEmployeeName(name: string) {
        await this.employeeNameSearch.fill(name);
        await this.page.waitForSelector('.oxd-autocomplete-dropdown', { state: 'visible' });
        const suggestion = this.autocompleteSuggestion(name);
        await suggestion.waitFor({ state: 'visible' });
        await this.searchBtn.click();
    }

    async searchUserByUserRole(role: 'Admin' | 'ESS') {
        await this.clickOnElement(this.userRoleSearch);
        const roleOption = this.page.locator(`div[role='listbox'] div:has-text("${role}")`);
        await this.clickOnElement(roleOption);
        await this.searchBtn.click();
    }

    async searchUserByStatus(status: 'Enabled' | 'Disabled') {
        await this.clickOnElement(this.statusSearch);
        const statusOption = this.page.locator(`div[role='listbox'] div:has-text("${status}")`);
        await this.clickOnElement(statusOption);
        await this.searchBtn.click();
    }
    async initiateCreatingNewUser() {
        await this.clickOnElement(this.addUserBtn);
    }

    async verifyTableData(columnIndex: number, expectedValue: string) {
        const rows = this.page.locator("div.oxd-table-body > div.oxd-table-card");
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const cell = rows.nth(i).locator(`div.oxd-table-cell >> nth=${columnIndex}`);
            await expect(cell, `Row ${i + 1} should have value "${expectedValue}"`).toHaveText(expectedValue);
        }
    }

    async expectNoResultsMessage() {
        const emptyMessage = this.page.locator("span.oxd-text:has-text('No Records Found')");
        await expect(emptyMessage).toBeVisible();
    }
}