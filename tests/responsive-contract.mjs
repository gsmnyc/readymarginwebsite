import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [responsive, globalCss, home, dependencies] = await Promise.all([
  readFile("app/form-responsive.css", "utf8"),
  readFile("app/globals.css", "utf8"),
  readFile("app/page.tsx", "utf8"),
  readFile("package.json", "utf8").then(JSON.parse),
]);

assert.match(
  responsive,
  /min-width:\s*768px[^}]+max-width:\s*1199px[^}]+hover:\s*none[^}]+pointer:\s*coarse/s,
  "Touch desktop-mode layouts need a capability-aware media query.",
);
for (const selector of [
  ".hero-grid",
  ".page-hero-grid",
  ".form-layout",
  ".desk-chapter",
  ".footer-grid",
]) {
  assert(responsive.includes(selector), `Missing touch-layout protection for ${selector}`);
}
assert.match(responsive, /\.page-form \.form-grid[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/s);
assert.match(responsive, /\.page-form \.lead-form \.button[^}]*min-height:\s*56px/s);
assert.match(globalCss, /\.footer-grid a\s*\{[^}]*min-height:\s*44px/s);
assert(!home.includes("IntroReveal"), "The homepage must expose the service proposition without an intro gate.");
assert(!dependencies.dependencies?.gsap && !dependencies.dependencies?.["@gsap/react"], "Global GSAP runtime must remain removed.");

console.log("PASS: touch desktop-mode, one-column form, tap-target and lightweight-motion contracts.");
