# Ready Margin website

For the current all-page writing standard, source research and search changes, see [Copy and search review](docs/COPY_AND_SEARCH_REVIEW.md). The 1 October 2026 copy update and follow-up interface corrections are included in PR #13 after public review. Main remains unmerged pending approval.

Next.js, React and TypeScript. The complete website uses local Plus Jakarta Sans, supplied identity assets, editable content and enquiry-only service pricing.

## Brand colors

The website uses only Ready gold (`#E7C14B`), ink (`#222222`), paper (`#F4F1E8`) and stone (`#D5D5CC`). All additional tones in `app/brand-colors.css` are mixes of those four colors. Shared page styles, statuses and both themes use these tokens; no separate green, blue, clay or red accent families are used. The invoice walkthrough has its own component stylesheet.

## Development

Use Node 22.13 or later; CI uses Node 24.

```sh
npm ci
npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm run build` | Production Next.js server build |
| `npm start` | Serve the server build |
| `npm run typecheck` | TypeScript checks |
| `npm run build:sites -- https://your-site.chatgpt.site` | Production static export |
| `npm run build:sites -- https://your-site.chatgpt.site --preview` | Static export with indexing disabled |

Existing lint and content, SEO, form and browser checks are listed in `package.json`. CI checks lint, types and both deployment formats. Keep private environment values in `.env.local` or the deployment settings.

## Public Sites build

Run `npm run build:sites -- https://your-site.chatgpt.site` to export the full website into `out/`. This uses the same Next.js source, bundled brand font, shared palette and persistent light/dark preference. The normal Next.js server build remains available.

Sites enquiries prepare a visitor-controlled email draft addressed to `contact@readymargin.com`. The visitor sends it from their email application; preparing a draft never claims delivery. For automatic delivery on a Next.js server, configure the receiver described below.

Sites builds default to indexable production output. Pass `--preview` to disable indexing. `.openai/hosting.json` identifies the existing hosting project and output directory. The exporter replaces generated output so removed pages and old chunks do not survive into the next release. Static hosting cannot apply Next.js response headers or server redirects; the exporter provides HTML aliases for the supported legacy paths.

## Existing Vercel deployment

Use the existing readymarginwebsite project connected to gsmnyc/readymarginwebsite. The repository root is the application root. vercel.json configures installation, build and output. Keep private environment values in Vercel Settings, never in Git.

Set SITE_URL to https://readymargin.com. Production deployments are indexable; preview deployments remain noindex. Enable Web Analytics and Speed Insights in the project dashboard. Both integrations wait for visitor consent. URLs sent for measurement exclude query strings and fragments.

The existing root IndexNow key is retained. After confirming it is reachable at readymargin.com, set INDEXNOW_ENABLED=true in Vercel Production to notify IndexNow after a successful production build. It notifies participating engines of canonical published URLs; it does not guarantee crawling or ranking.

## Forms and content

This form requests a follow-up; it does not book a calendar slot or subscribe visitors to marketing. On the server build, a confirmed receiver receipt is required before a delivered-success message appears. An unconfigured receiver falls back to an explicitly labeled email draft. Use the token-protected, retry-safe Google Workspace receiver described in docs/FORM_DELIVERY.md. Do not configure the legacy adapter once the current receiver is live.

Core pages and settings are in `content/site.json`. Detailed services, solutions, answers and local pages are in `service-pages.json`, `solution-pages.json`, `answer-pages.json`, `search-pages.json` and `nyc-intent-pages.json`. `content/service-navigation.ts` supplies the shared service links; `content/product.ts` describes the dashboard captures. Edit these sources directly and commit the changes. Obsolete bulk-copy rewrite scripts have been removed to prevent them overwriting reviewed content.

Sanity is optional. Leave its variables unset to use local content. [Content editing](docs/CONTENT_EDITING.md) explains the CMS connection. Unpublished pages are excluded from the public content registry. Set each page's `updated` date only when that page changes; the registry preserves individual dates.

## Motion and search

The homepage has nine dashboard views: overview, schedule, attendance, tickets and tips, payroll, weekly close, books, bills and cash. Radix provides product tabs and screenshot dialogs; Motion enhances offscreen cards. The original product PNGs are retained. No video or WebGL download is required. Reduced-motion and keyboard behavior are described in [motion notes](docs/motion-system.md).

The captures show the owner's demo workspace with sample records. They are static screenshots, not live bank or payroll feeds. See [capture provenance](public/product/README.md). Do not describe a screenshot as a feature the demo does not show.

Content pages have distinct metadata, self-consistent canonical URLs and relevant structured data. The sitemap includes published, indexable pages; one general robots rule covers crawlers. See [SEO review](docs/SEO_REVIEW.md) for the page families, copy corrections and source guidance.

## Release checks

Review mobile and keyboard interactions, consent choices, enquiry delivery and domain redirects before merging. A build is not a measured performance score. The current release notes record the checks actually performed.

## Release history

The current review branch is `codex/website-quality-restoration`, tracked by PR #13. It starts from the restored website before the discarded speed rewrite. The tabs, dialogs, animation library and original screenshots are preserved. The shared content template uses aligned card widths without generic hero badges or decorative section numbers; the footer keeps its gold wordmark without stickers. See [CHANGELOG.md](CHANGELOG.md) and [release notes](docs/RELEASE_NOTES.md) for the commit sequence, changes and remaining measurement limits. Review the PR and obtain merge approval before changing `main`.
