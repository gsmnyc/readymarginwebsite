# Site-wide copy, SEO and enquiry update — 11 November 2026

## Positioning
Ready Margin remains a complete managed restaurant financial operations company. The homepage and global navigation continue to support bookkeeping, accounting, payroll, cost control, cash visibility, and advisory services. This change adds a bookkeeping campaign-specific path; it does not demote the other services.

## Changes
- Broadened homepage messaging to describe the full suite, including the current NYC one-to-five-location audience. Changed the general primary CTA to a free service consultation, while retaining the dashboard demo as an optional illustration.
- Expanded the global and New York bookkeeping pages with source records, reconciliations, supplier bills, multi-site handoffs, cleanup boundaries, and truthful FAQ answers.
- Fixed two links to nonexistent bookkeeping and payroll articles.
- Added a dedicated noindex /bookkeeping-consultation route tied to the existing enquiry delivery, so paid search traffic can request a bookkeeping proposal without changing other funnels.
- Added an automated content audit for duplicate routes, broken related links and invalid canonical references.

- Aligned the general enquiry page, shared CTA, footer and form confirmation with a consultation request rather than implying an actual calendar booking or a finished dashboard. All service categories and service URLs remain intact.
- Kept `/book-a-review` as the established route for backwards compatibility. The form requests a follow-up; it does not reserve a time.

## Checks still required before production
- If Sanity is enabled with remote page overrides, reconcile content there; local JSON may be superseded.
- Test the new form submission end to end against the configured CRM or Google Apps Script receiver. The API's HTTP receipt must be confirmed.
- Check visual layout on desktop and mobile, ad conversion events and noindex behaviour on the preview deployment.
- Do not imply a New York office, named credentials, guaranteed outcomes, existing integrations or real case results without company evidence.
