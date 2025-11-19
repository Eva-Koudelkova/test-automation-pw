import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/home.page';

test.describe('Homepage', () => {
    test('zobrazi se kontatkni informace', { tag:['@smoke', '@homepage']}, async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.contactInformation()
        
        const mapFrame = page.frameLocator('iframe[src*="mapy.cz"]');

        await expect(mapFrame.locator('#mapycz')).toBeVisible({ timeout: 60000 });
    });  
    test('zobrazi se domovska stranka via Domu', { tag:['@homepage']}, async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.contactInformation()
        await homePage.returnToHomepage()
        
        await expect(page.getByText('Vyberte období akce')).toBeVisible();
    });
    test('zobrazi se domovska stranka via logo', { tag:['@homepage']}, async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.contactInformation()
        await homePage.returnToHomepageViaLogo()
        
        await expect(page.getByText('Vyberte období akce')).toBeVisible();
    });
    test('zobrazi se menu Pro rodice', { tag:['@homepage']}, async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.forParentsMenu()

        await homePage.forDropdownMenuToBeVisible('Návody a formuláře');
        await homePage.forDropdownMenuToBeVisible('Vytvořit přihlášku');
    });
    test('zobrazi se menu Pro ucitele', { tag:['@homepage']}, async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.forTeachersMenu()

        await homePage.forDropdownMenuToBeVisible('Návody a formuláře');
        await homePage.forDropdownMenuToBeVisible('Objednávka pro MŠ/ZŠ');
    });
});