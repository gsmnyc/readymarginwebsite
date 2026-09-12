// Homepage copy. Detailed scope and search content remain in the JSON page collections.
export const home = {
  eyebrow: "Managed restaurant financial operations",
  headline: ["Back to the", "good part."],
  introduction: "You focus on the restaurant you built. We handle the agreed finance and back-office work, explain the numbers and help you decide what comes next.",
  services: [
    { title: "People & shifts", description: "The hours, corrections and approvals behind a dependable payroll cutoff.", links: [
      { label: "Payroll & tips", href: "/restaurant-payroll-services" },
      { label: "Labor cost & scheduling workflows", href: "/restaurant-labor-cost-management" },
    ] },
    { title: "Books & cash", description: "The records, supplier bills and reconciliations that make the financial picture useful.", links: [
      { label: "Accounting & bookkeeping", href: "/restaurant-accounting-services" },
      { label: "Payables & vendor bills", href: "/restaurant-accounts-payable-services" },
      { label: "Tax & compliance support", href: "/restaurant-tax-services" },
    ] },
    { title: "Decisions & progress", description: "Food cost, cash flow and financial guidance connected to what happens on the floor.", links: [
      { label: "Food cost & inventory", href: "/restaurant-food-cost-management" },
      { label: "Cash flow & CFO guidance", href: "/restaurant-cfo-services" },
      { label: "Turnaround consulting", href: "/restaurant-turnaround-consulting" },
    ] },
  ],
  relationship: [
    { title: "Run", body: "Agree the recurring jobs, the records we need and the person who approves. Then we get on with the work." },
    { title: "Explain", body: "What changed? Why does it matter? We make time to talk through the numbers, not just send them over." },
    { title: "Improve", body: "Choose the next action, name who owns it and check what happened. The follow-up stays part of the job." },
  ],
} as const;
