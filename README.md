# Ready Margin website

Production-ready marketing site for Ready Margin, a managed financial-control service for restaurants and growing groups.

## Stack

- Next.js App Router
- React and TypeScript
- CSS-only motion and responsive layout
- Node.js 22+
- pnpm

No client-side database or third-party UI runtime is required.

## Project structure

- `app/page.tsx` — page content, navigation, theme switcher, Margo guide, roadmap, pricing, FAQs, and intake form.
- `app/globals.css` — design tokens, responsive layouts, accessibility states, themes, and motion.
- `app/api/review/route.ts` — server-only proxy to the intake endpoint.
- `integrations/google-apps-script/Code.gs` — Google Docs/Sheets logging, optional Calendar scheduling, and email notifications.
- `public/` — logos, Margo states, metadata files, sitemap, and robots rules.
- `.env.example` — environment variable template.

## Run locally

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`.

## Build and run production

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

The application listens on the `PORT` supplied by the hosting platform.

## Form submission workflow

The browser submits to `/api/review`. The server forwards the request to the Google Apps Script Web App configured through `GOOGLE_APPS_SCRIPT_URL`.

The Apps Script then:

1. Validates required fields and follow-up consent.
2. Appends the submission to the Ready Margin Google Doc and Google Sheet.
3. Checks an optional requested meeting time against the default calendar.
4. Creates a 30-minute event when available and invites the visitor plus `info@gsmnyc.com`.
5. Emails the visitor a confirmation and calendar link.
6. Sends an internal notification to `info@gsmnyc.com`.
7. Records scheduling, calendar, and email delivery status.

If the endpoint is not configured, the form uses a prepared email fallback so a lead is not silently discarded.

## Google Apps Script setup

1. Open [Google Apps Script](https://script.google.com) and create or open the Ready Margin project.
2. Replace its source with `integrations/google-apps-script/Code.gs`.
3. Deploy as a Web App, executing as the owner, with access set to **Anyone**.
4. Authorize Google Docs, Sheets, Calendar, and Gmail access.
5. Copy the deployment `/exec` URL.
6. Add it to the hosting environment as `GOOGLE_APPS_SCRIPT_URL`.

Destinations:

- [Lead intake Sheet](https://docs.google.com/spreadsheets/d/1lMGoc8nMekm_1q7t8W0rcemY6xl30Z7zjuSBRqbnRWk/edit?usp=drivesdk)
- [Submission Doc](https://docs.google.com/document/d/1FOV2vy07VUL4F78UuVYnqYAih3ytgo3GhwYioP3RIaY/edit)

Keep the endpoint server-only. Never prefix it with `NEXT_PUBLIC_`, and never commit credentials or environment files.

## Deploy to Vercel

1. Import the repository into Vercel.
2. Select the project root.
3. Use the default Next.js framework preset.
4. Set Node.js version to 22.
5. Set `GOOGLE_APPS_SCRIPT_URL` for Preview and Production.
6. Deploy with these defaults:

```text
Install command: pnpm install --frozen-lockfile
Build command: pnpm build
Output: Next.js default
Start command: managed by Vercel
```

7. Add `readymargin.com` in Vercel Domains.
8. Update Squarespace DNS with the exact records Vercel provides.
9. Verify HTTPS, then submit `https://readymargin.com/sitemap.xml` to Google Search Console and Bing Webmaster Tools.

## Email and deliverability

Create `contact@readymargin.com` through Google Workspace connected to Squarespace. Configure SPF, DKIM, and DMARC for `readymargin.com`. Verify that the sending alias is authorized before using it in production.

## QA before launch

- Test light and dark themes at phone, tablet, laptop, and wide-monitor widths.
- Confirm the form blocks submission without required consent.
- Submit a test with a controlled email address.
- Verify the Google Doc entry, Sheet row, calendar invite, visitor email, and internal email.
- Confirm meeting conflicts are saved for follow-up instead of being silently rejected.
- Confirm no `.env` file, token, or private credential is committed.
