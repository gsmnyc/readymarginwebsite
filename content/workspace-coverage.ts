// Reviewed against the public dashboard on 1 October 2026. These describe
// service tasks, not a promise that the demo connects providers or moves money.
export const workspaceCoverage = [
  {
    title: "Team records & access",
    path: "/restaurant-back-office-services",
    body: "Keep the people, rates and source-system identities behind the finance work organized.",
    items: ["Employee records, roles and effective pay rates", "POS names, clock IDs and designation mappings", "Employee views, correction requests and scoped access"],
  },
  {
    title: "Schedules & attendance",
    path: "/restaurant-labor-cost-management",
    body: "Review planned coverage alongside recorded time and the manager’s answers.",
    items: ["Shifts, availability and cross-location cover", "Hours by person, designation and department", "Missing punches, breaks and correction evidence"],
  },
  {
    title: "Checks, tips & pool rules",
    path: "/restaurant-tip-management",
    body: "Trace tips from the original check to the employee and approved rule used in preparation.",
    items: ["Unmatched POS names and held checks", "Pool versions, effective dates, groups and cuts", "Percentage inputs, day parts and share review"],
  },
  {
    title: "Weekly payroll preparation",
    path: "/restaurant-payroll-services",
    body: "Gather the evidence for each stage before the restaurant reviews the final input.",
    items: ["Attendance, tickets, rules and adjustment review", "Outstanding questions with a responsible contact", "Closed entry sheets, history and export handoffs"],
  },
  {
    title: "Bills & payment records",
    path: "/restaurant-accounts-payable-services",
    body: "Maintain the obligations and references needed to review what is due and what was paid.",
    items: ["Recurring bills, due dates and review status", "Check registers and recorded obligations", "Already-paid or scheduled-payment references"],
  },
  {
    title: "Bank records & cash review",
    path: "/restaurant-cash-flow-management",
    body: "Compare dated balances, bank activity and commitments before making a payment decision.",
    items: ["Account balances with observation dates", "Matched, possible and unmatched bank entries", "Intercompany movement and transfer records"],
  },
  {
    title: "Reports & decision records",
    path: "/restaurant-cfo-services",
    body: "Review results with their period, source and approval history attached.",
    items: ["Closed payroll registers and recorded totals", "Morning cash reviews and commitments", "Activity, changes and documented decisions"],
  },
  {
    title: "Setup & compliance records",
    path: "/restaurant-compliance-services",
    body: "Agree the operating setup and maintain the records that need a recurring review.",
    items: ["Companies, locations and business-day settings", "Provider handoffs, clock mapping and attendance rules", "Licence, permit and expiry-reminder records"],
  },
] as const;
