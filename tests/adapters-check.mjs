import { build } from "esbuild";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
const dir = await mkdtemp(tmpdir() + "/rm-tests-");
async function load(entry, name) {
  const out = dir + "/" + name + ".mjs";
  await build({
    entryPoints: [entry],
    outfile: out,
    bundle: true,
    platform: "node",
    format: "esm",
    packages: "bundle",
  });
  return import(pathToFileURL(out));
}
const { POST } = await load("app/api/review/route.ts", "review");
const form = {
  name: "QA Operator",
  business: "QA Restaurant",
  email: "qa@example.invalid",
  phone: "",
  locations: "1",
  restaurantType: "Cafe",
  systems: "",
  concern: "Synthetic test only",
  timing: "",
  consent: true,
  website: "",
};
const req = (data) =>
  new Request("https://example.invalid/api/review", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://example.invalid",
    },
    body: JSON.stringify(data),
  });
delete process.env.LEAD_WEBHOOK_URL;
delete process.env.LEAD_WEBHOOK_TOKEN;
delete process.env.GOOGLE_APPS_SCRIPT_URL;
assert.equal((await POST(req(form))).status, 503);
assert.equal((await POST(new Request("https://example.invalid/api/review", {
  method: "POST", body: "{",
}))).status, 400);
assert.equal((await POST(req({ ...form, consent: false }))).status, 400);
assert.equal((await POST(req({ ...form, email: "bad" }))).status, 400);
assert.equal((await POST(req({ ...form, website: "spam" }))).status, 400);
process.env.LEAD_WEBHOOK_URL = "https://receiver.example.invalid";
process.env.LEAD_WEBHOOK_TOKEN = "test-only";
const realFetch = globalThis.fetch;
let sent;
globalThis.fetch = async (url, opts) => {
  sent = JSON.parse(opts.body);
  return new Response("{}", { status: 202 });
};
assert.equal((await POST(req(form))).status, 200);
assert.equal(sent.email, form.email);
assert.equal(sent.source, "ready-margin-website");
const firstReceipt = sent.submissionId;
assert.equal((await POST(req(form))).status, 200);
assert.equal(sent.submissionId, firstReceipt, "Unchanged retries retain their receipt");
assert.equal((await POST(req({ ...form, concern: "A revised enquiry" }))).status, 200);
assert.notEqual(sent.submissionId, firstReceipt, "Changed enquiries receive a new receipt");
globalThis.fetch = async () => new Response("{}", { status: 500 });
assert.equal((await POST(req(form))).status, 502);
globalThis.fetch = async () => {
  throw new Error("offline");
};
assert.equal((await POST(req(form))).status, 502);
process.env.LEAD_WEBHOOK_MODE = "apps-script";
globalThis.fetch = async (url, opts) => {
  assert(!String(url).includes("test-only"));
  assert.equal(opts.headers.Authorization, "Bearer test-only");
  const body = JSON.parse(opts.body);
  assert.equal(body.receiverToken, "test-only");
  assert.match(body.submissionId, /^[a-f0-9]{64}$/);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};
assert.equal((await POST(req(form))).status, 200);
globalThis.fetch = async () =>
  new Response(JSON.stringify({ ok: false }), { status: 200 });
assert.equal((await POST(req(form))).status, 502);
delete process.env.LEAD_WEBHOOK_MODE;
delete process.env.LEAD_WEBHOOK_URL;
delete process.env.LEAD_WEBHOOK_TOKEN;
process.env.GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/test-only/exec";
globalThis.fetch = async (url, opts) => {
  const body = JSON.parse(opts.body);
  assert.equal(body.company, form.business);
  assert.equal(body.phone, "Not provided");
  assert.equal(body.revenue, "Not collected by this form");
  assert.equal(body.consent, true);
  assert.equal(body.meetingRequested, false);
  assert.equal(body.marketingOptIn, false);
  assert(!opts.headers.Authorization);
  return Response.json({ ok: true });
};
assert.equal((await POST(req(form))).status, 200);
globalThis.fetch = async () => Response.json({ ok: false });
assert.equal((await POST(req(form))).status, 502);
delete process.env.GOOGLE_APPS_SCRIPT_URL;
const { diagnosticSchema, diagnose } = await load("lib/forms.ts", "diagnostic");
assert(!diagnosticSchema.safeParse({ locations: 0 }).success);
const result = diagnose(
  diagnosticSchema.parse({
    locations: 3,
    restaurantType: "Full service",
    payroll: "Variable hours and tips",
    systems: 5,
    cadence: "Monthly",
    food: "Complex inventory / recipes",
    concern: "Food cost",
  }),
);
assert.equal(result.capability, "food-cost-vendors");
assert(result.gaps.length >= 4);
assert(!JSON.stringify(result).includes("%"));
globalThis.fetch = realFetch;
await rm(dir, { recursive: true, force: true });
console.log(
  "PASS: form validation/consent/spam, unconfigured fallback, accepted delivery, provider errors, offline retry, Apps Script receipt validation and diagnostic logic. No real messages sent.",
);
