import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => localStorage.setItem("rm-consent", "reject"));
});

test("homepage fits the viewport and keeps navigation controls inside the header", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.ready === "true");
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  const header = (await page.locator(".site-header").boundingBox())!;
  for (const selector of [".brand-link", ".theme-toggle", ".menu-button"]) {
    const box = (await page.locator(selector).boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(header.x);
    expect(box.x + box.width).toBeLessThanOrEqual(header.x + header.width);
  }
  await expect(page.locator(".mobile-cta")).toBeHidden();
  if (testInfo.project.name.startsWith("phone")) {
    expect(await page.locator(".home-opening-copy").evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(1);
  }
});

test("all demo tabs remain reachable and screenshots open and close", async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.ready === "true");
  const tabs = page.locator("#workspace-preview [role=tab]");
  const boxes = await Promise.all((await tabs.all()).map(tab => tab.boundingBox()));
  expect(new Set(boxes.map(box => Math.round(box!.y))).size).toBe(1);
  await tabs.first().focus();
  await page.keyboard.press("End");
  await expect(tabs.last()).toBeFocused();
  await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Enlarge Cash position screenshot" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close screenshot" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Enlarge Cash position screenshot" }).first()).toBeFocused();
});

test("the menu stays usable in narrow desktop windows and small phones", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One project covers the additional window widths.");
  for (const width of [320, 360, 600, 820, 1024, 1152]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.waitForFunction(() => document.documentElement.dataset.ready === "true");
    await expect(page.locator(".desktop-nav")).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const menu = page.getByRole("button", { name: "Open navigation" });
    await menu.click();
    await expect(page.getByRole("navigation", { name: "Main menu", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
  }
});

test("phone dashboard can be panned and expanded with a visible control", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "phone", "The enlarged inline preview is phone-specific.");
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.ready === "true");
  const preview = page.getByRole("region", { name: "Operations overview dashboard preview" });
  await preview.scrollIntoViewIfNeeded();
  expect(await preview.evaluate(el => el.scrollWidth)).toBeGreaterThan(await preview.evaluate(el => el.clientWidth));
  await preview.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => preview.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Expand dashboard", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close screenshot" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Expand dashboard", exact: true })).toBeFocused();
});
