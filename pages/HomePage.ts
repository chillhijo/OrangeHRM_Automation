import { Locator, Page, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly dashboardTitle: Locator;
    readonly upgradeButton: Locator;
    readonly userDropdown: Locator;
    readonly timeAtWorkDivTitle: Locator;
    readonly myActionsDivTitle: Locator;
    readonly quickLaunchDivTitle: Locator;
    readonly assignLeaveBtn: Locator;
    readonly adminMenu: Locator;
    readonly logoutBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardTitle = page.locator(".oxd-topbar-header-breadcrumb");
        this.upgradeButton = page.locator(".oxd-glass-button.orangehrm-upgrade-button");
        this.userDropdown = page.locator(".oxd-userdropdown-tab");
        this.timeAtWorkDivTitle = page.getByText("Time at Work");
        this.myActionsDivTitle = page.getByText("My Actions");
        this.quickLaunchDivTitle = page.getByText("Quick Launch");
        this.assignLeaveBtn = page.getByRole("button", { name: "Assign Leave" });
        this.adminMenu = page.locator("a[href='/web/index.php/admin/viewAdminModule']");
        this.logoutBtn = this.page.getByRole('menuitem', { name: 'Logout' })
    }

    async verifyDashboardPage(expectedUrl: string, title: string): Promise<void> {
        await expect(this.page).toHaveURL(expectedUrl);
        await expect(this.dashboardTitle).toBeVisible();
        await expect(this.dashboardTitle).toHaveText(title);
        await expect(this.userDropdown).toBeEnabled();
        await expect(this.upgradeButton).toBeEnabled();
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
            await expect(locator).toBeVisible();
        }
    }

    async verifySectionsOnDashboardPage(): Promise<void> {
        await expect(this.timeAtWorkDivTitle).toBeVisible();
        await expect(this.myActionsDivTitle).toBeVisible();
        await expect(this.quickLaunchDivTitle).toBeVisible();

        // If we know that we aren`t going to interact anymore with these "DivTitles" we can write it like this
        await expect(this.page.getByText('Buzz Latest Posts')).toBeVisible();
        await expect(this.page.getByText('Employees on Leave Today')).toBeVisible();
        await expect(this.page.getByText('Employee Distribution by Sub Unit')).toBeVisible();
        await expect(this.page.getByText('Employee Distribution by Location')).toBeVisible();
    }

    async navigateToAdminPAge(expectedUrl: string): Promise<void> {
        await this.adminMenu.click();
        await expect(this.page).toHaveURL(expectedUrl);
    }

    //This method can be use for furher tests and navigation for Leave page
    async makeAssignLeave(): Promise<void> {
        await expect(this.assignLeaveBtn).toBeVisible();
        await expect(this.assignLeaveBtn).toBeEnabled();
        await this.assignLeaveBtn.click();
    }

    async lougoutFromOrangeHRM() {
        await this.userDropdown.click();
        await this.logoutBtn.click();
    }
}
