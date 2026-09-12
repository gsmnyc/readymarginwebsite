import Link from "@/components/site/link";
import { getContent, siteOrigin, summarizePage } from "@/lib/content";
import { metadataFor } from "@/lib/seo";
import { CTA, CapabilityGrid, ReviewCard, JsonLd } from "@/components/site/static";
import { ModelScene } from "@/components/site/model-scene";
import { Timeline } from "@/components/site/timeline";
import { Workstreams } from "@/components/site/workstreams";
import { CaseCarousel } from "@/components/site/case-carousel";
import { Faq } from "@/components/site/faq";
import { OperatingDesk } from "@/components/site/operating-desk";

export const generateMetadata = () =>
  metadataFor({
    title: "Restaurant Finance Services: Accounting, Payroll, Tax & Operations",
    description:
      "Ready Margin is a managed restaurant finance and back-office partner for accounting, bookkeeping, payroll, tax and compliance workflows, reporting, cost control and CFO-level guidance.",
    path: "",
    indexable: true,
    kind: "home",
  });

export default async function Home() {
  const c = await getContent();
  const experience = (
    <div className="split">
      <h2>
        We know what
        <br />
        happens after
        <br />
        the last table.
      </h2>
      <div>
        <p className="lead">Ready Margin comes from hands-on restaurant operations and finance work.</p>
        <p>
          The changed shift. The tip question. The supplier bill that doesn’t look right. The tax document that still needs an answer. We built our approach around the jobs that keep an owner at the desk long after service.
        </p>
        <Link className="text-link" href="/about">Why we started Ready Margin ↗</Link>
      </div>
    </div>
  );

  return (
    <main id="main">
      <section id="home-hero" tabIndex={-1} className="hero container editorial-hero">
        <div className="hero-topline">
          <span className="eyebrow">Managed restaurant financial operations</span>
          <span className="eyebrow">Clear numbers. Accountable people.</span>
        </div>
        <div className="hero-grid">
          <h1>{c.settings.hero}</h1>
          <div className="hero-support">
            <p>{c.settings.heroSupport}</p>
            <Link className="button" href="/book-a-review" data-cta>
              {c.settings.cta}<span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/restaurant-finance-services">See the finance work we handle ↘</Link>
          </div>
        </div>
        <div className="hero-foot">
          <span>The restaurant is the reason.</span>
          <span>We’ll take care of the work behind it.</span>
        </div>
      </section>

      <OperatingDesk chapters={c.settings.workingDay} />
      <noscript>
        <div className="container section">
          {c.settings.workingDay.slice(1).map((chapter) => (
            <section key={chapter.phase}>
              <p className="eyebrow">{chapter.phase}</p>
              <h2>{chapter.heading}</h2>
              <p>{chapter.action}</p>
              <Link className="text-link" href={chapter.href}>{chapter.link} ↗</Link>
            </section>
          ))}
        </div>
      </noscript>

      <section className="container section problem">
        <p className="eyebrow">01 / Sound familiar?</p>
        <div className="split">
          <h2>Service is over.<br />Your list isn’t.</h2>
          <div>
            <p className="lead">A missing clock-out. A bill to check. Payroll coming up. A tax deadline waiting on records. And somehow, every question ends up with you.</p>
            <p>You can have a great team and a busy restaurant and still spend your evenings chasing the details behind it.</p>
            <p>We take on the recurring finance and operating work you agree with us, then make time to explain what it means for the business.</p>
          </div>
        </div>
      </section>

      <section className="ink-section">
        <div className="container section">
          <div className="section-heading">
            <p className="eyebrow">02 / How we earn our place</p>
            <h2>Do the work.<br />Explain the numbers.<br />Stay for the follow-up.</h2>
          </div>
          <ModelScene />
          <Link className="text-link" href="/how-it-works">How the service works ↗</Link>
        </div>
      </section>

      <section className="container section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">03 / What comes off your desk</p>
            <h2>It all connects.<br />So should the support.</h2>
          </div>
          <p>A shift becomes payroll. A delivery becomes a bill. Those records become tax inputs, cash commitments and the numbers you use to run the restaurant. Choose the part you need help with.</p>
        </div>
        <Workstreams />
        <div className="scope-bar">
          <span>Managed restaurant finance</span>
          <p>Accounting, payroll, tax workflows, cost control, reporting and guidance — scoped around the work you actually need handled.</p>
          <Link href="/restaurant-finance-services">Explore restaurant finance services ↗</Link>
        </div>
        <CapabilityGrid pages={c.pages} />
        <div className="resource-links">
          <Link className="text-link" href="/restaurant-finance-solutions">Find support by the problem you need to solve ↗</Link>
          <Link className="text-link" href="/new-york">New York restaurant finance services ↗</Link>
        </div>
      </section>

      <section className="review-scene">
        <div className="container section split">
          <div>
            <p className="eyebrow">04 / An example from the working week</p>
            <h2>“What do you<br />need from me?”</h2>
            <p>A review should make that easy to answer. Here’s the issue, why it matters and the person who needs to act.</p>
            <Link className="text-link" href="/how-it-works/owner-view">Inside an owner review ↗</Link>
          </div>
          <ReviewCard />
        </div>
      </section>

      <section className="container section">
        <div className="split section-heading">
          <div>
            <p className="eyebrow">05 / The Ready Rhythm</p>
            <h2>Next week shouldn’t<br />start from scratch.</h2>
          </div>
          <p>The records come in. We check them, review the findings and follow up on what was agreed. Unfinished work stays on the list.</p>
        </div>
        <Timeline steps={c.pages.find((p) => p.kind === "rhythm")!.sections} />
        <Link className="text-link" href="/how-it-works/ready-rhythm">Follow the weekly rhythm ↗</Link>
      </section>

      <section className="container advisory-note" aria-labelledby="advisory-title">
        <p className="eyebrow">When the pressure needs a closer look</p>
        <h2 id="advisory-title">Busy restaurant.<br />Still no breathing room?</h2>
        <div>
          <p>Start with the cash, the bills coming due and the costs you can influence. Our turnaround work connects the financial facts to decisions, named responsibilities and follow-through.</p>
          <Link className="text-link" href="/restaurant-turnaround-consulting">Explore restaurant turnaround support ↗</Link>
        </div>
      </section>

      <section className="experience-section">
        <div className="container section">
          <p className="eyebrow">06 / Built from doing the work</p>
          {[...new Set([...c.settings.proofOrder, "experience", "workflow"])].map((item) =>
            item === "experience" ? (
              <div key={item}>{experience}</div>
            ) : item === "workflow" ? (
              <CaseCarousel key={item} pages={c.pages.filter((p) => p.kind === "case").map(summarizePage)} />
            ) : null,
          )}
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <p className="eyebrow">07 / Your restaurant, your starting point</p>
          <h2>One location or several.<br />The work still needs doing.</h2>
        </div>
        <div className="audience-grid">
          {c.pages.filter((p) => p.kind === "audience").map((p, i) => (
            <Link href={p.path} key={p.path}>
              <span className="eyebrow">0{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <span className="text-link">See how we can help ↗</span>
            </Link>
          ))}
        </div>
        <div className="fit-note">
          <h3>You keep the decisions.</h3>
          <p>We need your team’s records and an approver who stays involved. In return, you know which jobs we handle, what you’ll receive and when we’ll review it together.</p>
        </div>
      </section>

      <section className="container section future-section">
        <p className="eyebrow">08 / Today and what comes next</p>
        <div className="split">
          <div>
            <span className="status-pill">Available today</span>
            <h2>People doing<br />the work.</h2>
            <p>Managed accounting, bookkeeping, payroll, tax and compliance workflows, reporting, cost control and financial guidance — with time to talk through the numbers.</p>
            <Link href="/restaurant-finance-services" className="text-link">Explore the services ↗</Link>
          </div>
          <div>
            <span className="status-pill">In development / future direction</span>
            <h2>Tools built<br />around it.</h2>
            <p>Dashboards, workbenches and deeper connections are part of our future direction. They are not released products, and no launch date has been announced.</p>
            <Link href="/platform" className="text-link">Where we’re heading ↗</Link>
          </div>
        </div>
      </section>

      <section className="container section faq-section">
        <div>
          <p className="eyebrow">Before we talk</p>
          <h2>You might<br />be wondering.</h2>
        </div>
        <Faq items={c.faqs} />
      </section>

      <CTA settings={c.settings} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": siteOrigin() + "/#organization",
        name: "Ready Margin",
        url: siteOrigin(),
        logo: siteOrigin() + "/brand/logo_horizontal_primary_transparent.svg",
        email: c.settings.email,
        description: "Managed restaurant finance, accounting, payroll, tax workflow and operations support",
        sameAs: c.settings.socials.filter((s) => s.url).map((s) => s.url),
        knowsAbout: [
          "Restaurant accounting",
          "Restaurant bookkeeping",
          "Restaurant payroll",
          "Restaurant tax and compliance workflows",
          "Restaurant cash flow",
          "Restaurant food cost",
          "Restaurant labor cost",
          "Restaurant profitability",
          "Restaurant turnaround consulting",
        ],
      }} />
    </main>
  );
}
