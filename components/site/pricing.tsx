import Link from "@/components/site/link";
import type { Tier } from "@/lib/content";
export function Pricing(_: { tiers: Tier[] }) {
 const factors = [
 { title: "Your locations", body: "One restaurant and a growing group need different reporting, coordination and review time." },
 { title: "Your working week", body: "Payroll cycles, team size, transaction volume and the systems you use shape the recurring work." },
 { title: "Your support", body: "Choose the accounting, payroll, cost review and financial guidance you want our team to handle." },
 ];
 return <><section className="pricing-demo" aria-labelledby="pricing-demo-title"><div><p className="eyebrow">Tailored pricing</p><h2 id="pricing-demo-title">Book a demo.<br />Get your own price.</h2><p>Your first demo is free. We’ll understand the work you need and prepare a quote with clear responsibilities and fees.</p></div><Link className="button" href="/book-a-review" data-cta>Book your free demo</Link></section><div className="pricing-factors">{factors.map(factor => <article key={factor.title}><h3>{factor.title}</h3><p>{factor.body}</p></article>)}</div><section className="fit-note"><h2>Know the scope before you start.</h2><p>Your proposal separates recurring work from cleanup, specialist advice and third-party costs. Any change to the service is agreed with you.</p></section></>;
}
