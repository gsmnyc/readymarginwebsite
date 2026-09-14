import Link from "@/components/site/link";
import Image from "next/image";
import { getContent, siteOrigin } from "@/lib/content";
import { metadataFor } from "@/lib/seo";
import { JsonLd } from "@/components/site/static";
import { Faq } from "@/components/site/faq";
import { RestaurantIllustration, CashPressureIllustration } from "@/components/home/restaurant-illustration";
import { OperatingStory } from "@/components/home/operating-story";
import { home } from "@/content/home";
import "./homepage.css";

export const generateMetadata = () => metadataFor({
  title: "Managed Restaurant Finance Services",
  description: "Ready Margin handles restaurant accounting, bookkeeping, payroll, reporting and back-office finance, with accountable people who explain what comes next.",
  path: "", indexable: true, kind: "home",
});

export default async function Home() {
  const c = await getContent();
  const origin = siteOrigin();
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
          <figure className="home-restaurant-photo">
            <Image src="/brand/restaurant-pass.webp" alt="Illustrative restaurant kitchen pass with plates ready for service and order tickets" width={1536} height={1024} sizes="(max-width: 1199px) 100vw, 55vw" preload />
            <figcaption><strong>The restaurant is the reason.</strong></figcaption>
          </figure>
        </div>
      </section>

      <div className="home-bridge"><div className="home-wrap"><p>You didn’t open a restaurant<br />to chase <span>supplier bills.</span></p><p>Or missed punches. Or a deposit that doesn’t match.<br />That’s where we come in.</p></div></div>

      <section id="the-work" className="home-wrap home-work">
        <div className="home-section-heading">
          <div><p className="eyebrow">What comes off your desk</p><h2>Restaurant finance.<br />Without the chasing.</h2></div>
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

      <OperatingStory />

      <section className="home-turnaround">
        <div className="home-wrap"><p className="eyebrow">When the question is bigger</p><div className="home-turnaround-layout"><div><h2>Busy tables.<br /><span>Tight margins?</span></h2><CashPressureIllustration /></div><div><h3>Start with the facts.<br />Then decide what needs to change.</h3><p>When sales aren’t turning into cash, we help establish the obligations, costs and operating pressures that need attention. Then we agree practical actions and keep the follow-up moving.</p><Link className="button" href="/restaurant-turnaround-consulting">Explore turnaround support <span aria-hidden="true">↗</span></Link><Link className="home-quiet-link" href="/solutions/restaurant-not-profitable">Why a busy restaurant can still lose money</Link></div></div></div>
      </section>

      <section className="home-wrap home-about">
        <RestaurantIllustration />
        <div className="home-about-copy">
        <p className="eyebrow">Built from restaurant work</p>
        <div className="home-section-heading"><h2>We know what happens<br />after the last table.</h2><div><p>The changed shift. The tip question. The supplier bill that doesn’t look right. Ready Margin comes from hands-on restaurant operations and finance work.</p><p>From one location to a growing group, the starting point is your operation — and the work you need someone to own.</p><Link className="text-link" href="/about">Meet Ready Margin ↗</Link></div></div>
        <div className="home-context-links"><Link href="/who-we-help">Who we help ↗</Link><Link href="/multi-location-restaurant-finance">Multi-location restaurants ↗</Link><Link href="/new-york">New York & NYC restaurant support ↗</Link><Link href="/restaurant-finance-solutions">Find help by the problem ↗</Link></div>
        </div>
      </section>

      <section className="home-wrap home-faq"><div><p className="eyebrow">Before we talk</p><h2>A few good<br />questions.</h2></div><Faq items={c.faqs.slice(0, 5)} /></section>

      <section className="home-finish"><div className="home-wrap"><p className="eyebrow">Start with your restaurant</p><h2>Make room<br />for the <span>good part.</span></h2><div><p>{c.settings.reviewOffer}</p><Link className="button" href="/book-a-review" data-cta>{c.settings.cta}<span aria-hidden="true">↗</span></Link><a className="text-link" href={"mailto:" + c.settings.email}>{c.settings.email}</a></div></div></section>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": origin + "/#organization",
          name: "Ready Margin",
          legalName: "Bancroft and Co ltd",
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
            "Restaurant accounting",
            "Restaurant bookkeeping",
            "Restaurant payroll",
            "Restaurant tips",
            "Restaurant tax and compliance workflows",
            "Restaurant financial reporting",
            "Restaurant cash flow",
            "Restaurant food cost",
            "Restaurant inventory",
            "Restaurant labor cost",
            "Restaurant profitability",
            "Restaurant fractional CFO services",
            "Restaurant turnaround consulting",
            "Multi-location restaurant finance",
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
