import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '../base.page';

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
    readonly l_note: Locator;
    readonly l_generalTermsAndConditionsAgreement: Locator;
    readonly l_submitButton: Locator;

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
        this.l_healthRestrictions = this.page.locator('#restrictions_yes');
        this.l_note = this.page.locator('#note');
        this.l_generalTermsAndConditionsAgreement = this.page.locator('label[for="terms_conditions"]');
        this.l_submitButton = this.page.getByRole('button', { name: 'Vytvořit přihlášku' });

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
        studentsLastName: string,
        studentsDateofBirth: string,
        legalRepresentativeEmail: string,
        paymentMethod: string,
        healthRestrictions: boolean = false,
        note: string
    ) {
        await this.selectDate(date);

        await this.l_legalRepresentative.fill(legalRepresentative);
        await this.l_studentsFirstName.fill(studentsFirstName);
        await this.l_studentsLastName.fill(studentsLastName);
        await this.l_studentsDateofBirth.fill(studentsDateofBirth);
        await this.l_legalRepresentativesEmail.fill(legalRepresentativeEmail);

        await this.selectPayment(paymentMethod);

        if (healthRestrictions) {
            await this.l_healthRestrictions.check();
        } else {
            await this.l_healthRestrictions.uncheck();
        }

        await this.l_note.fill(note);
        await this.l_generalTermsAndConditionsAgreement.check();
        await this.l_submitButton.click();
    }

    async selectApplicationAndAction(name: string, actionText: string) {
        const row = this.l_applicationRows.filter({
            has: this.page.locator(`td:first-child:text("${name}")`)
        });

        await row.first().waitFor({ state: 'visible' });

        await row.locator(`a:has-text("${actionText}")`).first().click();
    }

    async cancelApplication(reason: string) {
        switch (reason.toLowerCase()) {
            case 'nemoc':
                await this.l_reasonIllness.click();
                break;
            case 'jiný':
                await this.l_reasonOther.click();
                break;
            default:
                throw new Error(`Vyberte jednu z těchto možností.`);
        }

        await this.l_cancelSubmitButton.click();
    }

}
