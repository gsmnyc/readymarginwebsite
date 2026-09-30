# SEO and copy review

Reviewed 2026-10-01. Source collections cover core pages, detailed services, problem pages, answers, editorial guides and New York service intents.

## Changes

| Surface | Finding | Correction |
| --- | --- | --- |
| Answer pages | Questions reused service paragraphs | All 10 answers now explain the question, relevant records and service responsibilities |
| Six service overviews | Bodies duplicated detailed service pages | Overviews explain connected workflows; detail pages retain their specific service scope |
| Search titles | Long keyword lists and repeated promises | Concise titles name the page's primary topic |
| Problem descriptions | Several short or repetitive snippets | Descriptions explain the problem and the records to review |
| Service discovery | Directory showed six older categories | Both directories link all 19 detailed services |
| Update dates | A collection date replaced every page date | Individual page dates take precedence |
| Robots and discovery | Repeated crawler-specific rules and unused discovery output | One general crawler rule; sitemap remains the search discovery surface |

## Page intent

- `/what-we-handle`: choose among the available service scopes.
- `/what-we-handle/*`: understand connected operating workflows.
- `/restaurant-*-services` and related service URLs: understand a specific engagement.
- `/solutions/*`: start from an existing restaurant finance problem.
- `/answers/*`: answer one scope or operating-process question.
- `/insights/*`: explain a review method or comparison.
- `/new-york/*`: explain the service's location-specific handoffs and official resource context.

Each retained page has its own purpose; no new keyword-variant pages were created. Existing URLs and primary service links remain available. The homepage keeps the restored restaurant hook and dashboard showcase.

## Technical behavior

Production pages use their canonical origin consistently in metadata, sitemap and structured data. Apex business-domain configuration normalizes to the existing `www` origin. Invalid non-HTTP origins fall back to the business domain. Preview builds are `noindex`; production Sites exports are indexable by default.

The registry excludes unpublished pages. Sitemap entries also require `indexable`. Service, article and breadcrumb data reflect the visible content. Authored answer pages use WebPage/Question data rather than pretending to be a community Q&A page. No customer reviews, ratings, prices, certifications or performance results are invented.

## Editing guidance

Name the task, record, responsible person and next action. Keep questions in answer pages and FAQs. Explain scope once where it helps someone choose a service. Keep tax, payment and payroll approvals accurate. Avoid stacked keywords, vague claims and promises of outcomes.

The public product captures contain sample records. Preserve that context and the actual screen titles; do not relabel a payroll sheet as a tax-filing or inventory screen.

This review follows Google's guidance on [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [descriptive titles](https://developers.google.com/search/docs/appearance/title-link) and [consistent canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls). Search rankings and traffic improvements have not been measured or promised.
