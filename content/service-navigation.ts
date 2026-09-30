// One service directory for the homepage and navigation. These are service
// scopes; the product showcase only includes screens available in the demo.
export const serviceGroups: { title: string; description: string; links: { label: string; href: string }[] }[] = [
  { title: "People & payroll", description: "Prepare hours and tips for approval. Review staffing costs against the shifts and sales that produced them.", links: [
    { label: "Restaurant payroll", href: "/restaurant-payroll-services" },
    { label: "Tip management", href: "/restaurant-tip-management" },
    { label: "Labor cost management", href: "/restaurant-labor-cost-management" },
    { label: "Compliance workflows", href: "/restaurant-compliance-services" },
    { label: "Back-office support", href: "/restaurant-back-office-services" },
    { label: "An outsourced finance team", href: "/outsourced-restaurant-finance-team" },
  ] },
  { title: "Books & bills", description: "Keep transactions current, check supplier invoices and close the accounts with the records ready for review.", links: [
    { label: "Restaurant accounting", href: "/restaurant-accounting-services" },
    { label: "Restaurant bookkeeping", href: "/restaurant-bookkeeping-services" },
    { label: "Accounts payable", href: "/restaurant-accounts-payable-services" },
    { label: "Tax record & adviser support", href: "/restaurant-tax-services" },
    { label: "Inventory & cost control", href: "/restaurant-inventory-cost-control" },
    { label: "Multi-location finance", href: "/multi-location-restaurant-finance" },
  ] },
  { title: "Costs & decisions", description: "Understand cash commitments, investigate cost changes and work through the decisions affecting your restaurant’s margin.", links: [
    { label: "Cash flow management", href: "/restaurant-cash-flow-management" },
    { label: "Food cost management", href: "/restaurant-food-cost-management" },
    { label: "CFO & financial guidance", href: "/restaurant-cfo-services" },
    { label: "Financial consulting", href: "/restaurant-financial-consulting" },
    { label: "Profitability consulting", href: "/restaurant-profitability-consulting" },
    { label: "Turnaround consulting", href: "/restaurant-turnaround-consulting" },
  ] },
];
