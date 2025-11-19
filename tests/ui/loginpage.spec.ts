import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { testUser } from '../../src/users'

test.describe('Prihlaseni', () => {
    test('uzivatel se uspesne prihlasi', { tag:['@smoke', '@prihlaseni']}, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login(testUser.username, testUser.password)
        
        await expect(page.getByText(`Přihlášen ${testUser.fullName}`)).toBeVisible();
    });  
    test('uzivatel se pokusi prihlasit spatnym emailem', { tag:['@smoke', '@prihlaseni']}, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login('J.Doe@jd.com', testUser.password)
        
        await expect(page.getByText('Tyto přihlašovací údaje neodpovídají žadnému záznamu.')).toBeVisible();
    });
    test('uzivatel se pokusi prihlasit spatnym heslem', { tag:['@smoke', '@prihlaseni']}, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login(testUser.username, 'JaneD123')
        
        await expect(page.getByText('Tyto přihlašovací údaje neodpovídají žadnému záznamu.')).toBeVisible();
    }); 
});
test.describe('Zapomenute heslo', () => {
    test('uzivatel zapomnel heslo - spravny email', { tag:['@smoke', '@prihlaseni']}, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.forgottenPassword(testUser.username)
        
        await expect(page.locator('.toast-message', { hasText: 'E-mail s instrukcemi k obnovení hesla byl odeslán!' })).toBeVisible();
    });
    test('uzivatel zapomnel heslo - spatny email', { tag:['@smoke', '@prihlaseni']}, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.forgottenPassword('J.Doe@jd.com')
        
        await expect(page.getByText('Nepodařilo se nalézt uživatele s danou e-mailovou adresou.')).toBeVisible();
    });
});
test.describe('Presmerovani na registracni stranku', () => {
    test('uzivatel je zde poprve a musi se zaregistrovat', { tag:['@smoke', '@prihlaseni', '@registrace']}, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.register()
        
        await expect(page.getByText('Zaregistrovat')).toBeVisible();
    });
});