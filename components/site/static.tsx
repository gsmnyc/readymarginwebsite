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
        <Image
          src="/brand/logo_symbol_primary_accent.svg"
          alt=""
          width={96}
          height={96}
          sizes="96px"
        />
        <p className="eyebrow">Tell us what keeps landing on your desk</p>
        <h2>{heading}</h2>
        <p>{settings.reviewOffer}</p>
        <Link className="button" href="/book-a-review" data-cta>
          {settings.cta}
          <span aria-hidden="true">↗</span>
        </Link>
        <a className="quiet-link" href={"mailto:" + settings.email}>
          {settings.email}
        </a>
      </div>
    </section>
  );
}
export function Footer({ content }: { content: Content }) {
  const groups = [
    ["The work", content.pages.filter((p) => p.kind === "capability")],
    [
      "The relationship",
      content.pages.filter((p) =>
        [
          "process",
          "rhythm",
          "implementation",
          "owner-view",
          "audience",
          "pricing",
          "comparison",
          "about",
          "platform",
        ].includes(p.kind),
      ),
    ],
    [
      "Useful reading",
      content.pages.filter((p) =>
        [
          "articles",
          "resources",
          "diagnostic",
          "cases",
          "guides",
          "checklists",
        ].includes(p.kind),
      ),
    ],
    [
      "More",
      content.pages.filter(
        (p) =>
          ["security", "legal", "search", "form", "campaign"].includes(
            p.kind,
          ) ||
          [
            "/integrations",
            "/partners",
            "/careers",
            "/resources/podcast",
            "/implementation",
            "/platform/how-the-work-connects",
          ].includes(p.path),
      ),
    ],
  ] as const;
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <Link href="/" aria-label="Ready Margin home">
            <Image
              src="/brand/logo_horizontal_primary_dark.svg"
              alt="Ready Margin"
              width={260}
              height={62}
              sizes="260px"
            />
          </Link>
          <p>
            Clear numbers.
            <br />
            Accountable people.
            <br />
            Fewer financial surprises.
          </p>
          <section
            className="footer-contact"
            aria-labelledby="footer-contact-title"
          >
            <h2 id="footer-contact-title">Contact us</h2>
            <a href={"mailto:" + content.settings.email}>
              {content.settings.email}
              <span aria-hidden="true">↗</span>
            </a>
            {content.settings.socials
              .filter((social) => social.url)
              .map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  rel="noopener noreferrer"
                >
                  {social.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            <Link href="/contact">
              Send an enquiry<span aria-hidden="true">↗</span>
            </Link>
          </section>
        </div>
        <div className="footer-grid">
          {groups.map(([name, pages]) => (
            <div key={name}>
              <h2>{name}</h2>
              {pages.map((p) => (
                <Link key={p.path} href={p.path}>
                  {p.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ready Margin</span>
          <CookieButton />
          {content.settings.credit.url ? (
            <a href={content.settings.credit.url}>
              {content.settings.credit.label}
            </a>
          ) : (
            <span>{content.settings.credit.label}</span>
          )}
        </div>
      </div>
    </footer>
  );
}
export function CapabilityGrid({ pages }: { pages: Page[] }) {
  return (
    <div className="capability-grid">
      {pages
        .filter((p) => p.kind === "capability")
        .map((p, i) => (
          <Link className="capability" href={p.path} key={p.path}>
            <div className="cap-top">
              <span>0{i + 1}</span>
              <Image
                src={"/icons/" + p.icon + ".svg"}
                alt=""
                width={48}
                height={48}
                sizes="48px"
              />
            </div>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
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
        <Image
          src="/brand/logo_symbol_primary_transparent.svg"
          alt=""
          width={40}
          height={40}
          sizes="40px"
        />
      </div>
      <p className="caption">
        Example weekly review · Friday, 11 September 2026, 10:00
      </p>
      <h3>
        A payroll question.
        <br />A clear next step.
      </h3>
      <dl>
        <div>
          <dt>What changed</dt>
          <dd>A recorded shift has an unconfirmed end time.</dd>
        </div>
        <div>
          <dt>Why it matters</dt>
          <dd>
            The hours need confirmation before the payroll approval cutoff.
          </dd>
        </div>
        <div>
          <dt>Recommended action</dt>
          <dd>
            Ask the shift manager to verify attendance against the schedule.
          </dd>
        </div>
        <div>
          <dt>Owner</dt>
          <dd>Restaurant manager → payroll approver</dd>
        </div>
      </dl>
      <div className="review-status">
        <span className="status-mark" /> Awaiting manager confirmation
      </div>
      <p className="caption">
        Illustrative review. No customer records or results.
      </p>
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
      <figcaption>
        Illustrative restaurant scene. Not staff or a client.
      </figcaption>
    </figure>
  );
}
export function Breadcrumbs({ page, pages }: { page: Page; pages: Page[] }) {
  const parts = page.path.split("/").filter(Boolean);
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {parts.map((x, i) => {
        const href = "/" + parts.slice(0, i + 1).join("/");
        const title =
          pages.find((p) => p.path === href)?.title || x.replaceAll("-", " ");
        return (
          <span key={href}>
            <span aria-hidden="true">/</span>
            {i === parts.length - 1 ? (
              <span aria-current="page">{title}</span>
            ) : pages.some((p) => p.path === href) ? (
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
      {page.sections.map((s, i) => (
        <section key={s.title} id={"section-" + i}>
          <span className="section-index">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
            {s.items.length > 0 && (
              <ul>
                {s.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
export function Related({ page, pages }: { page: Page; pages: Page[] }) {
  const links = [
    ...new Set([
      ...page.related,
      ...pages
        .filter(
          (p) =>
            p.published &&
            p.kind === "article" &&
            p.related.includes(page.path),
        )
        .map((p) => p.path),
    ]),
  ];
  if (!links.length) return null;
  return (
    <aside className="related">
      <p className="eyebrow">Keep exploring</p>
      {links.map((path) => (
        <Link key={path} href={path}>
          <span className="related-label">
            {pages.find((p) => p.path === path)?.title ||
              "Book a Restaurant Operations Review"}
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
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replaceAll("<", "\\u003c"),
      }}
    />
  );
}
