import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/registration.page';
 
test('HW1', async ({ page }) => {
    /*
    Najdi vhodné lokátory pro všechny prvky formuláře:
            Políčko pro jméno a příjmení 
            Políčko pro email 
            Políčko pro zadání hesla 
            Políčko pro kontrolu zadaného hesla 
            Tlačítko na registraci
    */
    await page.goto("/registrace");
    await page.locator("input#name").screenshot({ path: "surname.png"});
    await page.locator("input#email").screenshot({ path: "css_id_email.png"});
    await page.locator("input#password").screenshot({ path: "pwconf.png"});
    await page.locator("input#password-confirm").screenshot({ path: "pw.png"});
    await page.locator(".btn-primary").screenshot({ path: "submit_button.png"});
    console.log(await page.title());
});

test('HW2', async ({ page }) => {
    /*
    Napiš kód který na stránce pro registraci vyplní
            Jméno a příjmení 
            Email 
            Heslo
            Kontrolu hesla
    a klikne na tlačítko pro odeslání registračního formuláře
    */
    await page.goto("/registrace");
    await page.locator("input#name").fill('Jane Doe');
    await page.locator("input#email").fill('Jane.Doe@jd.com');
    await page.locator("input#password").fill('Jane123');
    await page.locator("input#password-confirm").fill('Jane123');
    await page.locator(".btn-primary").click();
});

test('HW3', async ({ page }) => {
    /*
    1. Test který provede validní registraci uživatele - kontroluj, že registrace proběhla úspěšně (pro unikátnost můžete do adresy mailu přidat aktuální čas v ms pomocí Date.now() )
    2. Test, který provede registraci uživatele s již existujícím emailem - zkontroluj, že registrace neproběhla a ověř chyby 
    3. Test, který provede registraci uživatele s nevalidním heslem (obsahující pouze čísla) - zkontroluj, že registrace neproběhla a ověř chyby
    */

    const randomEmail = (): string => {
        const randomNumber = Math.floor(Math.random() * 10_000);
        const padded = randomNumber.toString().padStart(4, '0');
        return `Jane.Doe${padded}@jd.com`;
    };
    const email = randomEmail();

    //uspesna registrace
    await page.goto("/registrace");
    await page.locator("input#name").fill('Jane Doe');
    await page.locator("input#email").fill(email);
    await page.locator("input#password").fill('Jane123');
    await page.locator("input#password-confirm").fill('Jane123');
    await page.locator(".btn-primary").click();

    await expect(page.getByText('Přihlášen Jane Doe')).toBeVisible();

    //odhlaseni
    await page.getByText('Jane Doe').click();
    await page.locator('#logout-link').click();

    //registrace s jiz existujicim emailem
    await page.goto("/registrace");
    await page.locator("input#name").fill('Jane Doe');
    await page.locator("input#email").fill(email);
    await page.locator("input#password").fill('Jane123');
    await page.locator("input#password-confirm").fill('Jane123');
    await page.locator(".btn-primary").click();

    await expect(page.getByText('Účet s tímto emailem již existuje')).toBeVisible();

    //registrace s nevalidnim heslem 
    const email2 = randomEmail();

    await page.goto("/registrace");
    await page.locator("input#name").fill('Jane Doe');
    await page.locator("input#email").fill(email2);
    await page.locator("input#password").fill('12345');
    await page.locator("input#password-confirm").fill('12345');
    await page.locator(".btn-primary").click();

    await expect(page.getByText('Heslo musí obsahovat minimálně 6 znaků, velké i malé písmeno a číslici')).toBeVisible();
});

test.describe("HW4 Registrace", () => {
    /*
    Dokonči úkol z minulé lekce a podívej se na něj. V rámci začátku testů se tam pravděpodobně něco opakuje.
    Zkus vymyslet, jak lépe testy pomocí poznatků z této lekce vylepšit, aby se nám to neopakovalo.
    Nezapomeň všem testům dát pěkná, popisná jména.
    Pokud budeš chtít, můžeš prvnímu testu přiřadit tag smoke, případně zkusit vymyslet i použití anotací nebo tagů pro jiné testy.
    */
    test("uspesna registrace", { tag: "@smoke" }, async ({ page }) => {
        const randomEmail = (): string => {
            const randomNumber = Math.floor(Math.random() * 10_000);
            const padded = randomNumber.toString().padStart(4, '0');
            return `Jane.Doe${padded}@jd.com`;
        };
        const email = randomEmail();

        //uspesna registrace
        await page.goto("/registrace");
        await page.locator("input#name").fill('Jane Doe');
        await page.locator("input#email").fill(email);
        await page.locator("input#password").fill('Jane123');
        await page.locator("input#password-confirm").fill('Jane123');
        await page.locator(".btn-primary").click();

        await expect(page.getByText('Přihlášen Jane Doe')).toBeVisible();
    });  
    test("registrace s jiz existujicim emailem", async ({ page }) => {
        await page.goto("/registrace");
        await page.locator("input#name").fill('Jane Doe');
        await page.locator("input#email").fill('Jane.Doe@jd.com');
        await page.locator("input#password").fill('Jane123');
        await page.locator("input#password-confirm").fill('Jane123');
        await page.locator(".btn-primary").click();

        await expect(page.getByText('Účet s tímto emailem již existuje')).toBeVisible();
    });
    test("registrace s nevalidnim heslem", async ({ page }) => {
        const randomEmail = (): string => {
            const randomNumber = Math.floor(Math.random() * 10_000);
            const padded = randomNumber.toString().padStart(4, '0');
            return `Jane.Doe${padded}@jd.com`;
        };
        const email = randomEmail();

        await page.goto("/registrace");
        await page.locator("input#name").fill('Jane Doe');
        await page.locator("input#email").fill(email);
        await page.locator("input#password").fill('12345');
        await page.locator("input#password-confirm").fill('12345');
        await page.locator(".btn-primary").click();

        await expect(page.getByText('Heslo musí obsahovat minimálně 6 znaků, velké i malé písmeno a číslici')).toBeVisible();
    });
});

test.describe("HW5 Registrace", () => {
    /*
    Sniž výskyt duplicitního kódu z minulé lekce pomocí použití funkcí.
    */
    test("uspesna registrace", { tag:['@smoke', '@registrace']}, async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        await registrationPage.registerNewUser()
        await expect(page.getByText('Přihlášen Jane Doe')).toBeVisible();
    });  
    test("registrace s jiz existujicim emailem", { tag:['@registrace']}, async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        await registrationPage.registerNewUserWithExistingEmail()
        await expect(page.getByText('Účet s tímto emailem již existuje')).toBeVisible();
    });
    test("registrace s nevalidnim heslem", { tag:['@registrace']}, async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        await registrationPage.registerNewUserWithWrongPassword()
        await expect(page.getByText('Heslo musí obsahovat minimálně 6 znaků, velké i malé písmeno a číslici')).toBeVisible();
    });
});