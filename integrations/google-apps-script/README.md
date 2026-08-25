# Ready Margin intake connection

`app/api/review/route.ts` accepts the browser form submission and forwards it server-to-server to this Google Apps Script Web App. The script writes every accepted lead to both the shared Google Doc and the structured Google Sheet, can create a Calendar invitation, and sends the acknowledgement/internal notification emails.

## One-time setup

1. Open `Code.gs` at [script.google.com](https://script.google.com) while signed in to the Google account that owns the shared submissions document.
2. Create a standalone Apps Script project and paste in the contents of `Code.gs`.
3. Deploy it as **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone** (the public site needs to submit without a Google login)
4. Complete the one-time Google authorization for Google Docs, Google Sheets, Google Calendar, and Gmail.
5. Copy the `/exec` deployment URL.
6. Set the URL in the server environment only:

   ```text
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

7. Redeploy/restart the Node service so the environment value is loaded.

The browser never receives this environment variable. Do not use a `NEXT_PUBLIC_` prefix.

## Destination and behavior

The script writes to both destinations:

```text
https://docs.google.com/document/d/1FOV2vy07VUL4F78UuVYnqYAih3ytgo3GhwYioP3RIaY/edit

Structured intake sheet:

https://docs.google.com/spreadsheets/d/1lMGoc8nMekm_1q7t8W0rcemY6xl30Z7zjuSBRqbnRWk/edit
```

Each accepted submission appends:

- timestamp, submission ID, and status
- name, email, phone, restaurant/group, locations, revenue, and setup
- requested help areas and reason for contacting
- required follow-up permission and optional marketing preference
- requested meeting date, time, and timezone
- calendar event URL, meeting status, and visitor/internal email status

The script sends one acknowledgement to the submitter and one internal notification to `info@gsmnyc.com`. When a visitor selects a preferred date and time, the script checks the default calendar, creates a 30-minute event when the slot is free, invites both the visitor and `info@gsmnyc.com`, and includes the event link in the visitor email and both lead destinations. If the slot is busy, the lead is still saved and the team is told to follow up with another time. The required follow-up permission is validated again server-side; it cannot be bypassed by editing browser requests.

## Sender setup and deliverability

For the acknowledgement to display `contact@readymargin.com` as the sender, add and verify that address as a Gmail sending alias for the account running the script. If the alias is not available, the script sends from the authorized account and uses `contact@readymargin.com` as Reply-To.

Configure SPF, DKIM, and DMARC for `readymargin.com` through the domain's mail provider. These improve deliverability but cannot guarantee that every message avoids spam.

## Safe test

Use a test address and non-sensitive sample data after deployment. A direct smoke test can be sent to the web app URL with a JSON body matching:

```json
{
  "name": "Test Owner",
  "email": "test@example.com",
  "phone": "+1 555 010 0100",
  "company": "Test Restaurant",
  "locations": "1 location",
  "revenue": "Under $1M",
  "setup": "Owner-managed",
  "needs": ["Reporting and cash visibility"],
  "trigger": "Testing the review flow.",
  "consent": true,
  "marketingOptIn": false,
  "meetingRequested": true,
  "meetingDate": "2026-09-15",
  "meetingTime": "10:00",
  "timezone": "America/New_York"
}
```

Do not use real customer data in a first test. Confirm the document block, Sheet row, visitor acknowledgement, internal notification, Calendar event, two attendees, event URL, and consent values before directing production traffic to the form. The Apps Script account must have access to the default calendar used for scheduling.

## Security rules

- Keep OAuth tokens, Gmail passwords, service-account keys, and private deployment credentials out of Git.
- Keep `GOOGLE_APPS_SCRIPT_URL` server-side.
- Keep the Google Doc limited to the intended collaborators.
- Review retention and deletion requirements with counsel before launch.
