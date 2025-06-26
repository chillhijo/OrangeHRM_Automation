import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class HomePage extends BasePage {
    dashboardTitle: Locator;
    upgradeButton: Locator;
    userDropdown: Locator;
    timeAtWorkDivTitle: Locator;
    myActionsDivTitle: Locator;
    quickLaunchDivTitle: Locator;
    assignLeaveBtn: Locator;
    adminMenu: Locator;

    constructor(page: Page) {
        super(page);
        this.dashboardTitle = page.locator(".oxd-topbar-header-breadcrumb");
        this.upgradeButton = page.locator(".oxd-glass-button.orangehrm-upgrade-button");
        this.userDropdown = page.locator(".oxd-userdropdown-tab");
        this.timeAtWorkDivTitle = page.getByText("Time at Work");
        this.myActionsDivTitle = page.getByText("My Actions");
        this.quickLaunchDivTitle = page.getByText("Quick Launch");
        this.assignLeaveBtn = page.getByRole("button", { name: "Assign Leave" });
        this.adminMenu = page.locator("a[href='/web/index.php/admin/viewAdminModule']");
    }

    async verifyDashboardPage(expectedUrl: string, title: string): Promise<void> {
        await expect(this.page).toHaveURL(expectedUrl);
        await expect(this.dashboardTitle).toBeVisible();
        await this.hasText(this.dashboardTitle, title);
        await this.isEnabled(this.userDropdown);
        await this.isEnabled(this.upgradeButton);
    }

    async verifyLeftSideMenu() {
        const hrefs = [
            "/web/index.php/admin/viewAdminModule",
            "/web/index.php/pim/viewPimModule",
            "/web/index.php/leave/viewLeaveModule",
            "/web/index.php/time/viewTimeModule",
            "/web/index.php/recruitment/viewRecruitmentModule",
            "/web/index.php/pim/viewMyDetails",
            "/web/index.php/performance/viewPerformanceModule",
            "/web/index.php/dashboard/index",
            "/web/index.php/directory/viewDirectory",
            "/web/index.php/maintenance/viewMaintenanceModule",
            "/web/index.php/claim/viewClaimModule",
            "/web/index.php/buzz/viewBuzz"
        ];

        for (const href of hrefs) {
            const locator = this.page.locator(`a[href="${href}"]`);
            await this.isVisible(locator);
        }
    }

    async verifySectionsOnDashboardPage(): Promise<void> {
        await this.isVisible(this.timeAtWorkDivTitle);
        await this.isVisible(this.myActionsDivTitle);
        await this.isVisible(this.quickLaunchDivTitle);

        // If we know that we aren`t going to interact anymore with these "DivTitles" we can write it like this
        await expect(this.page.getByText('Buzz Latest Posts')).toBeVisible();
        await expect(this.page.getByText('Employees on Leave Today')).toBeVisible();
        await expect(this.page.getByText('Employee Distribution by Sub Unit')).toBeVisible();
        await expect(this.page.getByText('Employee Distribution by Location')).toBeVisible();
    }

    async navigateToAdminPAge(expectedUrl: string): Promise<void> {
        await this.clickOnElement(this.adminMenu);
        await expect(this.page).toHaveURL(expectedUrl);
    }

    //This method can be use for furher tests and navigation for Leave page
    async makeAssignLeave(): Promise<void> {
        await this.isVisible(this.assignLeaveBtn);
        await this.isEnabled(this.assignLeaveBtn);
        await this.clickOnElement(this.assignLeaveBtn);
    }

    async lougoutFromOrangeHRM() {
        const logoutBtn = this.page.getByRole('menuitem', { name: 'Logout' });
        await this.clickOnElement(this.userDropdown);
        await this.clickOnElement(logoutBtn);
    }
}
