import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { testUser } from '../../src/users'
import { ApplicationPage } from '../../src/pages/application.page';
import { HomePage } from '../../src/pages/home.page';

test.describe('Create an application from homepage', () => {

    test('uživatel se prokliká na přihlášku z homepage', { tag:['@smoke', '@applicationpage']}, async ({ page }) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);
        const applicationPage = new ApplicationPage(page);

        await loginPage.login(testUser.username, testUser.password);

        await homePage.returnToHomepage();
        await applicationPage.l_moreInformation.click();
        await applicationPage.l_createApplication.click();

        await expect(page.locator('span.breadcrumb-item.active')).toBeVisible();
    });
});

test.describe('Create an application with different payment methods', () => {
    let homePage: HomePage;
    let applicationPage: ApplicationPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        homePage = new HomePage(page);
        applicationPage = new ApplicationPage(page);

        await loginPage.login(testUser.username, testUser.password);
    });

    test('uzivatel vyplni prihlasku s platebni metodou bankovní převod', { tag:['@smoke', '@applicationpage', '@fill application']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jan Novák',
            'Petr',
            'Novák',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );

        await expect(page.getByText('Bankovní převod')).toBeVisible();
    });

    test('uzivatel vyplni prihlasku s platebni metodou složenka', { tag:['@smoke', '@applicationpage', '@fill application']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jan Novák',
            'Petr',
            'Novák',
            '01.01.2010',
            'email@test.cz',
            'postal_order',  // vybraná platební metoda
            false,
            'Bez omezení'
        );

        await expect(page.getByText('Složenka')).toBeVisible();
    }); 

    test('uzivatel vyplni prihlasku s platebni metodou FKSP', { tag:['@smoke', '@applicationpage', '@fill application']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jan Novák',
            'Petr',
            'Novák',
            '01.01.2010',
            'email@test.cz',
            'fksp',  // vybraná platební metoda
            false,
            'Bez omezení'
        );

        await expect(page.getByText('FKSP')).toBeVisible();
    }); 

    test('uzivatel vyplni prihlasku s platebni metodou hotově', { tag:['@smoke', '@applicationpage', '@fill application']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jan Novák',
            'Petr',
            'Novák',
            '01.01.2010',
            'email@test.cz',
            'cash',  // vybraná platební metoda
            false,
            'Bez omezení'
        );

        await expect(page.getByText('Hotově')).toBeVisible();
    }); 
});

test.describe('cancellation of an application', () => {
    let applicationPage: ApplicationPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        applicationPage = new ApplicationPage(page);

        await loginPage.login(testUser.username, testUser.password);
    });

    test('uzivatel zrusi prihlasku z duvodu nemoci', { tag:['@smoke', '@applicationpage', '@cancellation']}, async ({ page }) => {
        await applicationPage.selectApplicationAndAction('Jim Doe', 'Odhlášení účasti');
        await applicationPage.cancelApplication('nemoc');

    });

        test('uzivatel zrusi prihlasku z jineho duvodu', { tag:['@smoke', '@applicationpage', '@cancellation']}, async ({ page }) => {
        await applicationPage.selectApplicationAndAction('Petr Novák', 'Odhlášení účasti');
        await applicationPage.cancelApplication('jiný');

    });
});