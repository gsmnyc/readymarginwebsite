# Changelog

## 2026-10-01 — Directory cards and dashboard service coverage

- Aligned audience cards and supporting sections; removed empty sidebar tracks where no related links exist.
- Applied rounded cards to Insights, aligned reading links and grouped the search/topic controls in a themed surface.
- Added nineteen distinct service icons with consistent sizing and both-theme rendering.
- Reviewed the live dashboard’s owner, employee and administrative areas; added eight workflow groups and expanded nine relevant service pages.
- Refined the service-directory heading, title and description around the actual work; retained the demo’s calculation and provider boundaries.
- Recorded scope and evidence in [Dashboard service review](docs/DASHBOARD_SERVICE_REVIEW.md).

## 2026-10-01 — Titles and search previews

- Refined the homepage title to “Restaurant Accounting & Payroll Services | Ready Margin” and described the managed service in its search summary.
- Refined thirteen page titles to identify their actual subject and remove repeated brand wording.
- Aligned canonical links with social-preview URLs, including resource aliases.
- Added verified social-image dimensions, image alternative text, locale and existing article dates.
- Added the configured metadata base, application identity and descriptive default title.
- Recorded competitor research, official Google guidance and the implementation scope in [Title and metadata review](docs/TITLE_AND_METADATA_REVIEW.md).

The user authorized pushing this focused metadata commit and merging PR #13 after successful build checks, preserving its commit history with a normal merge.

## 2026-10-01 — Copy, search and page consistency

### Changed

- Rewrote 121 public content pages and shared homepage, product, pricing and footer copy around specific restaurant finance tasks.
- Added service-specific FAQs, visible direct answers and article summaries with fictional calculation examples.
- Updated page descriptions, titles, publisher identity and page/article/service relationships in structured data.
- Consolidated resource aliases with canonical URLs and excluded them from the sitemap.
- Curated checklist browsing and refreshed official New York labor references.
- Preserved the expanded product tabs, grouped responsive navigation, themed card surfaces and responsive footer layout requested in the annotations.

- Removed the footer stickers and their reserved space after public-site review.
- Removed repeated hero badges, generic screenshot labels and arbitrary section numbers across the shared content-page template.
- Aligned hero, product and body cards with the same outer width and text gutter on desktop, tablet and phones.
- Shortened remaining promotional headings and removed an unused duplicate homepage copy source.
- Limited service screenshots to tasks actually represented by the captured demo.

The user authorized focused commits and an update to the existing PR #13 after public review. The later metadata request also authorizes merging after successful build checks.

### Commit sequence

- `0d7895a` — rewrite restaurant service and editorial copy, shared product descriptions and enquiry text.
- `21f4b81` — connect search metadata with visible answers, summaries, FAQs and canonical resource directories.
- `efde649` — remove footer stickers and repeated labels; align page cards and content gutters across breakpoints.

## 2026-10-01 — Restoration and quality review

### Restored baseline

The review branch starts from the website source previously published as `ee9f646`, consolidated in feature commit `9f7b1c4`. The discarded performance commit `886dec4` is excluded. The original PNG screenshots, Radix tabs and dialogs, Motion animations, header behavior and rounded layouts remain in place.

### Interface fixes — `d4f20ff`

- Correct screenshot-dialog title sizing without replacing the dialog component.
- Restore section entrances for the current service-card markup.
- Focus the email-draft result after preparation and clean up its scheduled focus callback.
- Use the configured contact address in the footer.
- Remove an unused pricing prop and exclude unpublished local pages from public routes.

### Content and code cleanup — `5748897`

- Rewrite all 10 answer pages with explanations specific to their questions.
- Differentiate the six service overview pages from detailed service pages.
- Shorten long search titles and replace thin or repetitive descriptions.
- Display all 19 detailed services in both service directories.
- Preserve individual page update dates and reject invalid canonical-origin protocols.
- Reuse the selected social image across Open Graph and Twitter metadata.
- Remove the AI discovery route, duplicated crawler rules, obsolete creative drafts and bulk rewrite scripts.
- Replace the pass-through image loader with explicit original-image delivery; image files are unchanged.
- Replace static output on export so removed routes and obsolete chunks cannot remain.
- Update the existing SEO contract to reflect the removed discovery route and general crawler rule.

### Documentation and CI

- Update setup, content, deployment, capture and motion documentation.
- Add this changelog and a record of release scope and checks.
- Add CI for lint, TypeScript and both production build formats.

### Script cleanup — `19f3de8`

- Remove an unused asset-preparation helper and its unused state without changing the active asset workflow.

## 2026-09-30 — Website revision

- Restore rounded cards and consistent light/dark surfaces.
- Introduce floating navigation and organized desktop/mobile service menus.
- Use real product captures in a full-width hero and service workflows.
- Rewrite the landing-page hook around restaurant payroll and finance work.
- Expand service and local search pages.
- Rebuild the yellow footer with four desktop columns, compact mobile legal links and stickers that scale with the logo.

The earlier development history remains on `codex/website-revamp`. The review branch consolidates that completed revision and records the new fixes separately. Unfinished local brand-guide edits are excluded from this website PR.
