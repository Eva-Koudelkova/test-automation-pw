import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class LoginPage extends BasePage {
    readonly l_email: Locator;
    readonly l_password: Locator;
    readonly l_submit: Locator;
    readonly l_forgottenPassword: Locator;
    readonly l_registration: Locator;

    constructor(page: Page) {
        super(page, 'prihlaseni')

        this.l_email = this.page.locator("input#email");
        this.l_password = this.page.locator("input#password");
        this.l_submit = this.page.locator(".btn-primary");
        this.l_forgottenPassword = this.page.getByRole('link', { name: 'Zapomněli jste své heslo?' });
        this.l_registration = this.page.getByRole('link', { name: 'Zaregistrujte se' });
    }

    async login(email: string, password: string){
        await this.goto();
        await this.l_email.fill(email);
        await this.l_password.fill(password);
        await this.l_submit.click();
    }
    
    async forgottenPassword(email: string){
        await this.goto();
        await this.l_forgottenPassword.click();
        await this.l_email.fill(email);
        await this.l_submit.click();
    }

    async register(){
        await this.goto();
        await this.l_registration.click();
    }
}