import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '../base.page';
import { generateRandomEmail } from '../util';

export class RegistrationPage extends BasePage {
    readonly l_name: Locator;
    readonly l_email: Locator;
    readonly l_password: Locator;
    readonly l_confirmPassword: Locator;
    readonly l_submit: Locator;

    constructor(page: Page) {
        super(page, '/registrace')

        this.l_name = this.page.locator("input#name");
        this.l_email = this.page.locator("input#email");
        this.l_password = this.page.locator("input#password");
        this.l_confirmPassword = this.page.locator("input#password-confirm");
        this.l_submit = this.page.locator(".btn-primary");
    }

    private async register(email: string, password: string){
        
        await this.l_name.fill('Jane Doe');
        await this.l_email.fill(email);
        await this.l_password.fill(password);
        await this.l_confirmPassword.fill(password);
        await this.l_submit.click();
    }

    async registerNewUser(){
        await this.register(generateRandomEmail(), 'Jane123');
    }

    async registerNewUserWithExistingEmail(){
        await this.register('Jane.Doe@jd.com', 'Jane123');
    }

    async registerNewUserWithWrongPassword(){
        await this.register(generateRandomEmail(), '12345');
    }
}