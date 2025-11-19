import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class HomePage extends BasePage {
    readonly l_logo: Locator;
    readonly l_home: Locator;
    readonly l_applications: Locator;
    readonly l_forParents: Locator;
    readonly l_forTeachers: Locator;
    readonly l_contact: Locator;
    readonly l_usernameDropDown: Locator;
    readonly l_logoutButton: Locator;
    readonly l_contactMap: Locator;
    readonly l_dropdown: Locator;

    constructor(page: Page) {
        super(page, '')
        this.l_logo = this.page.getByRole('img', { name: 'Domů' });
        this.l_home = this.page.getByRole('link', { name: 'Domů' }).first();
        this.l_applications = this.page.getByRole('link', { name: 'Přihlášky' });
        this.l_forParents = this.page.getByRole('button', { name: 'Pro rodiče' });
        this.l_forTeachers = this.page.getByRole('button', { name: 'Pro učitelé' });
        this.l_contact = this.page.getByRole('link', { name: 'Kontakt' });
        this.l_usernameDropDown = this.page.locator('a.dropdown-toggle strong');
        this.l_logoutButton = this.page.locator('#logout-link');
        this.l_contactMap = this.page.locator('img[src*="poiimg/icon/141"]');
        this.l_dropdown = this.page.locator('div.dropdown-menu.submenu.show')
    }

    async returnToHomepage(): Promise<void> {
        await this.l_home.click();
    }

    async returnToHomepageViaLogo(): Promise<void> {
        await this.l_logo.click();
    }

    async contactInformation(): Promise<void> {
        await this.goto();
        await this.l_contact.click();
    }

    async forParentsMenu(): Promise<void> {
        await this.goto();
        await this.l_forParents.click();
    }

    async forTeachersMenu(): Promise<void> {
        await this.goto();
        await this.l_forTeachers.click();
    }

    async forDropdownMenuToBeVisible(text: string): Promise<void> {
        const menuItem = this.l_dropdown.locator(`text=${text}`);
        await expect(menuItem).toBeVisible();
    }

    async loggedInUserConfirmation(name: string): Promise<void> {
    await expect(this.l_usernameDropDown).toHaveText(name);
    }

    async logout(): Promise<void> {
        await this.l_usernameDropDown.click();
        await this.l_logoutButton.click();
    }
}