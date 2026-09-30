"use client";
import { Tabs } from "radix-ui";
import { ProductShot } from "./product-shot";
import type { ProductShotId } from "@/content/product";
import Link from "@/components/site/link";

const views: { id: ProductShotId; label: string; description: string; href: string; service: string }[] = [
  { id: "overview", label: "Overview", description: "See open work, cash context and the week’s next actions together.", href: "/restaurant-finance-services", service: "Restaurant finance services" },
  { id: "schedule", label: "Schedule", description: "Review shifts, planned hours and base wages before the week starts.", href: "/restaurant-labor-cost-management", service: "Labor cost support" },
  { id: "attendance", label: "Attendance", description: "Find missing punches and get hours confirmed before payroll.", href: "/restaurant-payroll-services", service: "Restaurant payroll support" },
  { id: "tips", label: "Tickets & tips", description: "Trace held tips and unmatched checks to the answer still needed.", href: "/restaurant-tip-management", service: "Tip management support" },
  { id: "payroll", label: "Payroll", description: "Keep the pay period, review questions and payroll handoff in view.", href: "/restaurant-payroll-services", service: "Payroll preparation" },
  { id: "weeklyClose", label: "Weekly close", description: "Follow the review steps from attendance to the final approval.", href: "/how-it-works", service: "How the service works" },
  { id: "reconciliation", label: "Books", description: "Compare bank and books records; keep unexplained activity open.", href: "/restaurant-accounting-services", service: "Accounting & bookkeeping" },
  { id: "bills", label: "Bills", description: "Review recorded obligations, due dates and payment questions.", href: "/restaurant-accounts-payable-services", service: "Accounts payable support" },
  { id: "cash", label: "Cash position", description: "See observed balances alongside recorded commitments.", href: "/restaurant-cash-flow-management", service: "Cash flow support" },
];
export function ProductHero() {
  return <Tabs.Root id="workspace-preview" defaultValue="overview" className="product-hero">
    <div className="product-hero-toolbar"><div className="product-hero-heading"><span className="product-demo-label">Demo workspace · sample data</span><a href="#the-work">Explore all services <span aria-hidden="true">↓</span></a></div><Tabs.List aria-label="Product showcase">{views.map(view => <Tabs.Trigger key={view.id} value={view.id}>{view.label}</Tabs.Trigger>)}</Tabs.List></div>
    {views.map(view => <Tabs.Content key={view.id} value={view.id}><div className="product-hero-context"><p>{view.description}</p><Link href={view.href}>{view.service} <span aria-hidden="true">↗</span></Link></div><ProductShot shot={view.id} priority={view.id === "overview"} /></Tabs.Content>)}
  </Tabs.Root>;
}
