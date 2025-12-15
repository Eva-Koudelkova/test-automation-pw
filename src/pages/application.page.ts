import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../base.page';
import { generateRandomName } from '../util';

export class ApplicationPage extends BasePage {
    //lokátory pro vytvoření přihlášky
    readonly l_createNewApplication: Locator;
    readonly l_moreInformation: Locator;
    readonly l_createApplication: Locator;
    readonly l_dateDropdown: Locator;
    readonly l_legalRepresentative: Locator;
    readonly l_studentsFirstName: Locator;
    readonly l_studentsLastName: Locator;
    readonly l_studentsDateofBirth: Locator;
    readonly l_legalRepresentativesEmail: Locator;
    readonly l_healthRestrictions: Locator;
    readonly l_healthRestrictionsNote: Locator;
    readonly l_note: Locator;
    readonly l_generalTermsAndConditionsAgreement: Locator;
    readonly l_submitButton: Locator;
    readonly l_editButton: Locator;
    readonly l_editInDetail: Locator;

    //lokátory pro vybrání přihlášky a akce
    readonly l_applicationRows: Locator;

    //lokátory pro zrušení přihlášky
    readonly l_reasonIllness: Locator;
    readonly l_reasonOther: Locator;
    readonly l_cancelSubmitButton: Locator;

    constructor(page: Page) {
        super(page, '');

        this.l_createNewApplication = this.page.locator('xpath=/html/body/div/div/div/div/div/div[1]/a');
        this.l_moreInformation = this.page.getByText('Více informací');
        this.l_createApplication = this.page.locator('xpath=/html/body/div/div/div/div/div/div/div/div[2]/a');
        this.l_dateDropdown = this.page.locator('button[data-id="term_id"]');
        this.l_legalRepresentative = this.page.locator('#parent_name');
        this.l_studentsFirstName = this.page.locator('#forename');
        this.l_studentsLastName = this.page.locator('#surname');
        this.l_studentsDateofBirth = this.page.locator('#birthday');
        this.l_legalRepresentativesEmail = this.page.locator('#email');
        this.l_healthRestrictions = this.page.locator('label[for="restrictions_yes"]');
        this.l_healthRestrictionsNote = this.page.locator('#restrictions');
        this.l_note = this.page.locator('#note');
        this.l_generalTermsAndConditionsAgreement = this.page.locator('label[for="terms_conditions"]');
        this.l_submitButton = this.page.getByRole('button', { name: 'Vytvořit přihlášku' });
        this.l_editButton = this.page.getByRole('button', { name: 'Upravit přihlášku' });
        this.l_editInDetail = this.page.locator('a', { hasText: 'Upravit' });

        this.l_applicationRows = this.page.locator('#DataTables_Table_0 tbody tr');

        this.l_reasonIllness = this.page.locator('label[for="logged_out_illness"]');
        this.l_reasonOther = this.page.locator('label[for="logged_out_other"]');
        this.l_cancelSubmitButton = this.page.locator('input[type="submit"][value="Odhlásit žáka"]');
    }

    async createNewApplication() {
        await this.l_createNewApplication.click();
        await this.l_moreInformation.click();
        await this.l_createApplication.click();
    }

    async selectDate(date: string) {
        await this.l_dateDropdown.click();
        await this.page.locator('.dropdown-menu.show a[role="option"]')
            .filter({ hasText: date })
            .click();
    }

    async selectPayment(paymentMethod: string) {
        // Map human-readable method to radio button id
        const paymentMap: Record<string, string> = {
            'transfer': 'payment_transfer',
            'postal_order': 'payment_postal_order',
            'fksp': 'payment_fksp',
            'cash': 'payment_cash',
        };

        const paymentId = paymentMap[paymentMethod.toLowerCase()];
        const radio = this.page.locator(`label[for="${paymentId}"]`);
        await radio.check();
    }

    async fillApplication(
        date: string,
        legalRepresentative: string,
        studentsFirstName: string,
        studentsDateofBirth: string,
        legalRepresentativeEmail: string,
        paymentMethod: string,
        healthRestrictions: boolean = false,
        note: string,
        healthRestrictionsNote?: string
    ) {
        const studentsLastName = generateRandomName();

        await this.selectDate(date);

        await this.l_legalRepresentative.fill(legalRepresentative);
        await this.l_studentsFirstName.fill(studentsFirstName);
        await this.l_studentsLastName.fill(studentsLastName);
        await this.l_studentsDateofBirth.fill(studentsDateofBirth);
        await this.l_legalRepresentativesEmail.fill(legalRepresentativeEmail);

        await this.selectPayment(paymentMethod);

        // Zapnutí checkboxu a vyplnění textarea, pokud je předán text
        if (healthRestrictions) {
            const isChecked = await this.l_healthRestrictions.isChecked();
            if (!isChecked) {
                await this.l_healthRestrictions.click();
            }

            if (healthRestrictionsNote) {
                await this.l_healthRestrictionsNote.fill(healthRestrictionsNote);
            }
        }

        await this.l_note.fill(note);
        await this.l_generalTermsAndConditionsAgreement.check();
        await this.l_submitButton.click();

        return studentsLastName;
    }

    async selectApplicationAndAction(name: string, actionText: string) {
        // vyhledávání
        await this.page.locator('input[type="search"]').fill(name);

        // počkáme, než se zobrazí správný řádek
        const row = this.page.locator('tr', { hasText: name });
        await expect(row).toBeVisible();

        // vybere akci podle textu tlačítka
        const actionButton = row.locator('a', { hasText: actionText });
        await expect(actionButton).toBeVisible();

        await actionButton.click();
    }

    async editInDetail() {
        await this.l_editInDetail.click();
    }

    async cancelApplication(reason: string, customReason?: string) {
        switch (reason.toLowerCase()) {
            case 'nemoc':
                await this.l_reasonIllness.click();
                break;
            case 'jiný':
                await this.l_reasonOther.click();

                // pokud byl předán text, tak ho vyplníme
                if (customReason) {
                    const reasonField = this.page.locator('#logged_out_reason');
                    await reasonField.fill(customReason);
                }
                break;
            default:
                throw new Error(`Vyberte jednu z těchto možností.`);
        }

        await this.l_cancelSubmitButton.click();
    }

    async editLegalRepresentativeName(legalRepresentative: string) {
        await this.l_legalRepresentative.fill(legalRepresentative);
        await this.l_editButton.click();
    }

    async editStudentsDateOfBirth(newStudentsDateOfBirth: string) {
        await this.l_studentsDateofBirth.fill(newStudentsDateOfBirth);
        await this.l_editButton.click();
    }

    async editLegalRepresentativeEmail(newLegalRepresentativeEmail: string) {
        await this.l_legalRepresentativesEmail.fill(newLegalRepresentativeEmail);
        await this.l_editButton.click();
    }

    async editPaymentMethod(paymentMethod: string) {
        await this.selectPayment(paymentMethod)
        await this.l_editButton.click();
    }

    getPaymentLocator(method: string) {
        return this.page.locator(`input[id="payment_${method}"]`);
    }

    async editHealthRestrictions(healthRestrictions: boolean, specificIssue?: string) {
        const isChecked = await this.l_healthRestrictions.isChecked();
        // pokud chceme zapnout a není zapnuto
        if (healthRestrictions && !isChecked) {
            await this.l_healthRestrictions.click();
        }
        // pokud je checkbox zapnutý a je předán text, vyplníme textarea
        const isNowChecked = await this.l_healthRestrictions.isChecked();
        if (isNowChecked && specificIssue) {
            await this.l_healthRestrictionsNote.fill(specificIssue);
        }
        // pokud chceme vypnout a je zapnuto
        if (!healthRestrictions && isChecked) {
            await this.l_healthRestrictions.click();
        }
        await this.l_editButton.click();
    }

    async editNote(note: string) {
        await this.l_note.fill(note);
        await this.l_editButton.click();
    }
}
