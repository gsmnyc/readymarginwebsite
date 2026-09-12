# Editorial refinement — September 12, 2026

## Direction

The work behind service: an owner-facing statement, an operating note, and connected chapters that follow a record through to a decision. Plus Jakarta Sans, Ink, Paper and Ready Gold remain the identity. The supplied website/motion handoff and design tokens informed the work. No new logo, photography, invented financial data or production animation dependency was introduced.

Public reference sampling included [Locomotive](https://locomotive.ca/en), [Studio Freight](https://studiofreight.com/), [AREA 17](https://area17.com/), [Build in Amsterdam](https://www.buildinamsterdam.com/), [Porto Rocha](https://www.portorocha.com/), [Base Design](https://www.basedesign.com/), [Ragged Edge](https://raggededge.com/), [Collins](https://wearecollins.com/), [Instrument](https://www.instrument.com/) and [Hello Monday](https://www.hellomonday.com/). The useful principles were typographic hierarchy, distinct section treatments and evidence-led explanation; their assets and wording were not reused.

## Implementation

- Shared editorial rules live in `app/editorial.css`; existing foundational and form rules remain in their own files.
- Restaurant Day uses a legible operating note and explicit phase controls. Decorative routing animation, pause controls and visibility listeners were removed.
- Run / Explain / Improve is a sequence of server-rendered chapters with an illustrative payroll handoff.
- Ready Rhythm is an ordered, server-rendered sequence. Its full text no longer depends on selection or JavaScript.
- The enquiry comes before supporting explanations. A synchronous submission guard prevents duplicate in-flight delivery. The form caption now meets contrast requirements in the tested composition.
- Related links connect the three previously added direct-answer pages to relevant services. Turnaround has a dedicated homepage pathway.
- IndexNow prioritizes the actual Vercel environment and skips malformed origins safely. Existing canonical paths, crawler policy and schema architecture are preserved.
- Obsolete intro/model/timeline CSS and outdated introduction references were removed.

## Validation evidence

The optimized local Next.js build was exercised in Chromium. An initial matrix covered 128 route/viewport combinations with no horizontal overflow or page exceptions. Widths: 320, 360, 375, 390, 412, 430, 768, 820, 1024, 1280, 1366, 1440, 1536, 1728, 1920, 2560 and 3840; plus a 980px touch viewport with coarse pointer and no hover. The required route families were covered at 390 and 1440. Other widths used home, booking, finance services and how-it-works.

Screenshots were reviewed for the hero, operating note, service chapters, rhythm, menu, booking states and footer. This is representative visual QA, not a claim of manual inspection of every section at every width. The initial matrix exposed a later-confirmed capability-query mismatch in the new hero; the committed browser test protects the corrected single-column touch layout.

Browser interaction checks cover invalid-form focus, preserved input after server failure, retry, success focus, menu open/Escape/focus restoration and restaurant-day controls. Form responses are intercepted in tests: no real leads or emails are created.

Automated axe checks against WCAG A/AA tags reported zero violations on home, booking, finance services and how-it-works after correcting the booking caption. This is not a complete WCAG certification.

Build, TypeScript, lint, content validation, SEO contracts, IndexNow, static responsive contracts and form/receiver tests pass. The build generates 121 static pages; the SEO contract protects 111 canonical sitemap URLs.

## Reproduce browser regressions

```sh
npm ci
npx playwright install chromium
npm run build
npm run test:browser
```

`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` can select an existing Chromium executable. `BROWSER_BASE_URL` can target an accessible preview; without it, Playwright starts the local production build. Tests run with optional analytics rejected and mock the lead endpoint.

The committed tests cover phone, 980px touch desktop-site, desktop and 4K. Additional checks cover normal motion/back navigation and CSS viewport equivalents of 100%, 125%, 150% and 200% desktop zoom. These viewport reductions do not claim physical-device testing or browser-chrome zoom operation.

## Measurement and release limits

Lighthouse on `http://127.0.0.1:3000/` using the desktop preset measured Performance 100, Accessibility 100, Best Practices 100, LCP 617ms, TBT 0ms and CLS 0. SEO measured 69 in the non-production build, which deliberately uses noindex. Final mobile Lighthouse did not produce a valid performance score because Chromium did not supply load screenshots. These are local laboratory observations, not production Core Web Vitals or field INP.

The connected Vercel preview-sharing action failed to create access to the protected deployment. Visual preview approval, production runtime logs, live provider delivery and actual production IndexNow enablement must not be claimed from local tests. Keep the PR unmerged until its exact Vercel preview is accessible and visually verified.
