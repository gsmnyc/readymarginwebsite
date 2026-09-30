# Page titles and metadata review

Reviewed 1 October 2026 using ECC SEO and market-research guidance. This follows the all-page copy review in [COPY_AND_SEARCH_REVIEW.md](COPY_AND_SEARCH_REVIEW.md).

## Research and title decisions

First-party competitor pages were reviewed for category language, not as proof of their performance claims.

| Source | Observed search title / positioning | Decision |
| --- | --- | --- |
| [Restaurant365](https://www.restaurant365.com/) | “Restaurant Management Software”; accounting, inventory and payroll product categories | Use restaurant accounting and payroll terms for the homepage. Describe the managed service offered in its description. |
| [MarginEdge](https://www.marginedge.com/) | “Restaurant Management Software”; invoice and food-cost workflows | Keep food-cost and supplier pages specific to their review tasks. |
| [Ceterus](https://ceterus.com/) | Homepage title “Home - Ceterus”; franchise bookkeeping and financial statements | Name the service in Ready Margin’s homepage title and distinguish bookkeeping from advisory work on their respective pages. |

Google recommends descriptive, concise titles with restrained branding and page-specific descriptions. Titles should reflect the visible content; Google can generate a different title or snippet from other page signals. References: [title links](https://developers.google.com/search/docs/appearance/title-link), [meta descriptions](https://developers.google.com/search/docs/appearance/snippet).

No ranking promises, copied slogans, competitor statistics or unsupported software capabilities were added. There is no special metadata shortcut for answer engines; the existing visible answers, crawlable content and matching structured data remain the basis of that work.

## Implemented changes

- Homepage title: **Restaurant Accounting & Payroll Services | Ready Margin**. Its description includes bookkeeping, payroll preparation, CFO support and the free demo.
- Homepage WebPage markup uses the same service name. The root layout has a service-specific default title, configured metadata base and application name.
- Thirteen page titles were refined: company/contact/workspace titles and legal utilities avoid repeated brand wording; payroll names preparation and tip review; CFO names financial review; the payroll/bookkeeping answer identifies the restaurant context.
- All 121 content routes retain their distinct page descriptions and intent-specific titles. Titles are not automatically truncated to an arbitrary character limit.
- Canonical links and Open Graph URLs now use the same preferred URL, including the three resource aliases.
- Social metadata declares the existing image assets’ actual dimensions and descriptive alternative text. Open Graph declares the US English locale. Article social previews use the publication and revision dates already stored in content, consistently with Article markup.
- Production indexing and private preview exclusions remain controlled by the existing environment configuration. No new keyword lists, fabricated reviews, office locations or credentials were added.

## Checks and release

Lint passed with zero warnings. The server build generated 128 pages; the public static export generated 127 pages. Standalone TypeScript passed after both builds. The 121 content routes have 121 distinct search titles and 121 distinct descriptions. Exported HTML review confirmed the homepage title/description, canonical and social URL agreement on the guide alias, existing article dates, image dimensions and route-specific titles. No automated test suite or ranking measurement is part of this metadata revision.

The user authorized pushing the focused metadata commit to PR #13 and merging it into main after successful build checks. Use a normal merge commit to preserve the existing focused history. Publish the same source tree to the existing public review website.
