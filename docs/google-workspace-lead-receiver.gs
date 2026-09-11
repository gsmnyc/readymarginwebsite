// Set SHEET_ID and LEAD_WEBHOOK_TOKEN in Project Settings → Script properties.
const SHEET_NAME = "Website enquiries";
const HEADERS = [
  "Receipt ID", "Received at", "Name", "Restaurant", "Email", "Phone",
  "Locations", "Restaurant type", "Systems", "Concern", "Timing",
  "Consent", "Notification",
];

function doPost(e) {
  let lead;
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > 16000) return json({ ok: false });
    lead = JSON.parse(raw);
  } catch (_) {
    return json({ ok: false });
  }
  if (!lead || typeof lead !== "object" || Array.isArray(lead)) return json({ ok: false });

  const properties = PropertiesService.getScriptProperties();
  const token = properties.getProperty("LEAD_WEBHOOK_TOKEN");
  if (!token || token.length < 32 || lead.receiverToken !== token)
    return json({ ok: false });
  if (
    lead.consent !== true || lead.website ||
    lead.source !== "ready-margin-website" ||
    !/^[a-f0-9]{64}$/.test(lead.submissionId || "") ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email || "") ||
    ["name", "business"].some((key) => !String(lead[key] || "").trim())
  )
    return json({ ok: false });

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(4000)) return json({ ok: false });
  try {
    const sheet = enquirySheet(properties);
    const last = sheet.getLastRow();
    const existing = last > 1 && sheet.getRange(2, 1, last - 1, 1)
      .createTextFinder(lead.submissionId).matchEntireCell(true).findNext();
    if (existing) {
      notifyRow(sheet, existing.getRow(), properties);
      return json({ ok: true, submissionId: lead.submissionId });
    }
    const day = new Date().toISOString().slice(0, 10);
    const count = properties.getProperty("ENQUIRY_DAY") === day
      ? Number(properties.getProperty("ENQUIRY_COUNT") || 0) : 0;
    const limit = Number(properties.getProperty("MAX_DAILY_ENQUIRIES") || 100);
    if (!Number.isFinite(limit) || limit < 1 || count >= limit) return json({ ok: false });
    properties.setProperties({ ENQUIRY_DAY: day, ENQUIRY_COUNT: String(count + 1) });
    const values = [
      lead.submissionId, new Date().toISOString(),
      clean(lead.name, 100), clean(lead.business, 160), clean(lead.email, 254),
      clean(lead.phone, 40), clean(lead.locations, 20), clean(lead.restaurantType, 100),
      clean(lead.systems, 500), clean(lead.concern, 2000), clean(lead.timing, 200),
      "Yes", "Pending",
    ];
    const row = last + 1;
    sheet.getRange(row, 1, 1, HEADERS.length).setNumberFormat("@").setValues([values]);
    SpreadsheetApp.flush();
    // A saved enquiry is accepted even if the notification needs another attempt.
    notifyRow(sheet, row, properties);
    return json({ ok: true, submissionId: lead.submissionId });
  } catch (_) {
    return json({ ok: false });
  } finally {
    lock.releaseLock();
  }
}

function clean(value, limit) {
  const text = String(value || "").trim().slice(0, limit);
  // Prevent submitted text becoming a formula in Sheets or a later CSV export.
  return /^[=+@\-]/.test(text) ? "'" + text : text;
}

function enquirySheet(properties) {
  const book = SpreadsheetApp.openById(properties.getProperty("SHEET_ID"));
  const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  } else if (sheet.getRange(1, 1).getValue() !== HEADERS[0]) {
    throw new Error("Use a new Website enquiries tab with the current column structure.");
  }
  return sheet;
}

function notifyRow(sheet, row, properties) {
  try {
    const values = sheet.getRange(row, 1, 1, HEADERS.length).getValues()[0];
    if (values[12] === "Sent" || MailApp.getRemainingDailyQuota() < 1) return;
    MailApp.sendEmail({
      to: properties.getProperty("NOTIFY_EMAIL") || "contact@readymargin.com",
      subject: "New Ready Margin review enquiry",
      body: "A new enquiry is saved in your private Website enquiries Sheet.\n\n" +
        "Restaurant: " + values[3] + "\nContact: " + values[2] + " · " + values[4] +
        "\n\nOpen the Sheet: https://docs.google.com/spreadsheets/d/" + properties.getProperty("SHEET_ID"),
    });
    sheet.getRange(row, 13).setValue("Sent");
  } catch (_) {
    // The Pending cell is the durable outbox; do not discard the saved enquiry.
  }
}

// Run manually, or add a time-driven trigger in Apps Script to retry pending mail.
function retryPendingNotifications() {
  const properties = PropertiesService.getScriptProperties();
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(4000)) return;
  try {
    const sheet = enquirySheet(properties);
    for (let row = 2, attempted = 0; row <= sheet.getLastRow() && attempted < 20; row++) {
      if (sheet.getRange(row, 13).getValue() === "Pending") {
        notifyRow(sheet, row, properties);
        attempted++;
      }
    }
  } finally {
    lock.releaseLock();
  }
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
