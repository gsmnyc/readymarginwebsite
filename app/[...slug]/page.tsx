import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "@/components/site/link";
import { getContent, summarizePage } from "@/lib/content";
import { metadataFor, pageSchemaData } from "@/lib/seo";
import {
  Breadcrumbs,
  CTA,
  CapabilityGrid,
  SectionCopy,
  Related,
  ReviewCard,
  OperatorImage,
  JsonLd,
} from "@/components/site/static";

const Timeline = dynamic(() =>
  import("@/components/site/timeline").then((module) => module.Timeline),
);
const Workstreams = dynamic(() =>
  import("@/components/site/workstreams").then((module) => module.Workstreams),
);
const ArticleGrid = dynamic(() =>
  import("@/components/site/article-grid").then((module) => module.ArticleGrid),
);
const ClarityCheck = dynamic(() =>
  import("@/components/site/clarity-check").then((module) => module.ClarityCheck),
);
const LeadForm = dynamic(() =>
  import("@/components/site/lead-form").then((module) => module.LeadForm),
);
const Pricing = dynamic(() =>
  import("@/components/site/pricing").then((module) => module.Pricing),
);
const CaseCarousel = dynamic(() =>
  import("@/components/site/case-carousel").then((module) => module.CaseCarousel),
);
const Faq = dynamic(() =>
  import("@/components/site/faq").then((module) => module.Faq),
);

type Props = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  const c = await getContent();
  return c.pages.map((p) => ({ slug: p.path.slice(1).split("/") }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const c = await getContent();
  const p = c.pages.find((p) => p.path === "/" + slug.join("/"));
  return p
    ? metadataFor(p)
    : { title: "Page not found", robots: { index: false } };
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const c = await getContent();
  const p = c.pages.find((p) => p.path === "/" + slug.join("/"));
  if (!p) notFound();
  const list = [
    "articles",
    "guides",
    "checklists",
    "resources",
    "search",
  ].includes(p.kind);
  return (
    <main id="main" className={"page page-" + p.kind}>
      <section className="container page-hero">
        <Breadcrumbs page={p} pages={c.pages} />
        <div className="page-hero-grid">
          <div>
            <p className="eyebrow">
              {p.status ||
                p.category ||
                "The work behind service / Ready Margin"}
            </p>
            <h1>{p.heading}</h1>
          </div>
          <div className="page-intro">
            <p>{p.description}</p>
            {!["form", "legal", "thanks", "search"].includes(p.kind) && (
              <Link className="text-link" href="/book-a-review" data-cta>
                {c.settings.cta} ↗
              </Link>
            )}
            {p.kind === "article" && (
              <p className="caption">
                {p.author}
                <br />
                Published {p.publishedAt || p.updated}
                {p.publishedAt && p.publishedAt !== p.updated && (
                  <>
                    <br />
                    Updated {p.updated}
                  </>
                )}
                <br />
                General operating guidance
              </p>
            )}
          </div>
        </div>
      </section>
      <div className="container page-body">
        {p.answer && (
          <section className="fit-note" aria-labelledby="answer-title">
            <h2 id="answer-title">At a glance</h2>
            <p>{p.answer}</p>
          </section>
        )}
        {p.disclosure && (
          <section className="fit-note" aria-labelledby="disclosure-title">
            <h2 id="disclosure-title">About this guide</h2>
            <p>{p.disclosure}</p>
          </section>
        )}
        {p.kind === "capability-index" && <CapabilityGrid pages={c.pages} />}{" "}
        {p.kind === "audience-index" && (
          <div className="audience-grid">
            {c.pages
              .filter((q) => q.kind === "audience")
              .map((q) => (
                <Link href={q.path} key={q.path}>
                  <h2>{q.title}</h2>
                  <p>{q.description}</p>
                  <span className="text-link">Explore the fit ↗</span>
                </Link>
              ))}
          </div>
        )}
        {p.kind === "rhythm" && <Timeline steps={p.sections} pinned />}
        {["process", "workstreams", "platform"].includes(p.kind) && (
          <Workstreams />
        )}
        {p.kind === "pricing" && <Pricing tiers={c.tiers} />}{" "}
        {p.kind === "owner-view" && (
          <div className="owner-stage">
            <ReviewCard />
          </div>
        )}
        {p.kind === "about" && <OperatorImage />}
        {p.kind === "cases" && (
          <CaseCarousel
            pages={c.pages.filter((q) => q.kind === "case").map(summarizePage)}
          />
        )}{" "}
        {list && (
          <ArticleGrid
            pages={c.pages
              .filter(
                (q) =>
                  q.indexable && (p.kind === "search" || q.kind === "article"),
              )
              .map(summarizePage)}
            all={p.kind === "search"}
            kind={p.kind}
          />
        )}{" "}
        {p.kind === "diagnostic" && <ClarityCheck />}
        {p.kind === "form" ? (
          <div className="form-layout">
            <LeadForm settings={c.settings} />
            <SectionCopy page={p} />
          </div>
        ) : (
          p.kind !== "rhythm" && (
            <div
              className={
                "body-grid " + (p.kind === "article" ? "article-layout" : "")
              }
            >
              <SectionCopy page={p} />
              <Related page={p} pages={c.pages} />
            </div>
          )
        )}
        {p.resources.length > 0 && (
          <section className="section" aria-labelledby="official-resources-title">
            <p className="eyebrow">Primary sources</p>
            <h2 id="official-resources-title">Official resources</h2>
            <div className="resource-links">
              {p.resources.map((resource) => (
                <a
                  key={resource.url}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {resource.label} ↗
                </a>
              ))}
            </div>
          </section>
        )}
        {p.kind === "download" && (
          <a
            className="button"
            href="/downloads/restaurant-review-checklist.txt"
            download
          >
            Download the preparation checklist ↓
          </a>
        )}
        {p.kind === "thanks" && (
          <Link
            className="button"
            href="/resources/review-preparation-checklist"
          >
            Get the preparation checklist ↗
          </Link>
        )}
        {["capability", "pricing", "process"].includes(p.kind) && (
          <section className="section faq-section">
            <h2>Before you decide.</h2>
            <Faq items={c.faqs.slice(0, 3)} />
          </section>
        )}
        {p.kind === "resources" && (
          <div className="resource-links">
            {c.pages
              .filter(
                (q) =>
                  q.path.startsWith("/resources/") &&
                  q.path.split("/").length === 3,
              )
              .map((q) => (
                <Link href={q.path} key={q.path}>
                  {q.title} ↗
                </Link>
              ))}
          </div>
        )}
      </div>
      {!["form", "legal", "thanks", "search", "diagnostic"].includes(
        p.kind,
      ) && (
        <CTA
          settings={c.settings}
          heading={
            p.kind === "capability"
              ? "Let’s talk about your restaurant."
              : undefined
          }
        />
      )}
      <JsonLd data={pageSchemaData(p)} />
    </main>
  );
}
