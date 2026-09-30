# Changelog

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
