import { type Page, type Locator } from "@playwright/test";

export abstract class BasePage {
    readonly page: Page;
    readonly url: string;
    readonly regex: RegExp;

    readonly pageTitle: string | undefined;
    readonly l_pageTitle: Locator | undefined;

    constructor(
        page:Page,
        url: string,
        pageTitle?: string,
        l_pageTitle?: Locator
    ) {
        this.page = page;
        this.url = url;
        this.pageTitle = pageTitle;
        this.l_pageTitle = l_pageTitle;

        this.regex = new RegExp('.*' + this.url + '.*');
    }

    async goto(): Promise<void> {
        await this.page.goto(this.url);
    }
}