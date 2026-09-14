import Link from "@/components/site/link";
import Image from "next/image";

import type { Content, Page, Settings } from "@/lib/content";
import { CookieButton } from "./shell";

export function CTA({
  settings,
  heading = "Let’s get you out of the back office.",
}: {
  settings: Settings;
  heading?: string;
}) {
  return (
    <section className="cta-section">
      <div className="container cta-inner">
        <Image src="/brand/logo_symbol_primary_accent.svg" alt="" width={96} height={96} sizes="96px" />
        <p className="eyebrow">Tell us what keeps landing on your desk</p>
        <h2>{heading}</h2>
        <p>{settings.reviewOffer}</p>
        <Link className="button" href="/book-a-review" data-cta>
          {settings.cta}<span aria-hidden="true">↗</span>
        </Link>
        <a className="quiet-link" href={"mailto:" + settings.email}>{settings.email}</a>
      </div>
    </section>
  );
}

export function Footer({ content }: { content: Content }) {
  const byPath = (paths: string[]) =>
    paths.map((path) => content.pages.find((page) => page.path === path)).filter(Boolean) as Page[];

  const groups = [
    [
      "Services",
      byPath([
        "/restaurant-finance-services",
        "/restaurant-accounting-services",
        "/restaurant-bookkeeping-services",
        "/restaurant-payroll-services",
        "/restaurant-tax-services",
        "/restaurant-cfo-services",
        "/restaurant-turnaround-consulting",
        "/restaurant-back-office-services",
        "/multi-location-restaurant-finance",
        "/new-york/restaurant-finance-solutions",
        "/new-york/restaurant-accounting-payroll-services",
        "/new-york/restaurant-financial-reporting-services",
      ]),
    ],
    [
      "Problems we solve",
      byPath([
        "/restaurant-finance-solutions",
        "/solutions/restaurant-books-behind",
        "/solutions/restaurant-payroll-problems",
        "/solutions/restaurant-cash-flow-problems",
        "/solutions/restaurant-food-cost-too-high",
        "/solutions/restaurant-labor-cost-too-high",
        "/solutions/restaurant-not-profitable",
        "/solutions/restaurant-tax-compliance",
      ]),
    ],
    [
      "Useful reading",
      [
        ...byPath(["/insights", "/resources", "/margin-clarity-check", "/case-studies"]),
        ...content.pages.filter((page) => page.kind === "article").slice(0, 6),
      ].filter((page, index, all) => all.findIndex((candidate) => candidate.path === page.path) === index),
    ],
    [
      "Company",
      byPath([
        "/how-it-works",
        "/who-we-help",
        "/pricing",
        "/about",
        "/new-york",
        "/security",
        "/contact",
        "/search",
      ]),
    ],
  ] as const;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <Link href="/" aria-label="Ready Margin home">
            <Image src="/brand/logo_horizontal_primary_dark.svg" alt="Ready Margin" width={260} height={62} sizes="260px" />
          </Link>
          <p>
            Clear numbers.<br />
            Accountable people.<br />
            Fewer financial surprises.
          </p>
          <section className="footer-contact" aria-labelledby="footer-contact-title">
            <h2 id="footer-contact-title">Contact us</h2>
            <a href={"mailto:" + content.settings.email}>
              {content.settings.email}<span aria-hidden="true">↗</span>
            </a>
            {content.settings.socials.filter((social) => social.url).map((social) => (
              <a key={social.label} href={social.url} rel="noopener noreferrer">
                {social.label}<span aria-hidden="true">↗</span>
              </a>
            ))}
            <Link href="/contact">Send an enquiry<span aria-hidden="true">↗</span></Link>
          </section>
        </div>

        <div className="footer-grid">
          {groups.map(([name, pages]) => (
            <div key={name}>
              <h2>{name}</h2>
              {pages.map((page) => (
                <Link key={page.path} href={page.path}>{page.title}</Link>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ready Margin Inc</span>
          <CookieButton />
        </div>
      </div>
    </footer>
  );
}

export function CapabilityGrid({ pages }: { pages: Page[] }) {
  return (
    <div className="capability-grid">
      {pages.filter((page) => page.kind === "capability").map((page, index) => (
        <Link className="capability" href={page.path} key={page.path}>
          <div className="cap-top">
            <span>0{index + 1}</span>
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

export function OperatorImage({ priority = false }: { priority?: boolean }) {
  return (
    <figure className="operator-photo">
      <Image
        src="/brand/restaurant-team.webp"
        alt="Illustrative restaurant operators reviewing a clipboard together before service"
        width={1536}
        height={1024}
        sizes="(max-width: 767px) 100vw, (max-width: 1600px) 70vw, 1300px"
        priority={priority}
      />
      <figcaption>Illustrative restaurant scene. Not staff or a client.</figcaption>
    </figure>
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
  if (!links.length) return null;
  return (
    <aside className="related">
      <p className="eyebrow">Keep exploring</p>
      {links.map((path) => (
        <Link key={path} href={path}>
          <span className="related-label">
            {pages.find((candidate) => candidate.path === path)?.title || "Book a Restaurant Operations Review"}
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
