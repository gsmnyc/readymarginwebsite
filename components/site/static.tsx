import Link from "@/components/site/link";
import Image from "next/image";

import type { Content, Page, Settings } from "@/lib/content";
import { CookieButton } from "./shell";
import { HomeLink } from "./home-link";
import { Check, Clock3 } from "lucide-react";

export function CTA({
  settings,
  heading = "See what we can handle for you.",
}: {
  settings: Settings;
  heading?: string;
}) {
  return (
    <section className="cta-section">
      <div className="container cta-inner">
        <Image src="/brand/logo_symbol_primary_accent.svg" alt="" width={96} height={96} sizes="96px" />
        <p className="eyebrow">Your first demo is free</p>
        <h2>{heading}</h2>
        <p>{settings.reviewOffer}</p>
        <Link className="button" href="/book-a-review" data-cta>
          {settings.cta}<span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}

export function Footer({ content }: { content: Content }) {
  const [emailName, emailDomain] = content.settings.email.split("@");
  const groups = [
    { title: "Services", links: [["Accounting & books", "/restaurant-accounting-services"], ["Payroll & tips", "/restaurant-payroll-services"], ["Costs & cash", "/restaurant-cfo-services"], ["All services", "/restaurant-finance-services"]] },
    { title: "Explore", links: [["How it works", "/how-it-works"], ["Pricing", "/pricing"], ["About us", "/about"], ["Insights", "/insights"]] },
  ];
  return <footer className="footer">
    <div className="footer-topline"><span>Restaurant finance. Taken care of.</span><a href="#main">Back to top <span aria-hidden="true">↑</span></a></div>
    <div className="footer-surface">
      <div className="footer-upper">
        <div className="footer-invitation"><span className="footer-label">Ready when you are</span><h2>The work.<br />The follow-through.</h2><Link className="footer-demo" href="/book-a-review" data-cta>Book your free demo <span aria-hidden="true">↗</span></Link></div>
        <div className="footer-navigation">{groups.map(group => <nav key={group.title} aria-label={group.title + " footer links"}><h2 className="footer-label">{group.title}</h2>{group.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>)}</div>
        <div className="footer-reach"><span className="footer-label">Contact us</span><a className="footer-email" href={"mailto:" + content.settings.email}>{emailName}@<wbr />{emailDomain}</a><p>Tell us about your restaurant.</p><div className="footer-socials">{content.settings.socials.filter(social => social.url).map(social => <a key={social.label} href={social.url} rel="noopener noreferrer">{social.label} <span aria-hidden="true">↗</span></a>)}</div></div>
      </div>
      <div className="footer-brand-ending">
        <div className="footer-stickers" aria-hidden="true"><span><Check strokeWidth={1.6} /><b>Work<br />accounted<br />for</b></span><span><Clock3 strokeWidth={1.4} /><b>Ready for<br />next week</b></span></div>
        <HomeLink className="footer-large-logo" aria-label="Ready Margin home"><Image src="/brand/logo_horizontal_primary_transparent.svg" alt="Ready Margin" width={508} height={120} sizes="(max-width: 767px) 90vw, 1400px" /></HomeLink>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Ready Margin Inc</span><div><Link href="/legal/privacy">Privacy</Link><Link href="/legal/terms">Terms</Link><Link href="/legal/accessibility">Accessibility</Link><CookieButton /></div></div>
    </div>
  </footer>;
}

export function CapabilityGrid({ pages }: { pages: Page[] }) {
  return (
    <div className="capability-grid">
      {pages.filter((page) => page.kind === "service" && !page.path.startsWith("/new-york/")).map((page, index) => (
        <Link className="capability" href={page.path} key={page.path}>
          <div className="cap-top">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <Image src={"/icons/" + page.icon + ".svg"} alt="" width={48} height={48} sizes="48px" />
          </div>
          <h3>{page.title}</h3>
          <p>{page.description}</p>
          <div className="cap-bottom">
            <span>Explore the scope</span>
            <span aria-hidden="true">↗</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ReviewCard() {
  return (
    <article className="review-card">
      <div className="review-top">
        <span className="eyebrow">Illustrative example</span>
        <Image src="/brand/logo_symbol_primary_transparent.svg" alt="" width={40} height={40} sizes="40px" />
      </div>
      <p className="caption">Example weekly review · Friday, 11 September 2026, 10:00</p>
      <h3>A payroll question.<br />A clear next step.</h3>
      <dl>
        <div><dt>What changed</dt><dd>A recorded shift has an unconfirmed end time.</dd></div>
        <div><dt>Why it matters</dt><dd>The hours need confirmation before the payroll approval cutoff.</dd></div>
        <div><dt>Recommended action</dt><dd>Ask the shift manager to verify attendance against the schedule.</dd></div>
        <div><dt>Owner</dt><dd>Restaurant manager → payroll approver</dd></div>
      </dl>
      <div className="review-status"><span className="status-mark" /> Awaiting manager confirmation</div>
      <p className="caption">Illustrative review. No customer records or results.</p>
    </article>
  );
}

export function OperatorImage() {
  return (
    <section className="operator-statement" aria-label="Our approach"><h2>The numbers.<br />The people.<br />The restaurant.</h2><p>Restaurant finance only makes sense when you understand the work behind it. We bring the records and the operating context into the same conversation, then agree who does what next.</p></section>
  );
}

export function Breadcrumbs({ page, pages }: { page: Page; pages: Page[] }) {
  const parts = page.path.split("/").filter(Boolean);
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {parts.map((part, index) => {
        const href = "/" + parts.slice(0, index + 1).join("/");
        const title = pages.find((candidate) => candidate.path === href)?.title || part.replaceAll("-", " ");
        return (
          <span key={href}>
            <span aria-hidden="true">/</span>
            {index === parts.length - 1 ? (
              <span aria-current="page">{title}</span>
            ) : pages.some((candidate) => candidate.path === href) ? (
              <Link href={href}>{title}</Link>
            ) : (
              <span>{title}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function SectionCopy({ page }: { page: Page }) {
  return (
    <div className="section-copy">
      {page.sections.map((section, index) => (
        <section key={section.title} id={"section-" + index}>
          <span className="section-index">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
            {section.items.length > 0 && (
              <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

export function Related({ page, pages }: { page: Page; pages: Page[] }) {
  const localHubLinks = page.path === "/new-york"
    ? pages
        .filter((candidate) => candidate.published && candidate.indexable && candidate.kind === "service" && candidate.path.startsWith("/new-york/"))
        .map((candidate) => candidate.path)
    : [];
  const links = [
    ...new Set([
      ...page.related,
      ...localHubLinks,
      ...pages
        .filter((candidate) => candidate.published && candidate.kind === "article" && candidate.related.includes(page.path))
        .map((candidate) => candidate.path),
    ]),
  ];
  const knownLinks = links.filter(path => pages.some(candidate => candidate.path === path));
  if (!knownLinks.length) return null;
  return (
    <aside className="related">
      <p className="eyebrow">Keep exploring</p>
      {knownLinks.map((path) => (
        <Link key={path} href={path}>
          <span className="related-label">
            {pages.find((candidate) => candidate.path === path)?.title || "Book your free demo"}
          </span>
          <span aria-hidden="true">↗</span>
        </Link>
      ))}
    </aside>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll("<", "\\u003c") }}
    />
  );
}
