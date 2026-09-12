import Link from "@/components/site/link";
import { getContent, siteOrigin } from "@/lib/content";
import { metadataFor } from "@/lib/seo";
import { JsonLd } from "@/components/site/static";
import { Timeline } from "@/components/site/timeline";
import { Faq } from "@/components/site/faq";
import { OperatingDesk } from "@/components/site/operating-desk";
import { home } from "@/content/home";
import "./homepage.css";

export const generateMetadata = () => metadataFor({
  title: "Restaurant Finance Services: Accounting, Payroll, Tax & Operations",
  description: "Ready Margin is a managed restaurant finance and back-office partner for accounting, bookkeeping, payroll, tax and compliance workflows, reporting, cost control and CFO-level guidance.",
  path: "", indexable: true, kind: "home",
});

export default async function Home() {
  const c = await getContent();
  return (
    <main id="main" className="homepage">
      <section id="home-hero" tabIndex={-1} className="home-opening">
        <div className="home-wrap hero-grid">
          <div className="home-opening-copy">
            <p className="eyebrow">{home.eyebrow}</p>
            <h1>{home.headline[0]}<br /><span>{home.headline[1]}</span></h1>
            <p className="home-intro">{home.introduction}</p>
            <div className="home-actions">
              <Link className="button" href="/book-a-review" data-cta>{c.settings.cta}<span aria-hidden="true">↗</span></Link>
              <Link className="home-quiet-link" href="#the-work">See what we handle <span aria-hidden="true">↓</span></Link>
            </div>
          </div>
          <div className="home-week" aria-label="The work behind service">
            <div className="home-week-heading"><span className="eyebrow">Behind the service</span><span aria-hidden="true">↙</span></div>
            <p className="home-week-title">A restaurant runs<br />on more than service.</p>
            <dl>
              <div><dt>People & shifts</dt><dd>Hours. Tips.<br />Payroll cutoff.</dd></div>
              <div><dt>Books & cash</dt><dd>Supplier bills.<br />The close. Cash.</dd></div>
              <div><dt>Decisions & progress</dt><dd>Clear numbers.<br />A next step.</dd></div>
            </dl>
            <p className="home-week-bottom">The work behind it deserves a team.</p>
          </div>
        </div>
      </section>

      <div className="home-promise"><div className="home-wrap"><span>Clear numbers.</span><span>Accountable people.</span><span>Fewer financial surprises.</span></div></div>

      <section id="the-work" className="home-wrap home-work">
        <div className="home-section-heading">
          <div><p className="eyebrow">What comes off your desk</p><h2>Less chasing.<br />More restaurant.</h2></div>
          <p>A changed shift. A supplier bill. A report you’re still waiting for. We connect the recurring work so every question doesn’t end up back with you.</p>
        </div>
        <div className="home-service-index">
          {home.services.map((service, index) => <section key={service.title}>
            <span className="home-index-number" aria-hidden="true">0{index + 1}</span>
            <h3>{service.title}</h3><p>{service.description}</p>
            <ul>{service.links.map(link => <li key={link.href}><Link href={link.href}>{link.label}<span aria-hidden="true">↗</span></Link></li>)}</ul>
          </section>)}
        </div>
        <div className="home-section-tail"><p>Start with the work you need handled. Agree the scope together.</p><Link className="text-link" href="/restaurant-finance-services">Explore all restaurant finance services ↗</Link></div>
      </section>

      <section className="home-relationship">
        <div className="home-wrap">
          <div className="home-section-heading"><div><p className="eyebrow">How we earn our place</p><h2>The work gets handled.<br />The picture gets clear.</h2></div><p>Software gives you tools. We take responsibility for agreed work — with people to explain it and follow through.</p></div>
          <ol>{home.relationship.map((step, index) => <li key={step.title}><span className="eyebrow">0{index + 1}</span><h3>{step.title}<span aria-hidden="true">↗</span></h3><p>{step.body}</p></li>)}</ol>
          <Link className="text-link" href="/how-it-works">See how we work together ↗</Link>
        </div>
      </section>

      <div className="home-day home-wrap">
        <OperatingDesk chapters={c.settings.workingDay} />
        <noscript>{c.settings.workingDay.slice(1).map(chapter => <section className="home-noscript-chapter" key={chapter.phase}><h2>{chapter.heading}</h2><p>{chapter.action}</p><Link className="text-link" href={chapter.href}>{chapter.link} ↗</Link></section>)}</noscript>
      </div>

      <section className="home-wrap home-cadence">
        <div className="home-section-heading"><div><p className="eyebrow">The Ready Rhythm</p><h2>A better week.<br />Then the next one.</h2></div><p>The records come in. We check them, explain what changed and follow up on the decisions. Unfinished work stays on the list.</p></div>
        <Timeline steps={c.pages.find(p => p.kind === "rhythm")!.sections} />
        <Link className="text-link" href="/how-it-works/ready-rhythm">See the recurring service rhythm ↗</Link>
      </section>

      <section className="home-turnaround">
        <div className="home-wrap"><p className="eyebrow">Turnaround & financial guidance</p><div className="home-turnaround-layout"><h2>Busy tables.<br /><span>Tight margins?</span></h2><div><p>When sales aren’t turning into cash, start with the facts. We help establish the obligations, costs and operating pressures that need attention — then agree practical actions and keep the follow-up moving.</p><Link className="button" href="/restaurant-turnaround-consulting">Explore turnaround support <span aria-hidden="true">↗</span></Link><Link className="home-quiet-link" href="/solutions/restaurant-not-profitable">Why a busy restaurant can still lose money ↗</Link></div></div></div>
      </section>

      <section className="home-wrap home-about">
        <p className="eyebrow">Built from restaurant work</p>
        <div className="home-section-heading"><h2>We know what happens<br />after the last table.</h2><div><p>The changed shift. The tip question. The supplier bill that doesn’t look right. Ready Margin comes from hands-on restaurant operations and finance work.</p><p>From one location to a growing group, the starting point is your operation — and the work you need someone to own.</p><Link className="text-link" href="/about">Meet Ready Margin ↗</Link></div></div>
        <div className="home-context-links"><Link href="/who-we-help">Who we help ↗</Link><Link href="/multi-location-restaurant-finance">Multi-location restaurants ↗</Link><Link href="/new-york">New York restaurant support ↗</Link><Link href="/restaurant-finance-solutions">Find help by the problem ↗</Link></div>
      </section>

      <section className="home-wrap home-faq"><div><p className="eyebrow">Before we talk</p><h2>A few good<br />questions.</h2></div><Faq items={c.faqs.slice(0, 5)} /></section>

      <section className="home-finish"><div className="home-wrap"><p className="eyebrow">Start with your restaurant</p><h2>Make room<br />for the <span>good part.</span></h2><div><p>{c.settings.reviewOffer}</p><Link className="button" href="/book-a-review" data-cta>{c.settings.cta}<span aria-hidden="true">↗</span></Link><a className="text-link" href={"mailto:" + c.settings.email}>{c.settings.email}</a></div></div></section>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Organization", "@id": siteOrigin() + "/#organization",
        name: "Ready Margin", url: siteOrigin(), logo: siteOrigin() + "/brand/logo_horizontal_primary_transparent.svg", email: c.settings.email,
        description: "Managed restaurant finance, accounting, payroll, tax workflow and operations support",
        sameAs: c.settings.socials.filter(s => s.url).map(s => s.url),
        knowsAbout: ["Restaurant accounting", "Restaurant bookkeeping", "Restaurant payroll", "Restaurant tax and compliance workflows", "Restaurant cash flow", "Restaurant food cost", "Restaurant labor cost", "Restaurant profitability", "Restaurant turnaround consulting"],
      }} />
    </main>
  );
}
