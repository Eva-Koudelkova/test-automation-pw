import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../../src/pages/registration.page';

test.describe('Registrace', () => {
    test('novy uzivatel se uspesne registruje', { tag:['@smoke', '@registrace']}, async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        await registrationPage.registerNewUser()
        
        await expect(page.getByText('Přihlášen Jane Doe')).toBeVisible();
    });  
    test('novy uzivatel se pokusi registrovat s jiz existujicim emailem', { tag:['@registrace']}, async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        await registrationPage.registerNewUserWithExistingEmail()
        
        await expect(page.getByText('Účet s tímto emailem již existuje')).toBeVisible();
    });
    test('novy uzivatel se pokusi registrovat s nevalidnim heslem', { tag:['@registrace']}, async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        await registrationPage.registerNewUserWithWrongPassword()
        
        await expect(page.getByText('Heslo musí obsahovat minimálně 6 znaků, velké i malé písmeno a číslici')).toBeVisible();
    });
});