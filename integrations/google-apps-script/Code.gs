/**
 * Ready Margin Financial Control Review intake.
 *
 * Deploy as a Google Apps Script web app that executes as the account owning
 * the Google Doc, Google Sheet, and Calendar. Keep the web-app URL server-side
 * in GOOGLE_APPS_SCRIPT_URL.
 */
const CONFIG = {
  DOCUMENT_ID: '1FOV2vy07VUL4F78UuVYnqYAih3ytgo3GhwYioP3RIaY',
  SPREADSHEET_ID: '1lMGoc8nMekm_1q7t8W0rcemY6xl30Z7zjuSBRqbnRWk',
  SPREADSHEET_TAB: 'Leads',
  INTERNAL_EMAIL: 'info@gsmnyc.com',
  SENDER_ALIAS: 'contact@readymargin.com',
  SENDER_NAME: 'Ready Margin',
  MEETING_MINUTES: 30,
};

const SHEET_HEADERS = [
  'Submission ID', 'Received At', 'Status', 'Full Name', 'Work Email', 'Phone',
  'Restaurant / Group', 'Locations', 'Revenue Range', 'Accounting Setup', 'Needs',
  'What Made You Look For Help', 'Follow-up Consent', 'Marketing Opt-In',
  'Meeting Requested', 'Meeting Start', 'Meeting End', 'Timezone', 'Calendar Event URL',
  'Google Meet URL', 'Visitor Email Status', 'Internal Email Status', 'Notes',
];

function doPost(event) {
  try {
    const data = parseRequest_(event);
    validate_(data);
    const receivedAt = new Date();
    const submissionId = Utilities.getUuid();
    const schedule = scheduleMeeting_(data, submissionId);
    const emailStatus = sendEmails_(data, receivedAt, schedule);
    const persistence = {
      document: appendDocument_(data, receivedAt, submissionId, schedule, emailStatus),
      sheet: appendSheet_(data, receivedAt, submissionId, schedule, emailStatus),
    };

    if (!persistence.document && !persistence.sheet) throw new Error('Both lead destinations failed');
    return json_({ ok: true, submissionId: submissionId, meetingStatus: schedule.status, calendarUrl: schedule.calendarUrl || '', persistence: persistence, emailStatus: emailStatus });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: 'submission_failed' });
  }
}

function parseRequest_(event) {
  if (event && event.postData && event.postData.contents) return JSON.parse(event.postData.contents);
  return event && event.parameter ? event.parameter : {};
}

function validate_(data) {
  ['name', 'email', 'phone', 'company', 'locations', 'revenue', 'setup', 'trigger'].forEach(function (field) {
    if (!String(data[field] || '').trim()) throw new Error('Missing required field: ' + field);
  });
  if (data.consent !== true) throw new Error('Follow-up permission is required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) throw new Error('Invalid email');
  if (data.meetingRequested === true) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.meetingDate || ''))) throw new Error('Meeting date is required');
    if (!/^\d{2}:\d{2}$/.test(String(data.meetingTime || ''))) throw new Error('Meeting time is required');
    if (!String(data.timezone || '').trim()) throw new Error('Meeting timezone is required');
  }
}

function scheduleMeeting_(data, submissionId) {
  const result = { status: 'not_requested', calendarUrl: '', meetUrl: '', start: '', end: '', note: '' };
  if (data.meetingRequested !== true) return result;
  try {
    const timezone = String(data.timezone || Session.getScriptTimeZone() || 'UTC');
    const start = Utilities.parseDate(String(data.meetingDate) + ' ' + String(data.meetingTime), timezone, 'yyyy-MM-dd HH:mm');
    const end = new Date(start.getTime() + CONFIG.MEETING_MINUTES * 60 * 1000);
    const calendar = CalendarApp.getDefaultCalendar();
    if (calendar.getEvents(start, end).length) {
      result.status = 'conflict';
      result.note = 'The requested time was already busy. Ready Margin will follow up to confirm another time.';
      result.start = start.toISOString();
      result.end = end.toISOString();
      return result;
    }
    const title = 'Ready Margin Financial Control Review — ' + clean_(data.company, 120);
    const event = calendar.createEvent(title, start, end, {
      description: buildMeetingDescription_(data, submissionId),
      guests: String(data.email) + ',' + CONFIG.INTERNAL_EMAIL,
      sendInvites: true,
    });
    result.status = 'scheduled';
    result.start = start.toISOString();
    result.end = end.toISOString();
    result.calendarUrl = 'https://calendar.google.com/calendar/u/0/r/eventedit/' + encodeURIComponent(event.getId());
    return result;
  } catch (error) {
    console.error(error);
    result.status = 'error';
    result.note = 'The meeting request was saved, but the calendar invitation could not be created.';
    return result;
  }
}

function appendDocument_(data, receivedAt, submissionId, schedule, emailStatus) {
  try {
    const needs = Array.isArray(data.needs) ? data.needs.join(', ') : String(data.needs || 'Not specified');
    const meeting = schedule.status === 'scheduled' ? 'Scheduled: ' + schedule.start + ' — ' + schedule.calendarUrl : (data.meetingRequested === true ? 'Meeting requested: ' + schedule.status + ' — ' + schedule.note : 'Meeting not requested');
    const record = [
      'Submission ID: ' + submissionId,
      'Submission — ' + receivedAt.toISOString(),
      'Full name: ' + clean_(data.name, 160),
      'Work email: ' + clean_(data.email, 240),
      'Phone: ' + clean_(data.phone, 80),
      'Restaurant or group: ' + clean_(data.company, 240),
      'Locations: ' + clean_(data.locations, 80),
      'Annual revenue: ' + clean_(data.revenue, 80),
      'Current accounting setup: ' + clean_(data.setup, 120),
      'Most help needed: ' + clean_(needs, 400),
      'Why now: ' + clean_(data.trigger, 2000),
      'Permission to follow up: Yes',
      'Optional marketing updates: ' + (data.marketingOptIn === true ? 'Yes' : 'No'),
      meeting,
      'Visitor email: ' + emailStatus.visitor,
      'Internal email: ' + emailStatus.internal,
      'Status: ' + statusFor_(data, schedule),
    ].join('\n');
    DocumentApp.openById(CONFIG.DOCUMENT_ID).getBody().appendParagraph(record);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function appendSheet_(data, receivedAt, submissionId, schedule, emailStatus) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(CONFIG.SPREADSHEET_TAB) || spreadsheet.getSheets()[0];
    if (sheet.getRange(1, 1).getValue() !== SHEET_HEADERS[0]) sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setValues([SHEET_HEADERS]);
    const needs = Array.isArray(data.needs) ? data.needs.join(', ') : String(data.needs || 'Not specified');
    sheet.appendRow([
      sheetText_(submissionId), receivedAt, statusFor_(data, schedule), sheetText_(data.name), sheetText_(data.email),
      sheetText_(data.phone), sheetText_(data.company), sheetText_(data.locations), sheetText_(data.revenue),
      sheetText_(data.setup), sheetText_(needs), sheetText_(data.trigger), 'Yes', data.marketingOptIn === true ? 'Yes' : 'No',
      data.meetingRequested === true ? 'Yes' : 'No', schedule.start ? new Date(schedule.start) : '', schedule.end ? new Date(schedule.end) : '',
      sheetText_(data.timezone || ''), sheetText_(schedule.calendarUrl || ''), sheetText_(schedule.meetUrl || ''),
      sheetText_(emailStatus.visitor), sheetText_(emailStatus.internal), sheetText_(schedule.note || ''),
    ]);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function sendEmails_(data, receivedAt, schedule) {
  const status = { visitor: 'failed', internal: 'failed' };
  const firstName = clean_(data.name, 160).split(/\s+/)[0] || 'there';
  const subject = schedule.status === 'scheduled' ? 'Your Ready Margin review is scheduled' : 'We received your Ready Margin review request';
  const reply = [
    'Hi ' + firstName + ',', '',
    'Thanks for reaching out to Ready Margin. We’ve received your Financial Control Review request and will contact you shortly to understand what is happening in your restaurant and find the right next step.',
    '',
    schedule.status === 'scheduled' ? 'Your requested conversation time is on the calendar. The invitation was sent to you and info@gsmnyc.com.' : '',
    schedule.calendarUrl ? 'Calendar event: ' + schedule.calendarUrl : '',
    schedule.status === 'conflict' ? 'The requested time is busy, so we will follow up with another option.' : '',
    '', 'If you need to add anything before we speak, reply to this email and include the details you want us to see.', '', 'Best,', 'Ready Margin',
  ].join('\n');
  const aliases = GmailApp.getAliases();
  const options = { name: CONFIG.SENDER_NAME, replyTo: CONFIG.SENDER_ALIAS };
  const internalOptions = { name: CONFIG.SENDER_NAME, replyTo: CONFIG.SENDER_ALIAS };
  if (aliases.indexOf(CONFIG.SENDER_ALIAS) !== -1) { options.from = CONFIG.SENDER_ALIAS; internalOptions.from = CONFIG.SENDER_ALIAS; }
  try { GmailApp.sendEmail(String(data.email), subject, reply, options); status.visitor = 'sent'; } catch (error) { console.error(error); }
  try { GmailApp.sendEmail(CONFIG.INTERNAL_EMAIL, 'New Ready Margin review request — ' + clean_(data.company, 120), buildInternal_(data, receivedAt, schedule), internalOptions); status.internal = 'sent'; } catch (error) { console.error(error); }
  return status;
}

function buildInternal_(data, receivedAt, schedule) {
  return [
    'A new Financial Control Review request was received.', '',
    'Received: ' + receivedAt.toISOString(), 'Name: ' + clean_(data.name, 160), 'Email: ' + clean_(data.email, 240),
    'Phone: ' + clean_(data.phone, 80), 'Restaurant or group: ' + clean_(data.company, 240), 'Locations: ' + clean_(data.locations, 80),
    'Annual revenue: ' + clean_(data.revenue, 80), 'Accounting setup: ' + clean_(data.setup, 120),
    'Most help needed: ' + clean_(Array.isArray(data.needs) ? data.needs.join(', ') : data.needs, 400),
    'Why now: ' + clean_(data.trigger, 2000), 'Permission to follow up: Yes',
    'Optional marketing updates: ' + (data.marketingOptIn === true ? 'Yes' : 'No'), 'Meeting status: ' + schedule.status,
    'Meeting start: ' + (schedule.start || 'Not requested'), 'Calendar event: ' + (schedule.calendarUrl || 'None'),
    'Scheduling note: ' + (schedule.note || 'None'),
  ].join('\n');
}

function buildMeetingDescription_(data, submissionId) {
  return ['Ready Margin Financial Control Review', 'Submission ID: ' + submissionId, 'Restaurant/group: ' + clean_(data.company, 240), 'Contact: ' + clean_(data.name, 160) + ' — ' + clean_(data.email, 240), '', 'This meeting was requested through readymargin.com. Follow-up consent was recorded.'].join('\n');
}

function statusFor_(data, schedule) {
  if (schedule.status === 'scheduled') return 'Scheduled';
  if (data.meetingRequested === true) return 'Meeting requested';
  return 'New';
}

function sheetText_(value) {
  const text = clean_(value, 4000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function clean_(value, maxLength) {
  return String(value == null ? '' : value).replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength || 4000);
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
