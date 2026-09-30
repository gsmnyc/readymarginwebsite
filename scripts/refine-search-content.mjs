import { readFileSync, writeFileSync } from "node:fs";

const read = name => JSON.parse(readFileSync(`content/${name}.json`, "utf8"));
const save = (name, data) => writeFileSync(`content/${name}.json`, JSON.stringify(data, null, 2) + "\n");
const services = read("service-pages");
for (const page of services.pages) {
  // Name the service in the main heading; retain the useful benefit in the body.
  page.heading = page.title;
  page.seoTitle = page.title;
}
const outsourced = services.pages.find(page => page.path === "/outsourced-restaurant-finance-team");
outsourced.description = "An outsourced restaurant finance team for bookkeeping, payroll preparation, payables and reporting. Agree the handoffs and keep your approvals.";
outsourced.answer = outsourced.description;
outsourced.sections = [
  { title: "Give recurring work a named team", body: "Choose the jobs you want handled outside your restaurant: bookkeeping, payroll preparation, invoice review or financial reporting. Your scope identifies the Ready Margin contact, the restaurant contact and the records each person supplies.", items: [] },
  { title: "Keep the handoff predictable", body: "We agree input dates, review times and the route for urgent questions. Managers confirm operating facts; your nominated approvers retain payroll and payment decisions. Missing information stays visible until it is answered.", items: [] },
  { title: "Review capacity as the work changes", body: "A new location, a different pay cycle or a backlog may change the work required. We review the scope and quote with you before adding responsibilities. Specialist tax, legal and payroll processing work is assigned explicitly.", items: [] },
];
save("service-pages", services);

const localCopy = {
  "/new-york": ["Restaurant Finance Services in New York", "Accounting, bookkeeping, payroll and financial guidance for New York restaurants. Build a service around your locations, people and review dates.", "Start with your New York locations", "Tell us how many restaurants you run, how the records arrive and who makes payroll and payment decisions. We map the recurring work by location before proposing accounting, payroll or financial guidance. A single restaurant and a restaurant group need different handoffs."],
  "/new-york/restaurant-payroll-services": ["Restaurant Payroll Support in New York", "New York restaurant payroll preparation: review hours, tips and corrections, resolve manager questions and organize the approval handoff.", "Map the pay cycle by location", "For each New York restaurant, we confirm the pay period, attendance source, tip inputs and manager who answers corrections. We organize the records for the payroll approver and coordinate the agreed handoff to your processor. Processing and filing responsibilities are stated in the proposal."],
  "/new-york/restaurant-bookkeeping-services": ["Restaurant Bookkeeping Services in New York", "Keep New York restaurant books current with sales settlement checks, supplier invoice records, bank reconciliation and a regular review.", "Give each input a delivery date", "We map the sales statements, bank activity, supplier invoices and payroll records for your New York restaurant. Each input has a restaurant contact and an agreed delivery date. Location labels stay attached to records when you operate more than one site."],
  "/new-york/restaurant-accounting-services": ["Restaurant Accounting Services in New York", "New York restaurant accounting for reconciled records, a monthly close and a review of sales, costs and outstanding questions.", "Close the period with the location detail intact", "We align sales settlements, supplier bills and payroll records to the same reporting period for your New York restaurants. Transfers and shared expenses need an agreed accounting basis. The close records unresolved items so you can read the results with their context."],
  "/new-york/restaurant-financial-consulting": ["Restaurant Financial Consulting in New York", "Financial consulting for New York restaurant owners. Review cost changes, cash commitments or a new operating decision using the available records.", "Define the restaurant decision", "A lease commitment, staffing change or additional New York location needs a clear question and decision date. We identify the available financial records, document the assumptions and agree what needs professional or operating confirmation before you decide."],
  "/new-york/restaurant-back-office-services": ["Restaurant Back-Office Services in New York", "Managed bookkeeping, payroll preparation, supplier bill review and reporting for New York restaurants, with named contacts and clear handoffs.", "Connect the restaurant to the back office", "We establish how each New York location supplies hours, sales records and supplier documents. Managers know where to send questions, and the finance team knows which person can confirm a record. Your scope assigns recurring jobs and keeps approval responsibilities clear."],
  "/new-york/restaurant-accounting-payroll-services": ["Restaurant Accounting & Payroll in New York", "Connect New York restaurant accounting and payroll preparation. Align hours, tip records and payroll entries with the books and monthly close.", "Connect the pay cycle to the accounting period", "Payroll preparation checks hours, tips and manager corrections. Accounting records the agreed payroll information in the correct period and reconciles the supporting activity. We define the handoff between both workstreams for each New York restaurant so the monthly close has the records it needs."],
  "/new-york/restaurant-financial-reporting-services": ["Restaurant Financial Reporting in New York", "Financial reporting for New York restaurants: review sales, food costs, labor and cash with consistent periods and clear location definitions.", "Agree what the report measures", "We establish the reporting period, account definitions and location allocation for your New York restaurant group or single site. Reports distinguish confirmed records from estimates and highlight late inputs. You can compare results without hiding the differences in their underlying records."],
  "/new-york/restaurant-finance-solutions": ["Finance Support for New York Restaurant Problems", "Get help with a New York restaurant’s overdue books, payroll questions, cash pressure or rising costs. Start with the records and set the next action.", "Start with the problem that cannot wait", "Tell us what is held up at your New York restaurant and which deadline matters first. An overdue close, a payroll correction and a supplier payment question require different evidence. We identify the relevant workstream and agree an initial review before proposing ongoing support."],
  "/new-york/restaurant-cfo-services": ["Restaurant CFO Services in New York", "CFO support for New York restaurants: review cash commitments, operating costs and performance before staffing, investment or growth decisions.", "Put the decision and the numbers together", "We bring the financial reports and operating assumptions for your New York restaurant into the same review. A new site, a staffing change and a cash commitment each need a defined decision, a time horizon and named people who can confirm the facts."],
  "/new-york/restaurant-turnaround-consulting": ["Restaurant Turnaround Consulting in New York", "Turnaround consulting for New York restaurants facing cash or margin pressure. Review immediate obligations and agree practical priorities.", "Establish the immediate obligations", "We review current cash records, recorded supplier bills, payroll timing and the decisions that cannot wait at your New York restaurant. The first review separates confirmed commitments from missing information and assigns a person to each urgent follow-up."],
  "/new-york/restaurant-food-cost-inventory-services": ["Restaurant Food Cost & Inventory in New York", "Review food costs and inventory for New York restaurants. Compare supplier prices, purchases, stock counts and waste on a consistent basis.", "Compare purchasing with the stock record", "For each New York location, we agree count dates, units and the treatment of transfers. Supplier invoices and stock records help explain cost changes; recipe and waste records add operating context when available. Missing counts are identified before results are compared."],
  "/new-york/restaurant-tax-compliance-support": ["Restaurant Tax & Compliance Support in New York", "Organize New York restaurant tax records, confirmed compliance deadlines and adviser handoffs. Define filing and professional responsibilities in advance.", "Confirm the requirements for your locations", "We organize records and review dates around the requirements confirmed by the appropriate professional for your New York business. Your service scope names who supplies documents, who checks them and who handles advice or filing. This coordination does not replace a legal or tax determination."],
  "/new-york/multi-location-restaurant-finance-services": ["Multi-Location Restaurant Finance in New York", "Coordinate finance across New York restaurant locations. Keep reporting periods, shared costs and local responsibilities consistent.", "Agree one reporting basis across the group", "We define the periods, location labels and allocation of shared costs for your New York restaurants. Local contacts confirm operating facts and transfers. The group review retains the detail needed to understand why one restaurant’s result differs from another’s."],
};
for (const name of ["search-pages", "nyc-intent-pages"]) {
  const data = read(name);
  for (const page of data.pages) {
    const copy = localCopy[page.path];
    if (!copy) continue;
    const [heading, description, title, body] = copy;
    page.heading = heading;
    page.seoTitle = heading;
    page.description = description;
    page.answer = description;
    page.sections[0] = { title, body, items: [] };
    if (page.path.endsWith("restaurant-accounting-payroll-services")) {
      page.sections[1] = { title: "Review both sides of the handoff", body: "Time and tip questions go to the manager who can confirm them. Payroll records then support the accounting entries, account checks and monthly close. We keep the operating approval and accounting review responsibilities distinct and documented.", items: ["Hours and tip input review", "Payroll record handoff", "Accounting entries and reconciliation"] };
    }
    if (page.path.endsWith("restaurant-financial-reporting-services")) {
      page.sections[1] = { title: "Explain the movement", body: "We review changes in sales, food costs, labor and operating expenses using comparable periods. Differences in account definitions, incomplete stock counts or late supplier bills are highlighted before conclusions are drawn.", items: [] };
      page.sections[2] = { title: "Give the review a next action", body: "Each material question has a responsible contact and an agreed next check. We confirm the reporting cadence and the records your managers supply, then use the next review to follow the answer through.", items: [] };
    }
  }
  save(name, data);
}
console.log("Updated service headings, focused search titles and New York service introductions.");
