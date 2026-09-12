import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try { localStorage.setItem("rm-consent", "reject"); } catch { /* Non-origin initial document. */ }
  });
});

for (const path of ["/", "/book-a-review", "/restaurant-finance-services", "/how-it-works"]) {
  test(`${path} stays readable without overflow`, async ({ page }, testInfo) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    if (testInfo.project.name === "phone-desktop-site") {
      expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches && matchMedia("(hover: none)").matches)).toBe(true);
      const grid = page.locator(path === "/" ? ".hero-grid" : path === "/book-a-review" ? ".form-grid" : ".page-hero-grid");
      expect(await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(1);
    }
    if (path === "/") {
      const image = page.locator(".home-restaurant-photo img");
      await expect(image).toBeVisible();
      expect(await image.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      if (testInfo.project.name === "phone-desktop-site") {
        expect(await page.locator(".home-intro").evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(22);
        expect((await image.boundingBox())!.width).toBeGreaterThan(800);
        const sectionsAreSeparated = await page.evaluate(() => {
          const links = document.querySelector(".home-context-links")!.getBoundingClientRect();
          const faq = document.querySelector(".home-faq")!.getBoundingClientRect();
          return links.bottom <= faq.top;
        });
        expect(sectionsAreSeparated).toBe(true);
      }
      await expect(page.locator("[data-story-chapter]")).toHaveCount(3);
      await expect(page.locator(".restaurant-illustration svg")).toBeVisible();
    }
  });
}

test("failed delivery preserves the enquiry and a retry can succeed", async ({ page }) => {
  await page.goto("/book-a-review");
  const submit = page.locator('form button[type="submit"]');
  await submit.click();
  await expect(page.locator("#name")).toBeFocused();
  await page.locator("#name").fill("QA test");
  await page.locator("#business").fill("QA restaurant");
  await page.locator("#email").fill("qa@example.com");
  await page.getByRole("checkbox").check();
  await page.route("**/api/review", route => route.fulfill({ status: 503, json: { message: "Delivery unavailable. Please retry." } }));
  await submit.click();
  await expect(page.locator(".form-error")).toContainText("Delivery unavailable");
  await expect(page.locator("#name")).toHaveValue("QA test");
  await page.unroute("**/api/review");
  await page.route("**/api/review", route => route.fulfill({ status: 200, json: { message: "Accepted" } }));
  await submit.click();
  await expect(page.locator(".form-success")).toBeFocused();
  await expect(page.getByRole("heading", { name: "Thank you. We have your enquiry." })).toBeVisible();
});

test("touch menu restores focus and operating story stays readable", async ({ page }, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name.startsWith("phone")) {
    const menu = page.getByRole("button", { name: "Open navigation" });
    await menu.click();
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
  }
  for (const chapter of await page.locator("[data-story-chapter]").all()) {
    await chapter.scrollIntoViewIfNeeded();
    await expect(chapter.locator(".working-paper")).toBeVisible();
    await expect(chapter.locator(".paper-action")).toContainText("The next check");
  }
});

test("homepage story and service paths work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("[data-story-chapter]")).toHaveCount(3);
  await expect(page.locator(".paper-note").last()).toContainText("A clear owner");
  await expect(page.locator('main a[href="/restaurant-turnaround-consulting"]').first()).toBeVisible();
  await context.close();
});

test("narrow windows and zoom-equivalent viewports keep the form usable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One desktop window covers zoom-equivalent layout widths.");
  for (const width of [1440, 1152, 960, 720]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/book-a-review");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await expect(page.locator("#name")).toBeVisible();
    expect(await page.locator("#name").evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
  }
});

test("ordinary motion survives scrolling and back navigation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "phone", "Representative touch viewport.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.goto("/how-it-works");
  await page.goBack();
  await expect(page.locator("h1")).toBeVisible();
  expect(await page.locator("h1").evaluate(el => parseFloat(getComputedStyle(el).opacity))).toBe(1);
});
