import { test } from "@playwright/test";

test("should open login page", async ({ page }) => {
    await page.goto("/prihlaseni");
    await page.locator("input#email").screenshot({ path: "css_id_email.png"});
    await page.locator(".btn-primary").screenshot({ path: "submit_button.png"});
    //await page.locator("div").locator("form").locator("input[type$='word']").screenshot({ path: "chain.png"});
    //await page.getByRole("heading", {level: 1}).screenshot({ path: "heading.png"});
    //await page.getByText("Zapomněli jste své heslo?").screenshot({ path: "passfgt.png"});
    console.log(await page.title());
});

test("HW", async ({ page }) => {
    await page.goto("/registrace");
    await page.locator("input#name").screenshot({ path: "surname.png"});
    await page.locator("input#email").screenshot({ path: "css_id_email.png"});
    await page.locator("input#password").screenshot({ path: "pwconf.png"});
    await page.locator("input#password-confirm").screenshot({ path: "pw.png"});
    await page.locator(".btn-primary").screenshot({ path: "submit_button.png"});
    console.log(await page.title());
});