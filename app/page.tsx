import Link from "@/components/site/link";
import { getContent, siteOrigin } from "@/lib/content";
import { metadataFor } from "@/lib/seo";
import { JsonLd } from "@/components/site/static";
import { Faq } from "@/components/site/faq";
import { ProductTour } from "@/components/product/product-tour";
import { ProductShot } from "@/components/product/product-shot";
import { ProductHero } from "@/components/product/product-hero";
import { serviceGroups } from "@/content/service-navigation";
import "./homepage.css";

export const generateMetadata = () => metadataFor({
  title: "Restaurant Finance and Back-Office Support",
  description: "Restaurant accounting, bookkeeping, payroll and CFO support from Ready Margin. Keep the finance work moving, understand your numbers and plan your next step.",
  path: "", indexable: true, kind: "home",
});

export default async function Home() {
  const c = await getContent();
  const origin = siteOrigin();
  return (
    <main id="main" tabIndex={-1} className="homepage">
      <section id="home-hero" className="home-opening">
        <div className="home-opening-copy">
          <div className="home-opening-heading">
            <p className="eyebrow">Restaurant accounting, bookkeeping &amp; payroll</p>
            <h1>Service is over.<br /><span>Payroll is due.</span></h1>
          </div>
          <div className="home-opening-support">
            <p className="home-intro">We check the hours, reconcile the books and keep supplier bills in order. You get the records, the explanation and a clear list of what needs your decision.</p>
            <div className="home-actions"><Link className="button" href="/book-a-review" data-cta>Book your free demo</Link><a className="home-quiet-link" href="#workspace-preview">See the work <span aria-hidden="true">↓</span></a></div>
          </div>
        </div>
        <ProductHero />
        <nav className="home-ledger" aria-label="Restaurant finance support"><Link href="/restaurant-accounting-services">Books &amp; close <span aria-hidden="true">↗</span></Link><Link href="/restaurant-payroll-services">Payroll &amp; tips <span aria-hidden="true">↗</span></Link><Link href="/restaurant-cfo-services">Costs &amp; cash <span aria-hidden="true">↗</span></Link></nav>
      </section>
      <section className="home-wrap home-panel home-tension" aria-labelledby="responsibility-title">
        <div className="home-section-heading"><div><p className="eyebrow">Built around the working week</p><h2 id="responsibility-title">A team for the work<br />that follows service.</h2></div><p>Hours need confirming. Bills need checking. The books need closing. We take responsibility for the finance work you want off your desk.</p></div>
        <div className="home-responsibility">
          <article><span className="home-index-number">01</span><h3>Before payroll</h3><p>Check hours, tips and corrections. Get outstanding questions to the manager who can answer them.</p><Link href="/restaurant-payroll-services">Payroll support <span aria-hidden="true">↗</span></Link></article>
          <article><span className="home-index-number">02</span><h3>Through the month</h3><p>Record bills, reconcile transactions and follow up on missing information before the close.</p><Link href="/restaurant-accounting-services">Accounting support <span aria-hidden="true">↗</span></Link></article>
          <article><span className="home-index-number">03</span><h3>At the review</h3><p>Explain the movement in costs and cash. Bring the decisions that need your attention into one conversation.</p><Link href="/restaurant-cfo-services">Financial guidance <span aria-hidden="true">↗</span></Link></article>
        </div>
      </section>
      <ProductTour />
      <section id="the-work" className="home-wrap home-panel home-work">
        <div className="home-section-heading"><div><p className="eyebrow">Choose your support</p><h2>The right work.<br />The right team.</h2></div><p>Start with bookkeeping, payroll or a specific financial question. We build the service around your locations, systems and priorities.</p></div>
        <div className="home-service-index">{serviceGroups.map((service,index) => <section key={service.title}><span className="home-index-number">0{index+1}</span><h3>{service.title}</h3><p>{service.description}</p><ul>{service.links.map(link => <li key={link.href}><Link href={link.href}>{link.label}<span aria-hidden="true">↗</span></Link></li>)}</ul></section>)}</div>
        <div className="home-section-tail"><p>One written scope. Clear responsibilities.</p><Link className="text-link" href="/restaurant-finance-services">See all services</Link></div>
      </section>
      <section className="home-wrap home-panel home-cash" aria-labelledby="cash-title">
        <div className="home-cash-copy"><p className="eyebrow">Cash &amp; decision support</p><h2 id="cash-title">See the balance.<br /><span>Understand the commitments.</span></h2><p>Payroll, supplier bills and timing all affect cash. We review the records together so you can see what is known, what needs checking and which decisions come first.</p><Link className="button" href="/restaurant-cfo-services">Explore financial guidance</Link></div>
        <div className="home-product-cash"><span className="product-demo-label">Demo workspace / cash position</span><ProductShot shot="cash" /></div>
      </section>
      <section className="home-wrap home-panel home-proof" aria-labelledby="proof-title">
        <div className="home-section-heading"><div><p className="eyebrow">How we work together</p><h2 id="proof-title">You know what’s covered.<br />You keep the decisions.</h2></div><p>Before we start, we agree the work, the people involved and the review schedule. You know what we handle and when we need an answer from you.</p></div>
        <ol><li><span>01</span><h3>A defined service</h3><p>Your proposal names the recurring work, fees and any specialist support.</p><Link href="/pricing">How pricing works <span aria-hidden="true">↗</span></Link></li><li><span>02</span><h3>A regular review</h3><p>We bring the records, findings and outstanding questions to an agreed review.</p><Link href="/how-it-works">See the process <span aria-hidden="true">↗</span></Link></li><li><span>03</span><h3>Your approval</h3><p>Your nominated people keep the defined payroll, payment and operating approvals.</p><Link href="/security">Data &amp; access <span aria-hidden="true">↗</span></Link></li></ol>
      </section>
      <section className="home-wrap home-panel home-faq" aria-labelledby="faq-title"><div><p className="eyebrow">Before your demo</p><h2 id="faq-title">A few things<br />to know.</h2></div><Faq items={c.faqs.slice(0,5)} /></section>
      <section className="home-wrap home-panel home-finish"><div><p className="eyebrow">Free demo. A price for your restaurant.</p><h2>Let’s put your<br /><span>finance work in order.</span></h2></div><div className="home-finish-copy"><p>Show us where you need help. We’ll walk you through the service and prepare a quote for the work you want handled.</p><Link className="button" href="/book-a-review" data-cta>Book your free demo</Link></div></section>
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "ItemList", name: "Restaurant finance services", itemListElement: serviceGroups.flatMap(group => group.links).map((link,index) => ({ "@type": "ListItem", position: index + 1, name: link.label, url: origin + link.href })) },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": origin + "/#organization",
          name: "Ready Margin",
          legalName: "Ready Margin Inc",
          alternateName: ["ReadyMargin"],
          url: origin,
          logo: origin + "/brand/logo_horizontal_primary_transparent.svg",
          email: c.settings.email,
          description: "Managed restaurant finance, accounting, bookkeeping, payroll, tax and compliance workflow, reporting, cost control and operations support.",
          sameAs: c.settings.socials.filter(s => s.url).map(s => s.url),
          areaServed: [
            { "@type": "Country", name: "United States" },
            { "@type": "State", name: "New York" },
            { "@type": "City", name: "New York City" },
          ],
          knowsAbout: [
            "Restaurant accounting", "Restaurant bookkeeping", "Restaurant payroll", "Restaurant tips",
            "Restaurant tax and compliance workflows", "Restaurant financial reporting", "Restaurant cash flow",
            "Restaurant food cost", "Restaurant inventory", "Restaurant labor cost", "Restaurant profitability",
            "Restaurant fractional CFO services", "Restaurant turnaround consulting", "Multi-location restaurant finance",
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": origin + "/#website",
          name: "Ready Margin",
          url: origin,
          publisher: { "@id": origin + "/#organization" },
          inLanguage: "en-US",
        },
      ]} />
    </main>
  );
}
