# Search and navigation — September 2026

## Public indexing

`scripts/build-sites.mjs <public origin>` builds a public export with production indexing enabled. Add `--preview` only for an export that should not appear in search. The build sets both `SITE_ENV` and `VERCEL_ENV` consistently, so an inherited preview setting cannot silently block a public release.

The public origin is used for canonical URLs, social metadata, structured data and the sitemap. Form completion, search and other intentionally excluded pages retain their existing noindex rules. Legacy redirect pages remain noindex.

## Service discovery

`content/service-navigation.ts` defines 18 service routes in three groups. The homepage renders all of them as descriptive links. The drawer exposes the same directory in expandable groups. Above 980px, the drawer supplements the visible main navigation; at 980px and below it includes all five primary destinations.

The finance services hub is the broad service overview. Accounting, bookkeeping, payroll, tax record support, compliance workflows, CFO guidance, consulting, back-office work, payables, cash flow, food cost, labor cost, tips, inventory, turnaround, profitability, multi-location finance and the outsourced team each retain a dedicated scope page.

Service headings and search titles identify the actual service. The outsourced team page explains contacts, handoffs and changes in capacity. New York introductions explain location records, reporting definitions or professional handoffs appropriate to each service; they do not claim an office, specific regulatory advice or customer results.

## Product evidence

The hero shows nine real demo views: overview, schedule, attendance, tips, payroll, weekly close, reconciliation, bills and cash. Each has a concise explanation and a related service link. Tax, inventory and advisory services remain service scopes rather than invented product modules. The hero labels the demo as sample data; the enlarged viewer explains that providers and payroll engines are disconnected.

On phones, the nine options use three equal columns and a minimum 48px control height. Long labels can wrap inside their own cell, keeping all rows aligned at narrow widths.

## Structured data

The homepage service ItemList matches visible links. Service schema describes the named scope without lists of keyword variations. Breadcrumb schema only links to real page routes. No customer ratings, live integration claims or unconfirmed prices are included.

## Search guidance

Google recommends [descriptive titles](https://developers.google.com/search/docs/appearance/title-link), [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) and [consistent canonical signals](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls). A [noindex directive](https://developers.google.com/search/docs/crawling-indexing/block-indexing) prevents the affected page from appearing in search; public exports must not inherit preview directives.
