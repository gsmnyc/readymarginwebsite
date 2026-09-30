// One service directory for the homepage and navigation. These are service
// scopes; the product showcase only includes screens available in the demo.
export const serviceGroups: { title: string; description: string; links: { label: string; href: string }[] }[] = [
  { title: "Payroll & labor", description: "Review recorded hours, tip inputs and manager corrections. Compare labor costs with planned shifts and sales for the same period.", links: [
    { label: "Restaurant payroll", href: "/restaurant-payroll-services" },
    { label: "Tip management", href: "/restaurant-tip-management" },
    { label: "Labor cost management", href: "/restaurant-labor-cost-management" },
    { label: "Compliance workflows", href: "/restaurant-compliance-services" },
    { label: "Back-office support", href: "/restaurant-back-office-services" },
    { label: "Outsourced finance team", href: "/outsourced-restaurant-finance-team" },
  ] },
  { title: "Accounting & bills", description: "Record and reconcile transactions, maintain supplier bills and prepare the agreed monthly financial statements.", links: [
    { label: "Restaurant accounting", href: "/restaurant-accounting-services" },
    { label: "Restaurant bookkeeping", href: "/restaurant-bookkeeping-services" },
    { label: "Accounts payable", href: "/restaurant-accounts-payable-services" },
    { label: "Tax records & coordination", href: "/restaurant-tax-services" },
    { label: "Inventory & cost control", href: "/restaurant-inventory-cost-control" },
    { label: "Multi-location finance", href: "/multi-location-restaurant-finance" },
  ] },
  { title: "Cost & cash review", description: "Investigate cost movement, review payment timing and assess the financial options for a management decision.", links: [
    { label: "Cash flow management", href: "/restaurant-cash-flow-management" },
    { label: "Food cost management", href: "/restaurant-food-cost-management" },
    { label: "CFO & financial guidance", href: "/restaurant-cfo-services" },
    { label: "Financial consulting", href: "/restaurant-financial-consulting" },
    { label: "Profitability consulting", href: "/restaurant-profitability-consulting" },
    { label: "Turnaround consulting", href: "/restaurant-turnaround-consulting" },
  ] },
];
