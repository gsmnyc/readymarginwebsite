# Website copy and search review

Updated 1 October 2026. This review covers the 121 public content routes, homepage, brand-guidelines metadata and shared interface copy. The existing rounded layouts, product screenshots and motion system are preserved.

## Writing standard

Ready Margin is a managed restaurant finance service. Explain the work a person performs, the records required and the output the restaurant receives. Use the name of the task instead of a slogan. A service page helps someone choose support; a problem page explains where an investigation starts; a guide explains a method; an answer page answers one question directly.

Do not invent customer results, credentials, employee biographies, office addresses, provider integrations or savings. Payroll preparation is distinct from authorization, processing and tax work. A bill review is distinct from payment execution. Public product views use sample records and disconnected providers. Keep those distinctions specific to the page rather than adding a general warning to every paragraph.

### Company voice profile

- **Author:** Ready Margin.
- **Goal:** Help restaurant owners decide what finance support they need and understand how the work will be delivered.
- **Confidence:** High for the service scope, free first demo and quotation process described in the repository; unverified business facts remain unpublished.
- **Source set:** Existing company service definitions, user instructions, demo screenshots and documented approval boundaries.
- **Rhythm:** Short descriptive headings; complete sentences for the explanation.
- **Compression:** One task per paragraph. Keep the record, person or output that makes the statement useful.
- **Capitalization:** Sentence case in prose. Proper names retain their spelling.
- **Parentheticals:** Use only for a necessary clarification.
- **Question use:** A real owner question on answer or FAQ pages; avoid rhetorical hooks.
- **Claim style:** State included work and conditions. Use examples as examples. Do not turn a process into a promised result.
- **Preferred moves:** Name the input, explain the check, identify the deliverable or approval.
- **Banned moves:** “Unlock,” “seamless,” “revolutionize,” unexplained “clarity,” vague transformation, fake rankings, repetitive two-part slogans and unsupported automation claims.
- **CTA rules:** Describe the actual action: book a free demo, compare services or read a relevant guide.
- **Channel notes:** Website headings should stand alone. Article summaries explain the method. Email and social copy should use the same factual standard, without invented testimonials or numbers.

## Competitor research and editorial decisions

Reviewed first-party pages on 1 October 2026. These are vendor descriptions, not independently verified product or performance comparisons. Their claims are not transferred to Ready Margin.

| Source | Observed emphasis | Decision for this website |
| --- | --- | --- |
| [Nory](https://www.nory.ai/) | Restaurant operating software, workforce and cost-management workflows | Explain the concrete workflow; describe Ready Margin’s managed preparation and review responsibility. |
| [Restaurant365](https://www.restaurant365.com/) | Accounting, operations, workforce and payroll product categories | Make service categories distinct and state the output of each engagement. |
| [MarginEdge](https://www.marginedge.com/) | Invoice and food-cost workflows | Explain prices, units, receiving records and usage checks rather than promising generic margin improvement. |
| [Ceterus](https://ceterus.com/) | Outsourced bookkeeping and financial reporting | Show what is handled, what records are needed and what is reviewed with the owner. |

No comparative superiority claims, borrowed slogans, vendor metrics or unverified competitor prices have been added.

## Search implementation

- Each page has a specific heading and description. Existing service names remain descriptive; guide titles identify the actual subject or calculation.
- Answer pages display their direct answer. Article summaries display the same substance represented in Article markup.
- Nineteen service pages have task-specific FAQs. Pricing and onboarding use their own questions. Structured FAQ text comes from the same data as the visible accordions.
- WebPage entities consistently identify their publisher and containing website. Service and Article entities connect to the relevant page; article authors use the company identity displayed on the page.
- No schema keyword lists, fabricated reviews, local office addresses or question-forum markup are used.
- Three resource aliases point canonically to their matching guide, checklist and example directories and are omitted from the sitemap. Their existing visitor URLs remain usable.
- Search, enquiry confirmation, careers without open roles and the brand-asset utility remain outside the index. Production public pages are crawlable; explicit private search previews remain noindex.
- Existing wildcard robots rules permit crawlers. Canonicals and sitemap URLs use the configured deployment origin. The public review export uses its actual public origin.
- The checklist directory uses an explicit curated set of checklist articles instead of treating every payroll guide as a checklist.

### Search and answer-engine guidance

Google’s [generative search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) treats useful content and ordinary crawl/index fundamentals as the foundation. It does not prescribe special prose, an ideal page length or special AI files. This implementation uses readable server-rendered content and meaningful page distinctions.

Bing’s [AI Performance documentation](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/) supports measuring cited URLs and improving clarity and evidence. It does not establish a guaranteed citation result. Search Console and Bing Webmaster Tools ownership, submissions and performance monitoring are separate operational steps; no account changes or indexing submissions were made in this review.

FAQ markup describes visible questions. It is not a promise of a Google FAQ rich result: Google [limits those results](https://developers.google.com/search/blog/2023/08/howto-faq-changes) to certain authoritative government and health sites.

## Sources and business confirmation

The outdated New York hospitality link was replaced with the [Department of Labor FAQ](https://dol.ny.gov/hospitality-wage-order-faq). Relevant tax pages link to [IRS employer guidance](https://www.irs.gov/businesses/small-businesses-self-employed/outsourcing-payroll-duties). New York tax coordination links to the [restaurant sales-tax bulletin](https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/sales_by_restaurants.htm). No wage rates or filing deadlines have been copied into marketing prose.

The privacy and terms pages explain the current website behavior and separate service agreement. Business-approved retention periods, service-provider disclosures and full contractual terms still require the business’s legal review; they have not been invented to make the pages appear complete.

## Follow-up page-template review

All 121 content routes were reviewed by intent and heading structure. A second pass shortened remaining promotional headings and corrected the shared page template rather than adding route-specific patches. The unused `content/home.ts` copy source was removed so it cannot compete with the rendered homepage.

| Element | Before | After |
| --- | --- | --- |
| Page hero | Repeated category/status badge with a generic fallback | Breadcrumb and page-specific heading; no badge (`app/[...slug]/page.tsx`) |
| Card alignment | The body wrapper added a second horizontal inset | Hero and body share an outer width; `--page-content-padding` sets the text gutter (`app/site-refinement.css`, `components/product/product.module.css`) |
| Section hierarchy | A numbered circle beside every section, including legal text | A direct heading and explanation; real checklist steps retain their meaningful order (`components/site/static.tsx`) |
| Footer | Decorative stickers and a tall reserved area | Wordmark in normal document flow with responsive spacing (`components/site/static.tsx`, `app/site-refinement.css`) |
| Screenshot relevance | The bill screenshot accompanied food-cost and inventory services | Those pages use their own service explanations; no unrelated screenshot (`content/product.ts`) |

## Release sequence requested by the user

1. Build and publish this work to the existing public review site.
2. Incorporate the user’s public-review annotations. The user has now authorized GitHub commits.
3. Make focused GitHub commits and push them to the existing PR #13 branch.
4. The later title/metadata request authorizes merging into main after the focused metadata commit and successful build checks; see [Title and metadata review](TITLE_AND_METADATA_REVIEW.md).

Publishing creates a snapshot in the Sites source repository. It does not merge GitHub main. Keep the copy/search, shared interface and release documentation changes in focused commits on the existing review branch.
