# Homepage creative rescue

## Direction

The work behind the restaurant: an original place-setting drawing connects service to a working ticket. A single supplier-price question carries Run / Explain / Improve through an invoice, review note and follow-up. Cash obligations create a quieter, more serious advisory moment. These are explicitly illustrative, not customer records or product screens.

Identity authority: supplied Ready Margin identity manual, design tokens and motion handoff. Plus Jakarta Sans, existing exact logos and Ink / Paper / Gold retained. Supplied photography was excluded because its provenance labels it AI-generated.

Focused references inspected: Nory (https://www.nory.ai/), Instrument, AREA 17, COLLINS, PORTO ROCHA, Base Design, Build in Amsterdam and Locomotive. Principles: a clear focal idea, tangible subject matter, deliberate changes in scale and restrained service navigation. No borrowed imagery, copy, customer proof or competitor product interfaces.

## Implementation

- `app/page.tsx`: server-rendered composition, metadata and Organization schema.
- `app/homepage.css`: isolated responsive art direction; obsolete homepage desk/rhythm rules removed.
- `components/home/restaurant-illustration.tsx`: original inline vector drawings; no raster downloads.
- `components/home/operating-story.tsx`: complete crawlable supplier-work narrative.
- `components/home/home-motion.tsx`: once-per-entry 400ms progressive enhancement. No perpetual animation or scroll listener. Reduced motion, Save Data and low-memory devices skip choreography; observers and animations clean up.
- Existing shared OperatingDesk and Timeline remain available to other routes.

## Local verification

Production build and TypeScript, lint, content and SEO contracts passed. 111 canonical sitemap URLs preserved. Thirteen focused browser checks passed; three duplicate/inapplicable motion checks skipped. Includes no-JavaScript rendering, navigation focus, scrolling and back navigation.

Widths checked: 320, 360, 375, 390, 412, 430, 768, 820, 980 (touch, coarse pointer, no hover, mobile Desktop Site), 1024, 1440, 1728, 1920, 2560, 3840. No horizontal overflow or page errors. Desktop, mobile, touch Desktop Site and full-page screenshots reviewed; gold-note contrast corrected and rechecked. Axe WCAG A/AA scans at 390 and 1440 returned no violations.

Single-run Lighthouse against the local production build at http://127.0.0.1:3000 (lab results, not production field data):

| Context | Performance | Accessibility | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- |
| Mobile | 96 | 100 | 2.316s | 163ms | 0 |
| Desktop | 100 | 100 | 0.623s | 0ms | 0 |

Local Lighthouse SEO was 69; local builds deliberately emit noindex and production canonicals. This is not a production SEO score. Production indexability must be verified on the release. No field INP claim is made.

Preview and production verification remain release gates; do not infer deployment from these local results.
