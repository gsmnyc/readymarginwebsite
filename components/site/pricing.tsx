import Link from "@/components/site/link";
export function Pricing() {
 const factors = [
 { title: "Locations and entities", body: "We assess the sites and legal entities covered, including location reporting and shared-cost treatment." },
 { title: "Recurring workload", body: "Transaction volume, payroll cycles, input quality and current systems affect the preparation and review required." },
 { title: "Selected services", body: "Choose recurring bookkeeping or payroll preparation, monthly accounting, a defined consulting project or CFO support." },
 ];
 return <><section className="pricing-demo" aria-labelledby="pricing-demo-title"><div><p className="eyebrow">Quoted after your free demo</p><h2 id="pricing-demo-title">How we calculate<br />your quote.</h2><p>We discuss the records, preparation and reviews your restaurant needs before quoting. Your written proposal names the deliverables, responsibilities and fees.</p></div><Link className="button" href="/book-a-review" data-cta>Book your free demo</Link></section><div className="pricing-factors">{factors.map(factor => <article key={factor.title}><h3>{factor.title}</h3><p>{factor.body}</p></article>)}</div><section className="fit-note"><h2>What is listed separately?</h2><p>Historic cleanup, specialist advice and third-party costs are identified separately from recurring service. Additional tasks or locations are agreed as scope changes.</p></section></>;
}
