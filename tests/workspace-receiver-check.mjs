import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const values = [];
const properties = new Map([
  ["SHEET_ID", "private-test-sheet"],
  ["LEAD_WEBHOOK_TOKEN", "test-only-token-with-at-least-32-characters"],
  ["DOCUMENT_ID", "private-test-document"],
  ["MAX_DAILY_ENQUIRIES", "2"],
]);
let sends = 0;
let failMail = false;
let failDocument = true;
let locked = false;
const documentRecords = [];
const sheet = {
  getLastRow: () => values.length,
  appendRow: (row) => values.push([...row]),
  setFrozenRows() {},
  getRange(row, column, height = 1, width = 1) {
    const range = {
      setNumberFormat: () => range,
      setValues(rows) {
        rows.forEach((cells, i) => {
          values[row - 1 + i] ||= [];
          cells.forEach((cell, j) => {
            values[row - 1 + i][column - 1 + j] = cell;
          });
        });
        return range;
      },
      getValues: () =>
        Array.from({ length: height }, (_, i) =>
          (values[row - 1 + i] || []).slice(column - 1, column - 1 + width),
        ),
      getValue: () => values[row - 1]?.[column - 1],
      setValue(value) {
        values[row - 1][column - 1] = value;
      },
      createTextFinder(text) {
        return {
          matchEntireCell() {
            return this;
          },
          findNext() {
            const index = values.findIndex(
              (cells, i) =>
                i >= row - 1 &&
                i < row - 1 + height &&
                cells[column - 1] === text,
            );
            return index === -1 ? null : { getRow: () => index + 1 };
          },
        };
      },
    };
    return range;
  },
};
const context = {
  PropertiesService: {
    getScriptProperties: () => ({
      getProperty: (key) => properties.get(key),
      setProperties: (record) =>
        Object.entries(record).forEach(([key, value]) =>
          properties.set(key, value),
        ),
    }),
  },
  SpreadsheetApp: {
    openById: () => ({ getSheetByName: () => sheet }),
    flush() {},
  },
  DocumentApp: {
    openById() {
      if (failDocument) throw new Error("document unavailable");
      return {
        getBody: () => ({
          findText: (receipt) => documentRecords.some((record) => record.includes(receipt)) ? {} : null,
          appendParagraph(record) { documentRecords.push(record); },
          appendHorizontalRule() {},
        }),
        saveAndClose() {},
      };
    },
  },
  LockService: {
    getScriptLock: () => ({
      tryLock() {
        if (locked) return false;
        locked = true;
        return true;
      },
      releaseLock() {
        locked = false;
      },
    }),
  },
  MailApp: {
    getRemainingDailyQuota: () => 100,
    sendEmail() {
      if (failMail) throw new Error("mail unavailable");
      sends++;
    },
  },
  ContentService: {
    MimeType: { JSON: "application/json" },
    createTextOutput: (body) => ({ setMimeType: () => JSON.parse(body) }),
  },
};
runInNewContext(
  readFileSync("docs/google-workspace-lead-receiver.gs", "utf8"),
  context,
);
const lead = {
  name: "Test Operator",
  business: '=HYPERLINK("https://example.invalid")',
  email: "qa@example.invalid",
  concern: "+formula",
  consent: true,
  website: "",
  source: "ready-margin-website",
  receiverToken: properties.get("LEAD_WEBHOOK_TOKEN"),
  submissionId: "a".repeat(64),
};
const submit = (data) =>
  context.doPost({ postData: { contents: JSON.stringify(data) } });
assert.equal(submit(null).ok, false);
assert.equal(submit([]).ok, false);
assert.equal(submit({ ...lead, receiverToken: "wrong" }).ok, false);
assert.equal(submit({ ...lead, consent: false }).ok, false);
assert.equal(values.length, 0);
failMail = true;
assert.equal(submit(lead).ok, true);
assert.equal(values.length, 2);
assert.equal(values[1][12], "Pending");
assert.equal(values[1][13], "Pending");
assert(values[1][3].startsWith("'="));
assert(values[1][9].startsWith("'+"));
failDocument = false;
assert.equal(submit(lead).ok, true);
assert.equal(values.length, 2, "Retry must not duplicate the saved enquiry");
assert.equal(values[1][13], "Saved");
assert.equal(documentRecords.length, 1, "Retry archives exactly one Document entry");
failMail = false;
context.retryPendingNotifications();
assert.equal(values[1][12], "Sent");
assert.equal(sends, 1);
assert.equal(submit(lead).ok, true);
assert.equal(sends, 1, "A completed notification is not sent again");
assert.equal(submit({ ...lead, submissionId: "b".repeat(64) }).ok, true);
assert.equal(submit({ ...lead, submissionId: "c".repeat(64) }).ok, false);
assert.equal(
  values.length,
  3,
  "Daily cap rejects new rows while preserving accepted leads",
);
assert.equal(locked, false);
console.log(
  "PASS: receiver authentication, consent, formula escaping, durable row deduplication, Document archiving, pending delivery recovery and daily cap. Simulated Google services; no messages sent.",
);
