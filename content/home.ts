// Homepage copy. Detailed scope and search content remain in the JSON page collections.
export const home = {
  eyebrow: "Restaurant finance, run for you",
  headline: ["Your restaurant.", "Your finance team."],
  introduction: "Books, payroll, bills and the decisions between them. We handle your restaurant’s finance work, so you can spend less of the week chasing it.",
  services: [
    { title: "People & payroll", shot: "schedule", description: "Keep hours, tips and corrections together, with a clear route to the person who approves payroll.", links: [
      { label: "Restaurant payroll & tips", href: "/restaurant-payroll-services" },
      { label: "Labor cost & scheduling workflows", href: "/restaurant-labor-cost-management" },
    ] },
    { title: "Books & bills", shot: "reconciliation", description: "Bring sales, bank activity and supplier invoices into a close that explains the month and what remains open.", links: [
      { label: "Restaurant accounting & bookkeeping", href: "/restaurant-accounting-services" },
      { label: "Payables & vendor bills", href: "/restaurant-accounts-payable-services" },
      { label: "Tax & compliance support", href: "/restaurant-tax-services" },
    ] },
    { title: "Costs & decisions", shot: "cash", description: "Understand the change in cash or margin, then use the records and operating context to decide what to check next.", links: [
      { label: "Food cost & inventory", href: "/restaurant-food-cost-management" },
      { label: "Financial reporting, cash flow & CFO guidance", href: "/restaurant-cfo-services" },
      { label: "Restaurant turnaround consulting", href: "/restaurant-turnaround-consulting" },
    ] },
  ],
} as const;
