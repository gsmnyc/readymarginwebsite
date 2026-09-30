# Ready Margin website

Next.js, React and TypeScript. The complete website uses local Plus Jakarta Sans, supplied identity assets, editable content and enquiry-only service pricing.

## Brand colors

The website uses only Ready gold (`#E7C14B`), ink (`#222222`), paper (`#F4F1E8`) and stone (`#D5D5CC`). All additional tones in `app/brand-colors.css` are mixes of those four colors. Shared page styles, statuses and both themes use these tokens; no separate green, blue, clay or red accent families are used. The invoice walkthrough has its own component stylesheet.

## Development

Use Node 22.13 or later. Run npm ci, then npm run dev. Run npm run build for production. Validation commands: npm run typecheck, npm run lint, npm run test:content, npm run test:seo and npm run test:forms.

## Public Sites build

Run `npm run build:sites -- https://your-site.chatgpt.site` to export the full website into `out/`. This uses the same Next.js source, bundled brand font, shared palette and persistent light/dark preference. The normal Next.js server build remains available.

Sites enquiries prepare a visitor-controlled email draft addressed to `contact@readymargin.com`. The visitor must send it from their email application; preparing a draft never claims delivery. For automatic delivery on a Next.js server, configure the receiver described below. Generated restaurant photography has been removed; the homepage workflow is explicitly illustrative.

The public review remains `noindex`. `.openai/hosting.json` identifies the Sites project and its static output. Source archives exclude dependencies, private environment files and generated build folders.

## Existing Vercel deployment

Use the existing readymarginwebsite project connected to gsmnyc/readymarginwebsite. The repository root is the application root. vercel.json configures installation, build and output. Keep private environment values in Vercel Settings, never in Git.

Set SITE_URL to https://readymargin.com. Production deployments are indexable; preview deployments remain noindex. Enable Web Analytics and Speed Insights in the project dashboard. Both integrations wait for visitor consent. URLs sent for measurement exclude query strings and fragments.

The existing root IndexNow key is retained. After confirming it is reachable at readymargin.com, set INDEXNOW_ENABLED=true in Vercel Production to notify IndexNow after a successful production build. It notifies participating engines of canonical published URLs; it does not guarantee crawling or ranking.

## Forms and content

This form requests a follow-up; it does not book a calendar slot or subscribe visitors to marketing. On the server build, a confirmed receiver receipt is required before a delivered-success message appears. An unconfigured receiver falls back to an explicitly labeled email draft. Use the token-protected, retry-safe Google Workspace receiver described in docs/FORM_DELIVERY.md. Do not configure the legacy adapter once the current receiver is live.

Edit content/site.json and commit to publish content through Vercel. Sanity is optional; leave its variables unset for launch. docs/CONTENT_EDITING.md explains the later CMS connection.

## Motion and search

The homepage includes keyboard-accessible Books, Payroll and Food cost workflow tabs. Layouts use shared brand tokens, responsive cards and reduced-motion fallbacks. No video or WebGL download is required. Each content page has distinct metadata, a canonical URL and relevant structured data. The sitemap and llms.txt derive from published content. Neither metadata nor llms.txt guarantees search placement.

## Release checks

Verify mobile and keyboard interactions, consent choices, real enquiry delivery, domain redirects and PageSpeed on the deployed version. A successful build is not a measured performance score. Business/legal notices still require the owner's approval of entity details, retention and provider arrangements. Asset licenses and provenance are retained with the supplied files.
