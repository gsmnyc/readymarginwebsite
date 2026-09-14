# Enquiry delivery with Google Workspace

Sanity is not needed for the initial launch. Keep the website content in `content/site.json`, deploy it through the existing Vercel project and use the form's email fallback until the business has a named owner for lead follow-up.

If you want a working inbox and a private log without adding another paid service, a Google Apps Script web app can receive the server-side request, append a row to a restricted Google Sheet and notify `contact@readymargin.com`.

## Setup

1. Create a private Google Sheet in the Ready Margin Workspace. The receiver creates a tab named `Website enquiries` with its required headers. If an older receiver already wrote to a tab with that name, rename that old tab first; keep the records.
2. Open Extensions → Apps Script and paste `docs/google-workspace-lead-receiver.gs`.
3. In Apps Script, open Project Settings → Script properties. Add `SHEET_ID` (the ID between `/d/` and `/edit` in the Sheet URL) and `LEAD_WEBHOOK_TOKEN` (a randomly generated secret of at least 32 characters). Add `DOCUMENT_ID` if each accepted enquiry should also be appended to a private Google Doc. Optional `NOTIFY_EMAIL` defaults to `contact@readymargin.com`; optional `MAX_DAILY_ENQUIRIES` defaults to 100. Put the same token in Vercel's server-only `LEAD_WEBHOOK_TOKEN` environment variable. Keep it out of source code and chat.
4. Deploy → New deployment → Web app. Execute as the account that owns the Sheet. For a public website, the access setting must allow anonymous visitors; Workspace administrators can restrict this, so test from a private browser window.
5. Copy the `/exec` URL into Vercel as `LEAD_WEBHOOK_URL`. Set `LEAD_WEBHOOK_MODE=apps-script` and `LEAD_WEBHOOK_TOKEN` in the Production environment, then redeploy.
6. Submit a clearly labelled test enquiry from the live form. Confirm one Sheet row, one notification, one Document entry when configured, and a success state. Retry the same unchanged enquiry on the same UTC day and confirm no duplicate row or Document entry. Remove only the test records afterward.
7. Run `retryPendingNotifications` from the script editor to confirm its permissions. If automatic retry is wanted, add a time-driven Apps Script trigger for this function. The private Sheet's Notification column shows Pending or Sent; review Pending entries as part of lead follow-up.

Apps Script's `doPost(e)` receives the JSON body through `e.postData.contents`. The website sends the secret inside that server-to-server body only in `apps-script` mode. It is not put in the URL or browser bundle. The route accepts success only when the script returns JSON `{ "ok": true }` after saving a row. Update both the website and receiver together when upgrading from the earlier query-parameter adapter.

The receiver uses a script lock and a receipt column to deduplicate retries. Identical validated submissions on the same UTC day have the same receipt; an edited submission or a new day creates a new enquiry. The Sheet remains the durable record. Email or Document delivery failures leave the corresponding status Pending so `retryPendingNotifications` can try again without asking the visitor to re-enter anything. Notifications are best-effort and may repeat if Google sends a message but the following status write fails; exactly-once email delivery is not claimed.

A configurable global daily cap protects the log and notification quota. It is not per-visitor bot protection; use Vercel's project protections if abuse occurs. The script escapes spreadsheet-formula prefixes and keeps all lead fields out of analytics. Google quotas and Workspace policy still apply. If Workspace cannot permit an anonymous web app, leave the webhook unset and use the visible email fallback until an approved HTTPS receiver is available.

The Sheet is the lead log, not a content-management database. Keep access restricted to the people responsible for responding and apply the business's approved retention policy.

## Verified and still pending

Local tests cover authentication, required consent, duplicate requests, failed notification recovery, formula escaping, the daily cap and the website adapter. They use simulated Google services and send no messages. Creating the Google script, authorizing its services, setting the Vercel environment and proving real inbox receipt require account access; none is implied by those tests.

Official references: [web-app deployment](https://developers.google.com/apps-script/guides/web), [script properties](https://developers.google.com/apps-script/guides/properties), [concurrency locks](https://developers.google.com/apps-script/reference/lock/lock-service), [service quotas](https://developers.google.com/apps-script/guides/services/quotas).

## Later CMS decision

Add Sanity when a non-developer needs drafts, scheduled publishing, role-based approvals or frequent article edits. It is not required for indexing, Vercel delivery or the initial enquiry flow. When it is added, keep `content/site.json` as the fallback and publish only approved marketing content; never place restaurant records in the CMS.
