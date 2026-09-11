# Content editing

## Without a CMS

Edit `content/site.json`; run `npm run test:content` and `npm run build:vercel` before deployment. The `pages` array controls page templates, headings, SEO, sections, status, related links and article categories. No page component is needed for a new article. Use a clean `/insights/slug` path, `kind: article`, an approved author, date, takeaway and a related capability.

This is the recommended initial-launch setup. Sanity is not required to publish this site: the typed local content is versioned with the code, has no extra runtime dependency when the Sanity variables are empty, and can be moved into the supplied Studio after the content workflow has a named editor and approval process.

Use `title` for the short navigation label and optional `seoTitle` for the search title. Each new article should answer a separate reader question, include a useful summary and link to its relevant service. That service automatically lists the published article as related reading. Run `node scripts/cms-seed.mjs --export` after changing local content to refresh the optional Sanity import file; this only writes a local file and sends nothing to a CMS.

## With Sanity Studio

Create a Sanity project and public dataset for approved marketing content only. The server reads the published perspective; do not store private restaurant data in this dataset. Set the documented environment variables. In `sanity/studio`, install dependencies and run the Studio with `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`. Add authorized editors through Sanity's project controls.

Run `npm run cms:seed` with a local write token, or import `sanity/seed.ndjson` using the Sanity CLI. Seeding uses createIfNotExists so it does not overwrite existing work. The site never needs a browser write token.

Edit Website pages, Service levels, FAQs or Brand/navigation in Studio. Publish changes; the application checks cached content at a 60-second revalidation interval. Use a published page record with `published: false` to withdraw a local-fallback page; do not simply delete the override. Drafts are excluded. Invalid page records or network failure fall back to the complete local content.

Pricing documents deliberately contain no price field. Keep the mandatory enquiry-only note. Current statuses must reflect approved service scope. The brand assets and font family are protected implementation choices, not CMS styling fields.

Form field labels/order can be edited; the server always requires name, business, email and consent. Existing supported field keys must remain unchanged. New sensitive fields require an explicit design and privacy review.

## Experiments

No active variants ship. The experiment register supports hypothesis, audience, start/end dates and decision. Enable an experiment only after assignment, consented exposure measurement and an analysis plan are implemented. Do not silently rotate copy or invent conversion results.
