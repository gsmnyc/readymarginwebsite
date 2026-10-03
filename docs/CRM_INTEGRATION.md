# Website integration and cutover

The CRM receiver and website patch are implemented and tested with synthetic input. Main and production configuration remain untouched. The patch does not create a hosted CRM destination, managed login, notification service or customer tenant.

## Existing system and patch

The website uses `/api/review`, its existing Zod schema and `LEAD_WEBHOOK_*` variables. Its Apps Script documentation describes Sheet receipts/notifications; documentation alone does not establish live delivery. No Google connection was added.

The standalone CRM foundation package carries patch files under `integrations/website`; they map to matching paths in this website repository:

| File | Change |
| --- | --- |
| `app/api/review/route.ts` | Byte-stream body limit; validated attempt header; stable receipt key; CRM-specific durable acknowledgement; preserves existing modes |
| `components/site/lead-form.tsx` | Retains in-memory attempt across failed retries; changes it on edited validated details; clears on success |
| `lib/enquiry-attempt.ts` | Small pure attempt policy; no persistent storage/telemetry |
| `lib/enquiry-body.ts` | Byte cap and stream cancellation |
| `lib/crm-receipt.ts` | Valid receipt ID and matching submission key |
| `tests/crm-receiver-check.mjs` | Transport, attempt/midnight and body tests; real Zod coverage remains in existing tests |

The repository PR also documents CRM mode and adds form tests to CI. This archive is not a complete marketing repository; these patch files do not run inside the native CRM server.

## Payload

```json
{
  "name": "Synthetic Operator",
  "business": "Sample Restaurant",
  "email": "qa@example.invalid",
  "phone": "",
  "locations": "1",
  "restaurantType": "Cafe",
  "systems": "",
  "concern": "Synthetic integration test",
  "timing": "",
  "consent": true,
  "website": "",
  "source": "ready-margin-website",
  "receivedAt": "2026-10-03T10:00:00.000Z",
  "submissionId": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}
```

The server sends a private bearer token. Its receiver capability binds only to append capture into `rm-internal`, config `website-v1`. Posted destination/owner/stage/entitlement fields cannot alter that binding. Invalid source, required fields/permission, honeypot and oversized input are rejected. Durable timestamps come from the receiver.

The updated website hashes a client attempt UUID into the 64-hex submission ID. Receiver uniqueness is tenant/config/submission ID plus normalized payload hash. Unchanged replay returns the receipt; changed payload under the same ID returns 409. Older clients without the header keep the original same-day content key, with its next-day duplicate/same-day-collapse limitations. The new memory-only attempt survives same-form-session retries across midnight; it does not restore a draft after page reload.

## Receipt

```json
{
  "ok": true,
  "receiptId": "11111111-1111-4111-8111-111111111111",
  "submissionId": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "created": true
}
```

Only after transaction commit: first capture 201; replay 200 with `created:false`. Generic 202, missing receipt, mismatched key, upstream failure or timeout cannot produce website CRM success. Existing failure UX preserves input and offers retry/email fallback.

This confirms saved capture, not calendar booking, marketing subscription, notification delivery or service activation. Email drafts remain unsent until the person sends them. This receiver sends no mail.

## Configuration and production cutover

Website server-only environment:

```dotenv
LEAD_WEBHOOK_MODE=crm
LEAD_WEBHOOK_URL=https://YOUR-VERIFIED-CRM-HOST/api/v1/intake/ready-margin
LEAD_WEBHOOK_TOKEN=PRIVATE-RANDOM-SECRET
```

CRM uses the same secret as `CRM_INTAKE_TOKEN` and fixed `CRM_INTAKE_TENANT=rm-internal`. The values above are placeholders. Never use `NEXT_PUBLIC_` for secrets or place credentials in a PR/log/screenshot.

Before live configuration:

1. Implement managed identity, supported protected staff access and the real database choice. An inaccessible receiver database is not an operational CRM launch.
2. Verify durable hosting, TLS, deadlines, secrets, redacted monitoring and backup/restore. SQLite needs one durable host/volume; Vercel ephemeral function storage is unsuitable.
3. Apply effective public website ingress limits/bot controls before forwarding. Receiver process-local throttling is aggregate protection; Origin/honeypot are not bot authentication, and proxy IP is not visitor identity.
4. Define notification provider/operator ownership and retriable failure handling. Retain the existing inbox/receiver until its replacement is ready. Prefer saved lead/outbox then provider delivery; do not make email part of the lead transaction.
5. Run full website build/lint/typecheck and old/new form tests; verify actual browser retry/fallback/consent behaviour.
6. Submit authorized synthetic data through the real website route. Confirm tenant, receipt, retry deduplication, operator visibility, failure UX and monitoring.
7. Cut over through the authorized deployment process; retain previous verified configuration privately; record actual deployment/test evidence without secrets.

## Rollback and migration

Restore the previous verified receiver mode/URL/token on capture/operational failure. Preserve every captured lead and receipt. Reconcile by scoped receipt/provenance; importing historical Sheets needs preview/deduplication, not automatic company-name/email joins. Do not silently dual-send: partial success creates ambiguity. If dual delivery is needed later, make one durable receiver authoritative and fan out from its outbox.

## Website changes later

Keep public content/services/current CTA. Add authenticated CRM/dashboard entry and customer onboarding only once identity/entitlements are verified. Public enquiries never provision customer tenants or grant payroll/finance access.
