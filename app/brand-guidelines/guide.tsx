"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { brandGuidelines as data, contrastRatio, swatchText } from "@/lib/brand-guidelines";
import "./guide.css";
import "../brand-colors.css";

const sections = [
  ["overview", "The brand"], ["logo", "Logo use"], ["color", "Color system"],
  ["typography", "Typography"], ["voice", "Our voice"], ["applications", "In practice"],
  ["downloads", "The toolkit"],
] as const;

function Arrow({ down = false }: { down?: boolean }) {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d={down ? "M12 4v15m-6-6 6 6 6-6M5 22h14" : "M5 19 19 5M5 5h14v14"} stroke="currentColor" strokeWidth="1.5" /></svg>;
}

function SectionTitle({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <div className="bg-section-heading"><span className="bg-index">{number} /</span><div><h2>{title}</h2><p>{children}</p></div></div>;
}

export function BrandGuide({ assetRoot = "/brand-guide", downloadRoot = "/brand-guide/downloads", portable = false }: { assetRoot?: string; downloadRoot?: string; portable?: boolean }) {
  const [active, setActive] = useState("overview");
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState("");
  const [copyFailed, setCopyFailed] = useState(false);
  const [logoSurface, setLogoSurface] = useState("Paper");
  const [composition, setComposition] = useState("signature");
  const [weight, setWeight] = useState(600);
  const [applicationFilter, setApplicationFilter] = useState("All");
  const selected = data.compositions.find((item) => item.id === composition)!;
  const logo = `${assetRoot}/ready-margin${logoSurface === "Ink" ? "-reverse" : ""}.svg`;
  const kitUrl = `${downloadRoot}/${portable ? "ready-margin-assets.zip" : "ready-margin-brand-kit.zip"}`;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-10% 0px -55% 0px", threshold: 0 });
    document.querySelectorAll(".bg-guide section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(""), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopyFailed(false);
      setCopied(hex);
    } catch {
      setCopyFailed(true);
      setCopied(hex);
    }
  }

  return <div className="bg-guide">
    <aside className="bg-sidebar">
      <a className="bg-brand" href="#overview" aria-label="Ready Margin brand guidelines"><img src={`${assetRoot}/ready-margin.svg`} alt="Ready Margin" width="182" height="30" /></a>
      <div className="bg-sidebar-label">Brand guidelines<br /><span>Ready Margin / 2026</span></div>
      <button className="bg-mobile-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="bg-navigation">Contents <span>{menu ? "−" : "+"}</span></button>
      <nav id="bg-navigation" aria-label="Brand guideline sections" className={menu ? "bg-nav bg-nav-open" : "bg-nav"}>
        {sections.map(([id, title], i) => <a key={id} href={`#${id}`} className={active === id ? "is-active" : ""} aria-current={active === id ? "location" : undefined} onClick={() => { setActive(id); setMenu(false); }}><span>{String(i + 1).padStart(2, "0")}</span>{title}<span className="bg-nav-dot" /></a>)}
      </nav>
      <div className="bg-sidebar-bottom"><a className="bg-sidebar-download" href={kitUrl} download>{portable ? "Download brand assets" : "Download brand kit"} <Arrow down /></a><p>Support for the work behind<br />a well-run restaurant.</p><span>© Ready Margin · {data.date}</span></div>
    </aside>

    <main id="main" className="bg-main">
      <div className="bg-topbar"><span>Restaurant finance & operations</span><a href="#downloads">Get the assets <Arrow /></a></div>

      <section id="overview" className="bg-overview">
        <div className="bg-eyebrow"><span className="bg-status-dot" /> THE READY MARGIN BRAND <span className="bg-edition">GUIDELINES / V{data.version}</span></div>
        <h1>For the work<br />behind <span>service.</span></h1>
        <div className="bg-intro"><p>Sales, supplier bills, payroll<br />and the monthly close.</p><p>Ready Margin supports the work that happens before, during and after service. These guidelines cover the identity and the materials we use with restaurant owners.</p></div>
        <div className="bg-hero-poster">
          <div className="bg-poster-top"><img src={`${assetRoot}/ready-margin.svg`} alt="Ready Margin" width="172" height="28" /><span>BUILT FOR RESTAURANTS.</span></div>
          <div className="bg-poster-headline">Sales reconciled.<br />Payroll ready<span>.</span></div>
          <div className="bg-poster-bottom"><span>You focus on the restaurant.<br />We handle the work behind it.</span><div className="bg-poster-squares" aria-hidden="true"><i /><i /><i /></div><span>READY FOR<br />WHAT’S NEXT. ↗</span></div>
        </div>
        <div className="bg-principles"><article><span>01 — OUR ROLE</span><h3>Restaurant first.</h3><p>{data.positioning}</p></article><article><span>02 — OUR APPROACH</span><h3>Work you can trace.</h3><p>Keep the invoice, time record or settlement with the question it raises. The owner should be able to follow the work.</p></article><article><span>03 — OUR CHARACTER</span><h3>A named next step.</h3><p>Say what needs checking, who needs to approve it and when the work can move forward.</p></article></div>
      </section>

      <section id="logo" className="bg-section">
        <SectionTitle number="02" title="The Ready Margin identity">Six identity formats for documents, product screens and printed working materials. Use the supplied files rather than rebuilding them.</SectionTitle>
        <div className="bg-specimen-bar"><span>THE PRIMARY LOGO</span><div className="bg-segmented" role="group" aria-label="Logo background">{["Paper", "Ink", "Gold"].map((surface) => <button key={surface} aria-pressed={logoSurface === surface} onClick={() => setLogoSurface(surface)}>{surface}</button>)}</div></div>
        <div className={`bg-logo-stage bg-logo-${logoSurface.toLowerCase()}`}><div className="bg-logo-clearspace"><img src={logo} alt={`Ready Margin logo on ${logoSurface.toLowerCase()}`} width="500" height="81" /><span className="bg-clearspace-note">MINIMUM CLEAR SPACE = ½ LOGO HEIGHT</span></div></div>
        <div className="bg-caption-row"><span>Use the supplied vector artwork. Never retype or redraw it.</span><a href={logo} download>Download this logo <Arrow down /></a></div>
        <div className="bg-identity-grid">{data.identity.map((item) => <article key={item.id}><div className="bg-identity-art"><img src={`${assetRoot}/identity/${item.id}.svg`} alt={`Ready Margin ${item.name.toLowerCase()}`} width={item.width} height={item.height} /></div><h3>{item.name}</h3><p>{item.use}</p><div className="bg-identity-downloads">{[{suffix:"",label:"Primary"},{suffix:"-reverse",label:"Reverse"},{suffix:"-one-color",label:"One-color"}].map((variant) => <div key={variant.label}><span>{variant.label}</span><a href={`${assetRoot}/identity/${item.id}${variant.suffix}.svg`} download>SVG</a><a href={`${assetRoot}/identity/${item.id}${variant.suffix}.png`} download>PNG</a></div>)}</div></article>)}</div>
        <div className="bg-rules-grid"><article><span className="bg-small-label">GIVE IT SPACE</span><h3>Let the signature stand.</h3><p>Keep at least half the full logo height clear on every side. Use a minimum display width of 140 px, or 35 mm in print.</p></article><article><span className="bg-small-label">KEEP IT LEGIBLE</span><h3>Choose a quiet surface.</h3><p>Use the primary logo on paper or gold. Use the reverse logo on ink. Use the one-color file for single-ink production.</p></article><article><span className="bg-small-label">PROTECT THE ARTWORK</span><h3>No extra treatments.</h3><p>Keep the original proportions and colors. Avoid shadows, outlines, rotation, busy photography and decorative containers.</p></article></div>
      </section>

      <section id="color" className="bg-section">
        <SectionTitle number="03" title="Color specifications">Paper, ink and gold are the primary colors. Green supports operations; terracotta supports restaurant communication; slate supports reporting.</SectionTitle>
        <div className="bg-core-swatches">{[{name:"Paper",hex:"#F4F1E8",role:"The breathing room"},{name:"Ink",hex:"#222222",role:"The clarity"},{name:"Ready gold",hex:"#E7C14B",role:"The signature"}].map((color) => <button key={color.name} className="bg-core-swatch" style={{background:color.hex,color:swatchText(color.hex)}} onClick={() => copy(color.hex)} aria-label={`Copy ${color.name} ${color.hex}`}><span>{color.role}<span>↗</span></span><div><h3>{color.name}</h3><span>{color.hex} <small>{copied === color.hex && !copyFailed ? "Copied ✓" : "Click to copy"}</small></span></div></button>)}</div>
        <div className="bg-color-ratio"><div className="bg-ratio-strip"><i style={{background:"#F4F1E8",flex:60}} /><i style={{background:"#222222",flex:25}} /><i style={{background:"#E7C14B",flex:10}} /><i style={{background:"#EED99A",flex:5}} /></div><p><strong>Start with 60 / 25 / 10 / 5.</strong> Paper 60%, ink 25%, gold 10%, stone 5%. A starting point for everyday compositions; campaign panels use the same core colors and their hues.</p></div>
        <div className="bg-subheading"><h3>The expanded palette</h3><p>Two families. Core colors and their tints and shades. Click any swatch to copy its HEX.</p></div>
        <div className="bg-palette-families">{data.palettes.map((family) => <div className="bg-palette-family" key={family.id}><div className="bg-family-description"><h4>{family.name}</h4><p>{family.role}</p></div><div className="bg-ramp">{family.colors.map((color) => <button key={color.step} onClick={() => copy(color.hex)} className="bg-ramp-color" aria-label={`Copy ${color.name} ${color.hex}`}><div style={{background:color.hex,color:swatchText(color.hex)}}><span>{color.step}</span><span>{copied === color.hex && !copyFailed ? "✓" : "+"}</span></div><span>{color.name}</span><code>{color.hex}</code></button>)}</div></div>)}</div>
        <div className="bg-composition-lab"><div className="bg-subheading"><h3>Approved color combinations</h3><p>Choose the application to see its color combination.</p></div><div className="bg-composition-tabs" role="group" aria-label="Composition palette">{data.compositions.map((item) => <button key={item.id} onClick={() => setComposition(item.id)} aria-pressed={composition === item.id}><span style={{background:item.colors[0],borderColor:item.colors[1]}} />{item.name}</button>)}</div><div className="bg-composition-preview" style={{"--composition-bg":selected.background,"--composition-fg":selected.foreground,"--composition-accent":selected.accent} as CSSProperties}><div className="bg-composition-copy"><span>READY MARGIN / {selected.name.toUpperCase()}</span><h3>Restaurant finance.<br />Work accounted for.</h3><p>{selected.note}</p><span className="bg-preview-cta">Restaurant finance & operations <Arrow /></span></div><div className="bg-composition-art" aria-hidden="true"><div /><div /><div /><div /><div /></div></div><div className="bg-composition-colors">{selected.colors.map((color) => <button key={color} onClick={() => copy(color)} aria-label={`Copy composition color ${color}`}><i style={{background:color}} /><code>{color}</code></button>)}</div></div>
        <div className="bg-subheading"><h3>Status colors</h3><p>Status colors are functional. Always pair them with words or an icon.</p></div>
        <div className="bg-semantic-grid">{data.semantic.map((color) => <article key={color.id} style={{background:color.background}}><span style={{color:color.hex}}><i style={{background:color.hex}} />{color.name}</span><p>{color.use}</p><code>{color.hex}</code></article>)}</div>
        <div className="bg-accessibility"><div><span className="bg-small-label">TEXT & DATA LEGIBILITY</span><h3>Readable records.<br />Clear status.</h3><p>Use a contrast ratio of at least 4.5:1 for body text and 3:1 for large text and meaningful interface graphics. Gold needs ink text.</p></div><div className="bg-contrast-list">{[{fg:"#222222",bg:"#F4F1E8",name:"Ink on paper"},{fg:"#222222",bg:"#E7C14B",name:"Ink on gold"},{fg:"#F4F1E8",bg:"#222222",name:"Paper on ink"},{fg:"#222222",bg:"#F1E5C1",name:"Ink on light gold"}].map((pair) => <div key={pair.name}><span className="bg-aa-sample" style={{color:pair.fg,background:pair.bg}}>Aa</span><span>{pair.name}</span><code>{contrastRatio(pair.fg,pair.bg).toFixed(2)}:1</code><span className="bg-pass">AA ✓</span></div>)}<p>Avoid paper or white body text on gold. Screen HEX/RGB values are the source of truth; proof print colors with the production supplier.</p></div></div>
      </section>

      <section id="typography" className="bg-section">
        <SectionTitle number="04" title="Typography">Plus Jakarta Sans is used in the website, client documents and workspace. Use regular for paragraphs and semibold for headings.</SectionTitle>
        <div className="bg-type-specimen"><div className="bg-specimen-bar"><span>PLUS JAKARTA SANS</span><div className="bg-segmented" role="group" aria-label="Type specimen weight">{[{value:400,label:"Regular"},{value:500,label:"Medium"},{value:600,label:"Semibold"}].map((item) => <button key={item.value} aria-pressed={weight === item.value} onClick={() => setWeight(item.value)}>{item.label}</button>)}</div></div><div className="bg-type-large" style={{fontWeight:weight}}>Aa Bb Cc<span>September sales<br />are reconciled.</span></div><div className="bg-type-glyphs">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789 &amp; @ % + − = / ? !</div></div>
        <div className="bg-type-table" role="table" aria-label="Desktop typography scale"><div className="bg-type-table-head" role="row"><span role="columnheader">Role / desktop</span><span role="columnheader">Size / line</span><span role="columnheader">Weight</span><span role="columnheader">Use</span></div>{data.typeScale.map((type) => <div role="row" key={type.role}><span role="cell">{type.role}</span><code role="cell">{type.size} / {type.line} px</code><span role="cell">{type.weight}</span><span role="cell">{type.use}</span></div>)}</div>
        <div className="bg-rules-grid"><article><span className="bg-small-label">HIERARCHY</span><h3>Separate the levels.</h3><p>Use semibold for headlines, regular for body and medium for captions. Keep headlines short and paragraphs to about 45–70 characters per line.</p></article><article><span className="bg-small-label">SMALLER SCREENS</span><h3>Scale with care.</h3><p>On mobile, use 44/48 px display, 36/40 px page titles and 28/34 px section headings. Keep body text at 16/26 px.</p></article><article><span className="bg-small-label">NUMBERS &amp; ACCESS</span><h3>Line up the figures.</h3><p>Use tabular numbers in financial tables. Keep meaning in sentence case. The typeface uses the SIL Open Font License; the license ships with the kit.</p></article></div>
      </section>

      <section id="voice" className="bg-section">
        <SectionTitle number="05" title="Writing to restaurant owners">Write the way we work: identify the record, explain the question and give the next step. Use the restaurant’s name and the reporting period when they help.</SectionTitle>
        <div className="bg-voice-list">{data.voice.map((principle,i) => <article key={principle.title}><div className="bg-voice-intro"><span className="bg-small-label">0{i+1}</span><h3>{principle.title}</h3><p>{principle.description}</p></div><div className="bg-voice-examples"><div className="bg-voice-before"><span>AVOID</span><p>{principle.before}</p></div><div className="bg-voice-after"><span>WRITE LIKE THIS</span><p>{principle.after}</p></div></div></article>)}</div>
        <div className="bg-language-note"><span>THE WRITING CHECK</span><p>Name the record. State the action. Include the owner and the deadline. Avoid claims that go beyond the agreed work.</p></div>
      </section>

      <section id="applications" className="bg-section">
        <SectionTitle number="06" title="Ready Margin at work">Letters, invoices, email and the restaurant workspace. Each application includes a downloadable mockup and the files needed to build it.</SectionTitle>
        <div className="bg-application-filters" role="group" aria-label="Application type">{["All", "Print", "Digital"].map((filter) => <button key={filter} aria-pressed={applicationFilter === filter} onClick={() => setApplicationFilter(filter)}>{filter}</button>)}<a href={`${downloadRoot}/ready-margin-mockups.zip`} download>Download all mockups <Arrow down /></a></div>
        <div className="bg-real-applications">{data.applications.filter((item) => applicationFilter === "All" || item.category === applicationFilter).map((item) => <article key={item.id} className={`bg-real-application bg-real-${item.id}`}>
          <a className="bg-real-image" href={`${assetRoot}/mockups/${item.id}.png`} download aria-label={`Download ${item.title} mockup`}><img src={`${assetRoot}/mockups/${item.id}.png`} alt={`Ready Margin ${item.title.toLowerCase()} application mockup`} width="1536" height="1024" loading="lazy" /><span>Download PNG <Arrow down /></span></a>
          <div className="bg-real-caption"><span className="bg-small-label">{item.category.toUpperCase()} / {item.format}</span><h3>{item.title}</h3><p>{item.description}</p><div className="bg-real-downloads"><a href={`${assetRoot}/mockups/${item.id}.png`} download>Mockup PNG <Arrow down /></a><a href={`${downloadRoot}/${item.template}-template.zip`} download>Template files <Arrow down /></a>{item.category === "Digital" && <a href={`${downloadRoot}/templates/${item.template}.html`} target="_blank" rel="noreferrer">Open {item.id === "dashboard" ? "prototype" : "email"} <Arrow /></a>}</div><details><summary>How to use this application</summary><p>{item.usage}</p></details></div>
        </article>)}</div>
        <div className="bg-application-note"><span className="bg-small-label">WORKING FILES</span><p>Mockups show the identity in context. Templates include editable SVG and HTML, plus PDF and PNG exports. Client names and figures in the examples are sample records.</p></div>
      </section>

      <section id="downloads" className="bg-section bg-downloads">
        <div><span className="bg-small-label">07 / THE TOOLKIT</span><h2>Download the<br />Ready Margin files.</h2><p>{portable ? "The identity files, application mockups, document templates and color specifications are available below." : "Download the complete identity system, application mockups, working templates and website source."}</p><a className="bg-download-button" href={kitUrl} download>{portable ? "Download the brand assets" : "Download the complete kit"} <Arrow down /></a></div>
        <div className="bg-download-list">{[{name:"Brand guidelines",detail:"PDF · Ready to read and share",file:"ready-margin-guidelines.pdf"},{name:"Complete identity files",detail:"SVG & PNG · Logos, marks, wordmarks & badges",file:"ready-margin-logos.zip"},{name:"Design tokens",detail:"JSON · Color, type & spacing",file:"ready-margin-tokens.json"},{name:"Application mockups",detail:"PNG · Print & digital applications",file:"ready-margin-mockups.zip"},{name:"Working templates",detail:"PDF, SVG, HTML & email files",file:"ready-margin-templates.zip"},{name:"Editable Figma project",detail:"Native layers · Variables & specimens",url:"https://www.figma.com/design/tDTgaoHi6WTJfwaiPLYpyR"}].map((item) => <a key={item.name} href={item.url || `${downloadRoot}/${item.file}`} download={item.file ? true : undefined} target={item.url ? "_blank" : undefined} rel={item.url ? "noreferrer" : undefined}><div><h3>{item.name}</h3><span>{item.detail}</span></div><Arrow down={!item.url} /></a>)}</div>
      </section>
      <footer className="bg-footer"><img src={`${assetRoot}/ready-margin.svg`} alt="Ready Margin" width="145" height="24" /><span>Restaurant finance & operations.</span><span>BRAND GUIDELINES / {data.date.toUpperCase()}</span><a href="#overview" aria-label="Back to top">↑</a></footer>
    </main>
    <div className={`bg-toast ${copied ? "bg-toast-visible" : ""}`} role="status" aria-live="polite">{copyFailed ? `Copy manually: ${copied}` : `${copied} copied to clipboard`}</div>
  </div>;
}
