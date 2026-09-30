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
  title: "Restaurant Accounting & Payroll Services",
  description: "Restaurant bookkeeping, accounting, payroll preparation and CFO support from Ready Margin. Book a free demo to discuss the finance work you need covered.",
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
            <h1>The books. The payroll.<br /><span>Handled by Ready Margin.</span></h1>
          </div>
          <div className="home-opening-support">
            <p className="home-intro">A team to reconcile your accounts, prepare payroll inputs and review the costs behind your results. Choose the jobs you need covered, with reports and approvals agreed before we start.</p>
            <div className="home-actions"><Link className="button" href="/book-a-review" data-cta>Book your free demo</Link><a className="home-quiet-link" href="#workspace-preview">Explore the demo <span aria-hidden="true">↓</span></a></div>
          </div>
        </div>
        <ProductHero />
        <nav className="home-ledger" aria-label="Restaurant finance support"><Link href="/restaurant-accounting-services">Books &amp; close <span aria-hidden="true">↗</span></Link><Link href="/restaurant-payroll-services">Payroll &amp; tips <span aria-hidden="true">↗</span></Link><Link href="/restaurant-cfo-services">Costs &amp; cash <span aria-hidden="true">↗</span></Link></nav>
      </section>
      <section className="home-wrap home-panel home-tension" aria-labelledby="responsibility-title">
        <div className="home-section-heading"><div><p className="eyebrow">Recurring finance work</p><h2 id="responsibility-title">What we handle<br />each week and month.</h2></div><p>Bookkeeping, payroll preparation and financial review have different inputs and deadlines. We agree the jobs, collect the records and follow up with the people who can confirm them.</p></div>
        <div className="home-responsibility">
          <article><span className="home-index-number">01</span><h3>Prepare payroll inputs</h3><p>Check attendance and tip records. Obtain manager confirmation for missing punches and corrections before your approver reviews them.</p><Link href="/restaurant-payroll-services">Restaurant payroll preparation <span aria-hidden="true">↗</span></Link></article>
          <article><span className="home-index-number">02</span><h3>Maintain and close the books</h3><p>Record supplier bills, reconcile receipts and investigate unmatched transactions. Prepare the financial statements included in your service.</p><Link href="/restaurant-accounting-services">Restaurant accounting <span aria-hidden="true">↗</span></Link></article>
          <article><span className="home-index-number">03</span><h3>Review costs and cash</h3><p>Explain changes in the accounts and compare receipts with payment dates. Assess the financial options for decisions you need to make.</p><Link href="/restaurant-cfo-services">Restaurant CFO support <span aria-hidden="true">↗</span></Link></article>
        </div>
      </section>
      <ProductTour />
      <section id="the-work" className="home-wrap home-panel home-work">
        <div className="home-section-heading"><div><p className="eyebrow">Restaurant finance services</p><h2>Choose the jobs<br />you want covered.</h2></div><p>Start with a recurring task or a specific financial review. Your proposal lists the work, deliverables and responsibilities, including how we work with your existing providers.</p></div>
        <div className="home-service-index">{serviceGroups.map((service,index) => <section key={service.title}><span className="home-index-number">0{index+1}</span><h3>{service.title}</h3><p>{service.description}</p><ul>{service.links.map(link => <li key={link.href}><Link href={link.href}>{link.label}<span aria-hidden="true">↗</span></Link></li>)}</ul></section>)}</div>
        <div className="home-section-tail"><p>Combine services or begin with one defined job.</p><Link className="text-link" href="/restaurant-finance-services">Compare restaurant finance services</Link></div>
      </section>
      <section className="home-wrap home-panel home-cash" aria-labelledby="cash-title">
        <div className="home-cash-copy"><p className="eyebrow">Cash planning</p><h2 id="cash-title">What comes in.<br /><span>What is due next.</span></h2><p>A sales total does not tell you when the money reaches the bank. We review settlements, payroll and supplier commitments by date so your payment decisions use the available evidence.</p><Link className="button" href="/restaurant-cash-flow-management">Restaurant cash flow support</Link></div>
        <div className="home-product-cash"><span className="product-demo-label">Demo workspace / cash position</span><ProductShot shot="cash" /></div>
      </section>
      <section className="home-wrap home-panel home-proof" aria-labelledby="proof-title">
        <div className="home-section-heading"><div><p className="eyebrow">Responsibilities</p><h2 id="proof-title">Who prepares.<br />Who approves.</h2></div><p>We handle the agreed preparation and checks. Your managers confirm operating facts, and your nominated people authorize payroll, payments and business decisions.</p></div>
        <ol><li><span>01</span><h3>The written proposal</h3><p>Tasks, deliverables, fees and separate specialist work are identified before the engagement starts.</p><Link href="/pricing">Service pricing <span aria-hidden="true">↗</span></Link></li><li><span>02</span><h3>The review schedule</h3><p>Records have collection dates, reports have delivery dates and exceptions have a contact responsible for the answer.</p><Link href="/how-it-works">How the service starts <span aria-hidden="true">↗</span></Link></li><li><span>03</span><h3>The approval route</h3><p>The scope names which inputs we prepare and which person authorizes the next step.</p><Link href="/security">Record access and handling <span aria-hidden="true">↗</span></Link></li></ol>
      </section>
      <section className="home-wrap home-panel home-faq" aria-labelledby="faq-title"><div><p className="eyebrow">Before your demo</p><h2 id="faq-title">Questions about<br />the service.</h2></div><Faq items={c.faqs.slice(0,5)} /></section>
      <section className="home-wrap home-panel home-finish"><div><p className="eyebrow">Your first demo is free</p><h2>Show us the work<br /><span>you need covered.</span></h2></div><div className="home-finish-copy"><p>Bring your system names and one example. We’ll show the relevant process, answer your questions and discuss a proposal for your restaurant.</p><Link className="button" href="/book-a-review" data-cta>Book your free demo</Link></div></section>
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
          description: "Ready Margin provides managed restaurant bookkeeping, accounting, payroll preparation and financial review.",
          sameAs: c.settings.socials.filter(s => s.url).map(s => s.url),
          areaServed: [
            { "@type": "Country", name: "United States" },
            { "@type": "State", name: "New York" },
            { "@type": "City", name: "New York City" },
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
        { "@context": "https://schema.org", "@type": "WebPage", "@id": origin + "/#webpage", url: origin, name: "Restaurant Accounting & Payroll Services", isPartOf: { "@id": origin + "/#website" }, about: { "@id": origin + "/#organization" } },
        { "@context": "https://schema.org", "@type": "FAQPage", "@id": origin + "/#faq", mainEntity: c.faqs.slice(0,5).map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
      ]} />
    </main>
  );
}
