// Homepage copy. Detailed scope and search content remain in the JSON page collections.
export const home = {
  eyebrow: "Restaurant finance, run for you",
  headline: ["Back to the", "good part."],
  introduction: "Ready Margin is a managed restaurant finance and back-office partner. We handle agreed accounting, bookkeeping, payroll, tips, reporting, tax and compliance workflows, cost control and financial follow-up — then help you understand what the numbers mean.",
  services: [
    { title: "People & shifts", description: "The hours, corrections and approvals behind dependable restaurant payroll, tips and labor reporting.", links: [
      { label: "Restaurant payroll & tips", href: "/restaurant-payroll-services" },
      { label: "Labor cost & scheduling workflows", href: "/restaurant-labor-cost-management" },
    ] },
    { title: "Books & cash", description: "Restaurant accounting, bookkeeping, supplier bills, reconciliations and close work that make the financial picture useful.", links: [
      { label: "Restaurant accounting & bookkeeping", href: "/restaurant-accounting-services" },
      { label: "Payables & vendor bills", href: "/restaurant-accounts-payable-services" },
      { label: "Tax & compliance support", href: "/restaurant-tax-services" },
    ] },
    { title: "Decisions & progress", description: "Financial reporting, food cost, cash flow and CFO-level guidance connected to what happens on the floor.", links: [
      { label: "Food cost & inventory", href: "/restaurant-food-cost-management" },
      { label: "Financial reporting, cash flow & CFO guidance", href: "/restaurant-cfo-services" },
      { label: "Restaurant turnaround consulting", href: "/restaurant-turnaround-consulting" },
    ] },
  ],
} as const;
