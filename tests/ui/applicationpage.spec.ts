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
            'Jane Doe',
            'Johny',
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
            'Jane Doe',
            'Jim',
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
            'Jane Doe',
            'Justin',
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
            'Jane Doe',
            'James',
            '01.01.2010',
            'email@test.cz',
            'cash',  // vybraná platební metoda
            false,
            'Bez omezení'
        );

        await expect(page.getByText('Hotově')).toBeVisible();
    }); 
});

test.describe('Create an application with and without health restrictions', () => {
    let homePage: HomePage;
    let applicationPage: ApplicationPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        homePage = new HomePage(page);
        applicationPage = new ApplicationPage(page);

        await loginPage.login(testUser.username, testUser.password);
    });

    test('uzivatel vyplni prihlasku bez zdravotních omezení', { tag:['@smoke', '@applicationpage', '@fill application']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Johny',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );

        await expect(page.getByText('Bankovní převod')).toBeVisible();
    });

    test('uzivatel vyplni prihlasku se zdravotnimi omezenimi', { tag:['@smoke', '@applicationpage', '@fill application']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Jim',
            '01.01.2010',
            'email@test.cz',
            'postal_order',  // vybraná platební metoda
            true,'alergie na lepek',
            'Bez omezení'
        );

        await expect(page.getByText('Složenka')).toBeVisible();
    }); 
});

test.describe('Display an application detail', () => {
    let applicationPage: ApplicationPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        applicationPage = new ApplicationPage(page);
        await loginPage.login(testUser.username, testUser.password);
    });

    test('uživatel si zobrazí detail přihlášky', { tag:['@smoke', '@applicationpage']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()

        await applicationPage.selectApplicationAndAction(studentsLastName, 'Detail');

        await expect(page.locator('h1', { hasText: studentsLastName })).toBeVisible();
    });
});

test.describe('Edit an application via list of applications', () => {
    let applicationPage: ApplicationPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        applicationPage = new ApplicationPage(page);
        await loginPage.login(testUser.username, testUser.password);
    });

    test('uživatel upraví v přihlášce jméno zákonného zástupce', { tag:['@smoke', '@applicationpage']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Anna',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Upravit');
        await applicationPage.editLegalRepresentativeName('Jane Smith')

        await applicationPage.selectApplicationAndAction(studentsLastName, 'Upravit');
        await expect(applicationPage.l_legalRepresentative).toHaveValue('Jane Smith');
    });

    test('uživatel upraví v přihlášce datum narození žáka', { tag:['@smoke', '@applicationpage']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Upravit');
        await applicationPage.editStudentsDateOfBirth('07.07.2007')

        await applicationPage.selectApplicationAndAction(studentsLastName, 'Upravit');
        await expect(applicationPage.l_studentsDateofBirth).toHaveValue('07.07.2007');
    });

    test('uživatel upraví v přihlášce email zákonného zástupce', { tag:['@smoke', '@applicationpage']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Upravit');
        await applicationPage.editLegalRepresentativeEmail('testemail@test.cz')

        await applicationPage.selectApplicationAndAction(studentsLastName, 'Upravit');
        await expect(applicationPage.l_legalRepresentativesEmail).toHaveValue('testemail@test.cz');
    });

    test('uživatel upraví v přihlášce způsob úhrady', { tag:['@smoke', '@applicationpage']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Upravit');
        await applicationPage.editPaymentMethod('cash')

        await applicationPage.selectApplicationAndAction(studentsLastName, 'Upravit');
        await expect(applicationPage.getPaymentLocator('cash')).toBeChecked();
    });

    test('uživatel zaklikne v přihlášce zdravotní omezení', { tag:['@smoke', '@applicationpage']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Upravit');
        await applicationPage.editHealthRestrictions(true, 'alergie na ořechy')

        await applicationPage.selectApplicationAndAction(studentsLastName, 'Upravit');
        await expect(applicationPage.l_healthRestrictions).toBeChecked();
        await expect(applicationPage.l_healthRestrictionsNote).toContainText('alergie na ořechy');
    });

    test('uživatel zruší zakliknutí zdravotního omezení', { tag:['@smoke', '@applicationpage']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            true,'alergie na banany',
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Upravit');
        await applicationPage.editHealthRestrictions(false)

        await applicationPage.selectApplicationAndAction(studentsLastName, 'Upravit');
        await expect(applicationPage.l_healthRestrictions).not.toBeChecked();
    });


    test('uživatel upraví v přihlášce poznámku', { tag:['@smoke', '@applicationpage']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Upravit');
        await applicationPage.editNote('Change text in the note')

        await applicationPage.selectApplicationAndAction(studentsLastName, 'Upravit');
        await expect(applicationPage.l_note).toHaveValue('Change text in the note');
    });
});

test.describe('Edit an application via application detail', () => {
    let applicationPage: ApplicationPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        applicationPage = new ApplicationPage(page);
        await loginPage.login(testUser.username, testUser.password);
    });

    test('uživatel upraví v přihlášce jméno zákonného zástupce', { tag:['@smoke', '@applicationpage']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Detail');
        await applicationPage.editInDetail();

        await applicationPage.editLegalRepresentativeName('Jane Smith')

        await applicationPage.editInDetail();
        await expect(applicationPage.l_legalRepresentative).toHaveValue('Jane Smith');
    });

    test('uživatel upraví v přihlášce datum narození žáka', { tag:['@smoke', '@applicationpage']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Detail');
        await applicationPage.editInDetail();
        await applicationPage.editStudentsDateOfBirth('07.07.2007')

        await applicationPage.editInDetail();
        await expect(applicationPage.l_studentsDateofBirth).toHaveValue('07.07.2007');
    });

    test('uživatel upraví v přihlášce email zákonného zástupce', { tag:['@smoke', '@applicationpage']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Detail');
        await applicationPage.editInDetail();
        await applicationPage.editLegalRepresentativeEmail('testemail@test.cz')

        await applicationPage.editInDetail();
        await expect(applicationPage.l_legalRepresentativesEmail).toHaveValue('testemail@test.cz');
    });

    test('uživatel upraví v přihlášce způsob úhrady', { tag:['@smoke', '@applicationpage']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Detail');
        await applicationPage.editInDetail();
        await applicationPage.editPaymentMethod('cash')

        await applicationPage.editInDetail();
        await expect(applicationPage.getPaymentLocator('cash')).toBeChecked();
    });

    test('uživatel zaklikne v přihlášce zdravotní omezení', { tag:['@smoke', '@applicationpage']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Detail');
        await applicationPage.editInDetail();
        await applicationPage.editHealthRestrictions(true, 'alergie na ořechy')

        await applicationPage.editInDetail();
        await expect(applicationPage.l_healthRestrictions).toBeChecked();
        await expect(applicationPage.l_healthRestrictionsNote).toContainText('alergie na ořechy');
    });

    test('uživatel zruší zakliknutí zdravotního omezení', { tag:['@smoke', '@applicationpage']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            true,'alergie na banany',
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Detail');
        await applicationPage.editInDetail();
        await applicationPage.editHealthRestrictions(false)

        await applicationPage.editInDetail();
        await expect(applicationPage.l_healthRestrictions).not.toBeChecked();
    });


    test('uživatel upraví v přihlášce poznámku', { tag:['@smoke', '@applicationpage']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Detail');
        await applicationPage.editInDetail();
        await applicationPage.editNote('Change text in the note')

        await applicationPage.editInDetail();
        await expect(applicationPage.l_note).toHaveValue('Change text in the note');
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
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );

        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Odhlášení účasti');
        await applicationPage.cancelApplication('nemoc');

        await applicationPage.selectApplicationAndAction(studentsLastName, 'Detail');
        await expect(page.getByText('Z důvodu nemoci')).toBeVisible();
    });

    test('uzivatel zrusi prihlasku z jineho duvodu', { tag:['@smoke', '@applicationpage', '@cancellation']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Odhlášení účasti');
        await applicationPage.cancelApplication('jiný');

        await applicationPage.selectApplicationAndAction(studentsLastName, 'Detail');
        await expect(page.getByText('Z jiných důvodů')).toBeVisible();
    });

    test('uzivatel zrusi prihlasku z jineho duvodu s uvedenim duvodu', { tag:['@smoke', '@applicationpage', '@cancellation']}, async ({ page }) => {
        await applicationPage.createNewApplication()
        const studentsLastName = await applicationPage.fillApplication(
            '02.02. - 06.02.2026',
            'Jane Doe',
            'Joe',
            '01.01.2010',
            'email@test.cz',
            'transfer',  // vybraná platební metoda
            false,
            'Bez omezení'
        );
        await page.locator('xpath=//*[@id="navbarSupportedContent"]/div[1]/a[2]').click()
        
        await applicationPage.selectApplicationAndAction(studentsLastName, 'Odhlášení účasti');
        await applicationPage.cancelApplication('jiný', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget justo et mi blandit rhoncus. Cras id efficitur eros. Aenean elementum dui eu justo scelerisque commodo. Proin a condimentum nisi. Ut dictum et sem nec volutpat.');

        await applicationPage.selectApplicationAndAction(studentsLastName, 'Detail');
        await expect(page.getByText('Z důvodu Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget justo et mi blandit rhoncus. Cras id efficitur eros. Aenean elementum dui eu justo scelerisque commodo. Proin a condimentum nisi. Ut dictum et sem nec volutpat.')).toBeVisible();

    });
});