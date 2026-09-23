import { getContent, siteOrigin } from "@/lib/content";
import { metadataFor } from "@/lib/seo";
import { JsonLd } from "@/components/site/static";
import { CinematicHome } from "@/components/home/cinematic-home";
import "./homepage.css";
import "./homepage-header.css";

export const generateMetadata = () => metadataFor({
  title: "Managed Restaurant Finance Services",
  description: "Ready Margin handles restaurant accounting, bookkeeping, payroll, reporting and back-office finance, with accountable people who explain what comes next.",
  path: "",
  indexable: true,
  kind: "home",
});

export default async function Home() {
  const c = await getContent();
  const origin = siteOrigin();

  return (
    <main id="main" className="homepage">
      <CinematicHome
        cta={c.settings.cta}
        reviewOffer={c.settings.reviewOffer}
        email={c.settings.email}
      />
      <JsonLd data={[
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
