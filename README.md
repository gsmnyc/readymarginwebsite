# Ready Margin website

Next.js, React and TypeScript. The complete website uses local Plus Jakarta Sans, supplied identity assets, editable content and enquiry-only service pricing.

## Development

Use Node 22.13 or later. Run npm ci, then npm run dev. Run npm run build for production. Validation commands: npm run typecheck, npm run lint, npm run test:content and npm run test:forms.

## Vercel

Use the existing readymarginwebsite project connected to gsmnyc/readymarginwebsite. The repository root is the application root. vercel.json configures installation, build and output. Keep private environment values in Vercel Settings, never in Git.

Set SITE_URL to https://readymargin.com. Production deployments are indexable; preview deployments remain noindex. Enable Web Analytics and Speed Insights in the project dashboard. Both integrations wait for visitor consent. URLs sent for measurement exclude query strings and fragments.

## Forms and content

The existing GOOGLE_APPS_SCRIPT_URL setting remains supported. This form requests a follow-up; it does not book a calendar slot or subscribe visitors to marketing. A confirmed receiver receipt is required before success appears. The legacy receiver retains its existing delivery behavior and may duplicate unchanged retries. For the token-protected, retry-safe receiver, follow docs/FORM_DELIVERY.md.

Edit content/site.json and commit to publish content through Vercel. Sanity is optional; leave its variables unset for launch. docs/CONTENT_EDITING.md explains the later CMS connection.

## Motion and search

One desktop introduction, scroll-linked operating stories, interactive working-day chapters, and keyboard/reduced-motion fallbacks. No video or WebGL download is required. Each content page has distinct metadata, a canonical URL and relevant structured data. The sitemap and llms.txt derive from published content. Neither metadata nor llms.txt guarantees search placement.

## Release checks

Verify mobile and keyboard interactions, consent choices, real enquiry delivery, domain redirects and PageSpeed on the deployed version. A successful build is not a measured performance score. Business/legal notices still require the owner's approval of entity details, retention and provider arrangements. Asset licenses and provenance are retained with the supplied files.
