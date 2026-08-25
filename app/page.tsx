'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

type ThemeChoice = 'system' | 'light' | 'dark';

const services = [
  ['01', 'Restaurant accounting + bookkeeping', 'We keep the books clean, reconcile the accounts, support the close, handle vendor bills, and give you financial statements you can trust.'],
  ['02', 'Restaurant payroll + tips', 'We coordinate your team and payroll provider, including tip details, corrections, reporting, and the follow-up that keeps small issues from repeating.'],
  ['03', 'Financial reporting + cash flow', 'See cash, sales, costs, commitments, weekly P&L, and location performance in a way that helps you decide what to do next.'],
  ['04', 'CFO-level financial guidance', 'We explain what changed, what it means, and what to do next—without asking you to build a full finance department.'],
  ['05', 'Connected restaurant finance workflow', 'Clear handoffs across the tools you already use, with one team responsible for keeping the work moving.'],
];

const steps = [
  ['Review', 'We look at the books, payroll, reports, cash, and the tasks that keep landing back on you.'],
  ['Map', 'We trace where the information starts, where it goes, and where something gets lost or delayed.'],
  ['Set it up', 'We agree on simple definitions, checklists, owners, and a reporting routine everyone can follow.'],
  ['Run it', 'We handle the recurring finance work with clear ownership and a dependable review rhythm.'],
  ['Explain it', 'We tell you what changed, why it matters, and what deserves your attention now.'],
  ['Keep improving', 'We use each review to fix loose ends and make the next month easier to run.'],
];

const triggers = [
  'Cash is tight even when sales look healthy',
  'Payroll and tip issues keep resurfacing',
  'Reports arrive after the decision window',
  'No one owns the full financial picture',
  'A second location is opening',
  'You need lender- or partner-ready numbers',
];

const offers = [
  ['Starter', '$1,800 / month', 'A clear starting point for one location.', 'A focused foundation for a simpler single-location restaurant.'],
  ['Core', '$2,800 / month', 'For the owner carrying too much of the finance work.', 'The complete recurring finance function for meaningful operational complexity.'],
  ['Growth', '$4,200 / month', 'For growing restaurants and multi-location teams.', 'Expanded visibility and planning support as the operation grows.'],
  ['Partner', 'From $5,500 / month', 'For complex groups that need a closer finance partner.', 'A custom level of support for complex entities, locations, and reporting needs.'],
];

const roadmapItems = [
  ['LIVE', 'Managed accounting', 'Books that stay current', 'Live today: bookkeeping, reconciliations, close support, vendor bills, and financial statements you can trust.'],
  ['LIVE', 'Payroll + tips', 'A cleaner pay run', 'Live today: coordination around hours, tips, corrections, reporting, and the follow-up that keeps issues from repeating.'],
  ['LIVE', 'Reporting + cash flow', 'See what changed', 'Live today: clearer views of cash, sales, costs, commitments, weekly P&L, and location performance.'],
  ['LIVE', 'Financial guidance', 'A real person for the next decision', 'Live today: plain-English reviews, planning conversations, and practical guidance grounded in the work we run.'],
  ['LIVE', 'Connected finance workflow', 'One owner for the handoffs', 'Live today: clear responsibilities and dependable handoffs across the tools your restaurant already uses.'],
  ['WIP', 'Financial dashboard', 'Your numbers in one view', 'A developing view of cash, reporting, and the items that need your attention.'],
  ['WIP', 'Payroll + tips workspace', 'Payroll details, easier to follow', 'A simpler way to review hours, tips, corrections, and follow-up around each pay run.'],
  ['COMING SOON', 'Multi-location finance', 'One rhythm across every location', 'Consolidated views, repeatable standards, and stronger financial infrastructure for growing groups.'],
  ['PLANNED', 'From issue to next step', 'Turn a concern into action', 'A clearer path from a financial concern to the right owner, next step, and follow-through.'],
];

const faqs = [
  ['Who is this service designed for?', 'Independent restaurants and owner-operated groups that have outgrown basic bookkeeping but are not ready to build a full internal finance department.'],
  ['Do you provide restaurant accounting and bookkeeping services?', 'Yes. Ready Margin handles the recurring accounting and bookkeeping work, reconciliations, close support, vendor bills, and financial reporting that keep the operation dependable.'],
  ['Can you manage restaurant payroll and tip reporting?', 'Yes. We coordinate the workflow between your team and payroll provider, including tip-related processes, corrections, reporting, and recurring review.'],
  ['Do you offer fractional CFO support for restaurants?', 'The relationship includes CFO-level financial guidance: plain-English reviews, issue interpretation, planning conversations, and decision support grounded in the work we run.'],
  ['What is included in the monthly relationship?', 'We shape the monthly work around your restaurant: books, payroll and tips, reports, cash visibility, reviews, and practical guidance.'],
  ['Can you work with our current tools?', 'Yes. We work with the POS, payroll, accounting, and operating tools already in place, then clarify the handoffs between them.'],
  ['Do you replace our CPA or existing providers?', 'Not automatically. We can work alongside your existing providers; the review makes it clear who owns what and where the handoffs need fixing.'],
  ['How is final pricing determined?', 'It depends on your locations, entities, payroll complexity, transaction volume, reporting needs, integrations, and any clean-up required.'],
  ['Is the financial dashboard available?', 'The dashboard is still being built. Today’s service is the live finance work, reporting, and human guidance behind it.'],
  ['What do current members get as the technology layer develops?', 'Current members get first access to new tools and member benefits as they move from testing into a release we can stand behind.'],
];

const guideStops = [
  ['top', 'Start here', 'Margo is helping you see the full picture.', 'welcome', '/Ready_Margin_Margo_State_Welcome.svg'],
  ['problem', 'See the pressure', 'Here are the places finance usually starts costing you time.', 'attention', '/Ready_Margin_Margo_State_Attention.svg'],
  ['services', 'See what we handle', 'Margo is showing the work Ready Margin takes off your plate.', 'ready', '/Ready_Margin_Margo_State_Ready.svg'],
  ['roadmap', 'See what is next', 'New tools will make the work easier to see without replacing the people behind it.', 'wip', '/Ready_Margin_Margo_State_Explaining.svg'],
  ['process', 'See how it works', 'We turn scattered numbers into a repeatable way to run the finance work.', 'reviewing', '/Ready_Margin_Margo_State_Reviewing.svg'],
  ['pricing', 'Find your fit', 'There is a clear starting point for the shape of your restaurant.', 'explaining', '/Ready_Margin_Margo_State_Explaining.svg'],
  ['review', 'Take the next step', 'Bring the messy questions. We will help you sort them out.', 'success', '/Ready_Margin_Margo_State_Success.svg'],
];

const mascotAssets = [
  '/ready-margin-margo-animated.svg',
  '/Ready_Margin_Margo_State_Welcome.svg',
  '/Ready_Margin_Margo_State_Attention.svg',
  '/Ready_Margin_Margo_State_Reviewing.svg',
  '/Ready_Margin_Margo_State_Explaining.svg',
  '/Ready_Margin_Margo_State_Ready.svg',
  '/Ready_Margin_Margo_State_Reconciled.svg',
  '/Ready_Margin_Margo_State_Success.svg',
  '/Ready_Margin_Margo_State_Error.svg',
];

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ready Margin',
  alternateName: 'Ready Margin Restaurant Finance',
  description: 'Managed restaurant financial operations for independent restaurants and growing restaurant groups: accounting, payroll and tip coordination, reporting, cash visibility, and financial guidance.',
  url: 'https://readymargin.com',
  logo: 'https://readymargin.com/ready-margin-mark.svg',
  image: 'https://readymargin.com/og.png',
  areaServed: 'US',
  email: 'contact@readymargin.com',
  contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: 'contact@readymargin.com' },
  knowsAbout: ['restaurant accounting', 'restaurant bookkeeping', 'restaurant payroll', 'restaurant tip reporting', 'restaurant cash flow', 'fractional CFO services for restaurants'],
  sameAs: ['https://in.linkedin.com/in/gursimarsandhu'],
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Managed Restaurant Financial Operations',
  serviceType: 'Restaurant finance services',
  description: 'Done-for-you accounting, payroll and tip coordination, reporting, cash visibility, and financial guidance for independent restaurants and growing groups.',
  provider: { '@type': 'ProfessionalService', name: 'Ready Margin', url: 'https://readymargin.com' },
  areaServed: { '@type': 'Country', name: 'United States' },
  audience: { '@type': 'BusinessAudience', audienceType: 'Independent restaurant owners and growing restaurant groups' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Ready Margin managed finance relationships',
    itemListElement: offers.map(([name, price, audience, description]) => ({
      '@type': 'Offer',
      name: `Ready Margin ${name}`,
      price: price.replace(/[^0-9.]/g, ''),
      priceCurrency: 'USD',
      description: `${audience} ${description}`,
      url: 'https://readymargin.com/#pricing',
    })),
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Ready Margin',
  url: 'https://readymargin.com',
  description: 'Managed restaurant financial operations, including accounting, payroll and tip coordination, reporting, cash visibility, and financial guidance.',
  publisher: { '@type': 'Organization', name: 'Ready Margin' },
};

const webpageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Restaurant Accounting, Payroll & Finance Services | Ready Margin',
  url: 'https://readymargin.com',
  description: 'Done-for-you restaurant accounting, bookkeeping, payroll and tip reporting, cash visibility, and CFO guidance for independent owners and growing groups.',
  isPartOf: { '@type': 'WebSite', name: 'Ready Margin', url: 'https://readymargin.com' },
  about: { '@type': 'Thing', name: 'Restaurant financial operations' },
  primaryImageOfPage: { '@type': 'ImageObject', url: 'https://readymargin.com/og.png' },
};

function Logo({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  return <img className={className} src={dark ? '/ready-margin-logo-horizontal-dark.svg' : '/ready-margin-logo-horizontal.svg'} alt="Ready Margin" />;
}

function SectionMarker({ index, children }: { index: string; children: React.ReactNode }) {
  return <p className="section-marker"><span>{index}</span>{children}</p>;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [themeChoice, setThemeChoice] = useState<ThemeChoice>('system');
  const [formState, setFormState] = useState<'idle' | 'error' | 'ready' | 'fallback'>('idle');
  const [meetingRequested, setMeetingRequested] = useState(false);
  const [timezone, setTimezone] = useState('UTC');
  const [guideIndex, setGuideIndex] = useState(0);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [cursorMode, setCursorMode] = useState<'default' | 'interactive'>('default');
  const [scrollOffset, setScrollOffset] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [footerVisible, setFooterVisible] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [guideOffset, setGuideOffset] = useState({ x: 0, y: 0 });
  const [guideDragging, setGuideDragging] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);
  const guideDragRef = useRef({ startX: 0, startY: 0, originX: 0, originY: 0 });

  useEffect(() => {
    try {
      // The browser is the source of truth for the visitor's IANA timezone.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
    } catch {
      setTimezone('UTC');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const started = performance.now();
    const preload = mascotAssets.map((src) => new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = src;
      if ('decode' in image) image.decode().catch(() => undefined).finally(() => resolve());
    }));
    Promise.all(preload).then(() => {
      const wait = Math.max(0, 900 - (performance.now() - started));
      window.setTimeout(() => { if (!cancelled) setLoading(false); }, wait);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      setCursor({ x: event.clientX, y: event.clientY });
      const target = event.target as Element | null;
      setCursorMode(target?.closest('a, button, summary, input, select, textarea, .pressure-card, .service-row, .step, .faq-list details') ? 'interactive' : 'default');
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useEffect(() => {
    const updateScroll = () => setScrollOffset(window.scrollY * 0.12);
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem('ready-margin-theme') as ThemeChoice | null;
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      // Storage is an external system; hydrate the preference once on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeChoice(stored);
    }
  }, []);

  useEffect(() => {
    const updateGuide = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const footerMain = document.querySelector('.footer-main');
      const nearingFooterPromise = footerMain && footerMain.getBoundingClientRect().top <= window.innerHeight * .9;
      setScrollProgress(nearingFooterPromise ? 100 : Math.min(100, Math.round((window.scrollY / maxScroll) * 100)));
      const current = guideStops.reduce((active, [id], index) => {
        const section = document.getElementById(id);
        return section && section.getBoundingClientRect().top <= window.innerHeight * .35 ? index : active;
      }, 0);
      setGuideIndex(current);
    };
    updateGuide();
    window.addEventListener('scroll', updateGuide, { passive: true });
    return () => window.removeEventListener('scroll', updateGuide);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const resolved = themeChoice === 'system' ? (media.matches ? 'dark' : 'light') : themeChoice;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.colorScheme = resolved;
    };
    apply();
    window.localStorage.setItem('ready-margin-theme', themeChoice);
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [themeChoice]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) setThemeOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    const celebrateReview = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest('a[href="#review"]')) return;
      setCelebrate(true);
      window.setTimeout(() => setCelebrate(false), 4800);
    };
    document.addEventListener('click', celebrateReview);
    return () => document.removeEventListener('click', celebrateReview);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible'));
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    const motionTargets = document.querySelectorAll<HTMLElement>('.reveal, #content h1, #content h2, #content h3, #content p, #content li, #content article, #content details, #content label');
    motionTargets.forEach((element, index) => {
      element.classList.add('motion-reveal');
      element.style.setProperty('--motion-delay', `${(index % 5) * 45}ms`);
      element.style.setProperty('--motion-x', `${index % 3 === 0 ? -12 : index % 3 === 1 ? 12 : 0}px`);
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const footer = document.querySelector('.footer-main');
    if (!footer) return;
    const updateFooterState = () => {
      const visible = footer.getBoundingClientRect().top <= window.innerHeight * .72;
      setFooterVisible(visible);
      footer.closest('.site-footer')?.classList.toggle('is-visible', visible);
    };
    updateFooterState();
    window.addEventListener('scroll', updateFooterState, { passive: true });
    window.addEventListener('resize', updateFooterState);
    return () => { window.removeEventListener('scroll', updateFooterState); window.removeEventListener('resize', updateFooterState); };
  }, []);

  useEffect(() => {
    if (!guideDragging) return;
    const move = (event: PointerEvent) => {
      const guide = document.querySelector<HTMLElement>('.margo-guide');
      if (!guide) return;
      const rect = guide.getBoundingClientRect();
      const baseLeft = rect.left - guideDragRef.current.originX;
      const baseTop = rect.top - guideDragRef.current.originY;
      const edgeAnchored = true;
      const bubbleWidth = Math.min(window.innerWidth <= 560 ? 190 : 240, window.innerWidth - 24);
      const bubbleHeight = window.innerWidth <= 560 ? 86 : 110;
      const minX = edgeAnchored
        ? 12 + bubbleWidth - rect.width - 8 - baseLeft
        : 12 + bubbleWidth / 2 - rect.width / 2 - baseLeft;
      const maxX = edgeAnchored
        ? window.innerWidth - 12 - rect.width - 8 - baseLeft
        : window.innerWidth - 12 - bubbleWidth / 2 - rect.width / 2 - baseLeft;
      const minY = 8 + bubbleHeight + 12 - baseTop;
      const maxY = window.innerHeight - rect.height - 8 - baseTop;
      const rawX = guideDragRef.current.originX + event.clientX - guideDragRef.current.startX;
      const rawY = guideDragRef.current.originY + event.clientY - guideDragRef.current.startY;
      setGuideOffset({ x: Math.min(Math.max(rawX, minX), Math.max(minX, maxX)), y: Math.min(Math.max(rawY, minY), Math.max(minY, maxY)) });
    };
    const end = () => setGuideDragging(false);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', end, { once: true });
    window.addEventListener('pointercancel', end, { once: true });
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); window.removeEventListener('pointercancel', end); };
  }, [guideDragging]);

  useEffect(() => {
    const resetGuidePosition = () => setGuideOffset({ x: 0, y: 0 });
    window.addEventListener('resize', resetGuidePosition, { passive: true });
    return () => window.removeEventListener('resize', resetGuidePosition);
  }, []);

  function selectTheme(choice: ThemeChoice) {
    setThemeChoice(choice);
    setThemeOpen(false);
  }

  function startGuideDrag(event: React.PointerEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest('a,button')) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    guideDragRef.current = { startX: event.clientX, startY: event.clientY, originX: guideOffset.x, originY: guideOffset.y };
    setGuideDragging(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setFormState('error');
      form.reportValidity();
      return;
    }
    const fields = new FormData(form);
    const needs = fields.getAll('needs').map(String).join(', ') || 'Not specified';
    const payload = {
      name: String(fields.get('name') || ''),
      email: String(fields.get('email') || ''),
      phone: String(fields.get('phone') || ''),
      company: String(fields.get('company') || ''),
      locations: String(fields.get('locations') || ''),
      revenue: String(fields.get('revenue') || ''),
      setup: String(fields.get('setup') || ''),
      needs: fields.getAll('needs').map(String),
      trigger: String(fields.get('trigger') || ''),
      consent: fields.get('consent') === 'yes',
      marketingOptIn: fields.get('marketingOptIn') === 'yes',
      meetingRequested: fields.get('meetingRequested') === 'yes',
      meetingDate: String(fields.get('meetingDate') || ''),
      meetingTime: String(fields.get('meetingTime') || ''),
      timezone: String(fields.get('timezone') || timezone),
    };
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setFormState('ready');
        form.reset();
        setMeetingRequested(false);
        return;
      }
    } catch {
      // Use the email fallback below when the server endpoint is unavailable.
    }
    const subject = `Financial Control Review — ${payload.company || 'Restaurant enquiry'}`;
    const body = [
      `Full name: ${payload.name}`,
      `Work email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `Restaurant or group: ${payload.company}`,
      `Locations: ${payload.locations}`,
      `Annual revenue: ${payload.revenue}`,
      `Current accounting setup: ${payload.setup}`,
      `Most help needed: ${needs}`,
      `Why now: ${payload.trigger}`,
      `Permission to follow up: ${payload.consent ? 'Yes' : 'No'}`,
      `Optional marketing updates: ${payload.marketingOptIn ? 'Yes' : 'No'}`,
      `Meeting requested: ${payload.meetingRequested ? 'Yes' : 'No'}`,
      `Preferred meeting time: ${payload.meetingDate && payload.meetingTime ? `${payload.meetingDate} ${payload.meetingTime} (${payload.timezone})` : 'Not requested'}`,
    ].join('\n');
    window.location.href = `mailto:contact@readymargin.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setFormState('fallback');
  }

  return (
    <main id="top" style={{ '--cursor-x': `${cursor.x}px`, '--cursor-y': `${cursor.y}px`, '--scroll-offset': `${scrollOffset}px` } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }} />
      <div className={`loading-splash ${loading ? 'is-loading' : 'is-done'}`} aria-hidden={!loading} role="status" aria-live="polite">
        <div className="loading-mark"><span /><span /><b /></div>
        <img src="/Ready_Margin_Margo_State_Reviewing.svg" alt="Margo is preparing your financial view" />
        <p><span>READY MARGIN / CHECKING</span>Margo is getting the report ready.</p>
      </div>
      <a className="skip-link" href="#content">Skip to content</a>
      <header className="site-header">
        <a className="header-logo" href="#top" aria-label="Ready Margin home"><Logo className="logo-light" /><Logo dark className="logo-dark" /></a>
        <nav className={`primary-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <a href="#process" onClick={() => setMenuOpen(false)}>How it works</a><a href="#services" onClick={() => setMenuOpen(false)}>Services</a><a href="#roadmap" onClick={() => setMenuOpen(false)}>What’s next</a><a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a><a href="#fit" onClick={() => setMenuOpen(false)}>Who we help</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact us</a>
        </nav>
        <div className="header-actions">
          <a className="header-cta" href="#review">Get your review <span aria-hidden="true">↗</span></a>
          <div className="theme-control" ref={themeRef}>
            <button className="icon-button" type="button" aria-label="Choose color theme" aria-haspopup="menu" aria-expanded={themeOpen} onClick={() => setThemeOpen(!themeOpen)}><span className="sun-icon" aria-hidden="true">☼</span><span className="moon-icon" aria-hidden="true">◐</span></button>
            {themeOpen && <div className="theme-menu" role="menu" aria-label="Color theme">{(['system', 'light', 'dark'] as ThemeChoice[]).map(choice => <button key={choice} type="button" role="menuitemradio" aria-checked={themeChoice === choice} onClick={() => selectTheme(choice)}><span>{themeChoice === choice ? '●' : '○'}</span>{choice[0].toUpperCase() + choice.slice(1)}</button>)}</div>}
          </div>
          <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
        </div>
      </header>

      <div id="content">
        <section className="hero band-dark">
          <div className="hero-copy reveal">
            <p className="eyebrow"><span /> You focus on the food. We’ll make the numbers make sense.</p>
            <h1>Know where<br />you <mark>stand.</mark></h1>
            <p className="hero-deck">Your restaurant moves every day. You should not have to guess what the numbers mean.</p>
            <p className="hero-body"><strong>Restaurant finance, run for you—while you can still do something about it.</strong> When sales look fine but cash feels tight, the problem is rarely one number. Payroll, tips, vendors, bank activity, and reports live in different places, so you end up piecing it together after a long day. Ready Margin takes the finance work off your plate and gives you a clear answer: what changed, why it matters, and what to do next.</p>
            <div className="hero-actions"><a className="button button-lime" href="#review">Get Your Financial Control Review <span>↗</span></a><a className="text-link" href="#process">See how it works <span>↓</span></a></div>
          </div>
          <div className="readiness-engine" aria-label="Restaurant activity being organized into a ready financial view">
            <div className="engine-meta"><span>RM / FINANCIAL READINESS</span><span>ONE ACCOUNTABLE FUNCTION</span></div>
            <div className="input-stack" aria-hidden="true">{['POS sales', 'Payroll + tips', 'Cash + bank', 'Vendor bills'].map((item, index) => <div key={item} style={{ '--row': index } as React.CSSProperties}><span>{String(index + 1).padStart(2, '0')}</span>{item}<i /></div>)}</div>
            <div className="margin-frame" aria-hidden="true"><i /><i /><b /></div>
            <article className="report-sheet"><p>Weekly financial view</p><strong>READY FOR REVIEW</strong><div><span>Sales captured</span><b>Aligned</b></div><div><span>Cash position</span><b>Visible</b></div><div><span>Items requiring attention</span><b className="attention">2</b></div><footer><span>One accountable workflow</span><i>✓</i></footer></article>
            <p className="engine-caption">Fragmented inputs become one view: what changed, why it matters, and what to do next.</p>
          </div>
        </section>

        <div className="promise-strip"><span>Clear numbers.</span><span>Accountable people.</span><span>Fewer financial surprises.</span></div>

        <section className="problem section-shell" id="problem">
          <SectionMarker index="01">The problems we solve</SectionMarker>
          <div className="split-heading reveal"><h2>You should not have to run the restaurant <em>and the finance department.</em></h2><p>Cash can be tight even when sales look healthy. Payroll and tips can create Friday anxiety. Reports can arrive after the decision window. Ready Margin closes the gap between what happened and what you can do next.</p></div>
          <div className="pressure-grid">{triggers.slice(0, 4).map((item, index) => <article className="pressure-card reveal" key={item}><span>0{index + 1}</span><h3>{item}</h3><p>{['Sales can look fine while the bank account tells a different story.','Hourly teams, tips, corrections, and payroll deadlines create recurring risk.','A late report describes the past after the useful decision window has closed.','When providers are disconnected, the owner is left to chase every answer.'][index]}</p><i aria-hidden="true">↘</i></article>)}</div>
        </section>

        <section className="model band-lime">
          <SectionMarker index="02">A simpler way to handle the numbers</SectionMarker>
          <div className="model-copy reveal"><h2>One managed finance function <em>for your restaurant.</em></h2><p>Instead of coordinating several providers and chasing scattered reports, you have one team handling the work and explaining what needs your attention.</p></div>
          <div className="model-statement"><span>FROM</span><b>Disconnected providers</b><i>→</i><span>TO</span><strong>One accountable owner</strong></div>
        </section>

        <section className="services band-dark" id="services"><div className="section-shell"><SectionMarker index="03">What we take off your plate</SectionMarker><div className="split-heading reveal"><h2>Restaurant finance, <mark>run for you.</mark></h2><p>We handle the numbers, the payroll details, the reports, and the questions that come with them—so you can focus on the restaurant.</p></div><div className="service-list">{services.map(([number, title, copy]) => <article className="service-row reveal" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p><i aria-hidden="true">↗</i></article>)}</div></div></section>

        <section className="roadmap section-shell" id="roadmap">
          <SectionMarker index="04">Product roadmap</SectionMarker>
          <div className="split-heading reveal"><h2>What you can use today, what we’re building, and what comes next.</h2><p>Ready Margin is service-first today. The road ahead adds visibility and follow-through without replacing the people who understand the work.</p></div>
          <div className="roadmap-stages" aria-label="Product roadmap stages"><span className="is-live"><b>01</b> Live now</span><i aria-hidden="true" /><span className="is-wip"><b>02</b> Work in progress</span><i aria-hidden="true" /><span className="is-coming"><b>03</b> Coming soon</span><i aria-hidden="true" /><span className="is-planned"><b>04</b> Planned</span></div>
          <div className="roadmap-grid">{roadmapItems.map(([status, label, title, copy], index) => <article className={`roadmap-card reveal ${status === 'LIVE' ? 'is-live' : status === 'WIP' ? 'is-wip' : status === 'PLANNED' ? 'is-planned' : 'is-coming'}`} key={label}><header><span>{String(index + 1).padStart(2, '0')} / {label}</span><b>{status === 'LIVE' ? 'LIVE NOW' : status === 'PLANNED' ? 'PLANNED' : status}</b></header><h3>{title}</h3><p>{copy}</p></article>)}</div>
          <div className="roadmap-note reveal"><span>FOR CURRENT MEMBERS</span><p>Current members get first access to new tools and member benefits as they become ready.</p><a className="text-link" href="#review">Ask about member access <span>↗</span></a></div>
        </section>

        <section className="process section-shell" id="process">
          <SectionMarker index="05">How it works</SectionMarker>
          <div className="process-layout"><div className="process-intro reveal"><h2>From scattered numbers to answers <em>you can use.</em></h2><div className="margo-moment margo-reviewing"><img src="/Ready_Margin_Margo_State_Reviewing.svg" alt="Margo reviewing a financial report" /><p><span>MARGO / REVIEWING</span>We start by finding what is unclear, what is late, and what keeps landing back on you.</p></div></div><div className="step-list">{steps.map(([title, copy], index) => <article className="step reveal" key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{copy}</p></div><i aria-hidden="true" /></article>)}</div></div>
        </section>

        <section className="clarity band-cobalt">
          <div className="clarity-report reveal"><header><span>WEEKLY CLARITY EXAMPLE</span><b>READY</b></header><div><p>What changed</p><strong>Labor moved above the planned range</strong></div><div><p>Why it matters</p><strong>Cash requirements are higher before the next payroll</strong></div><div><p>Next action</p><strong>Review scheduling and near-term commitments</strong></div></div>
          <div className="clarity-copy reveal"><img className="margo-explaining" src="/Ready_Margin_Margo_State_Explaining.svg" alt="Margo explaining a financial clarity example" /><SectionMarker index="06">Clear answers, not accounting jargon</SectionMarker><h2>See what changed. Know why it matters. Act before the next payroll.</h2><p>We connect the numbers to what is happening in the restaurant, so you can move from activity to understanding to action while it still matters.</p></div>
        </section>

        <section className="fit section-shell" id="fit"><SectionMarker index="07">Who we help</SectionMarker><div className="split-heading reveal"><h2>For restaurants that have outgrown <em>basic bookkeeping.</em></h2><p>Best for independent restaurants and emerging groups whose financial complexity has outgrown DIY bookkeeping or a generic provider—but not yet justified a full internal finance department.</p></div><div className="fit-grid"><article className="fit-panel fit-ready reveal"><header><span>Best fit / Ready</span><b>01–05 locations</b></header><ul>{['Owner-operated restaurants','Emerging multi-location groups','Operators preparing another location','Restaurants with payroll, tip, cash, or close complexity','Owners who want one accountable finance relationship'].map(item => <li key={item}><i>✓</i>{item}</li>)}</ul></article><article className="fit-panel reveal"><header><span>Consider another model</span><b>Different needs</b></header><ul>{['Annual tax filing only','Simple transaction categorization only','Mature internal finance department already in place','A software-only dashboard'].map(item => <li key={item}><i>—</i>{item}</li>)}</ul></article></div></section>

        <section className="triggers band-dark"><div className="section-shell"><SectionMarker index="08">When owners reach out</SectionMarker><div className="split-heading reveal"><h2>When the numbers stay late, <mark>the decisions get harder.</mark></h2><p>Most owners do not go looking for another finance provider. They reach out when cash feels uncertain, payroll creates risk, or growth exposes a setup that cannot keep up.</p></div><div className="trigger-list">{triggers.map((item, index) => <article className="reveal" key={item}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item}</h3><i>{index < 4 ? 'REVIEW' : 'GROWTH'}</i></article>)}</div></div></section>

        <section className="difference section-shell"><SectionMarker index="09">Why owners choose us</SectionMarker><div className="split-heading reveal"><h2>You do not need another dashboard to manage. <em>You need the work handled.</em></h2><p>We handle the recurring finance work, make the reports easy to use, and stay accountable for what happens next.</p></div><div className="difference-table reveal">{[['Done-for-you execution','We do the recurring finance work, not just provide tools.'],['Restaurant-native knowledge','Sales, labor, tips, vendors, tight margins, and weekly decisions shape the workflow.'],['One accountable relationship','Responsibilities, review cadence, and next actions stay visible.'],['Information while it matters','We reduce the delay between an event and the operator understanding its impact.']].map(([title, copy], index) => <div key={title}><span>0{index + 1}</span><strong>{title}</strong><p>{copy}</p><i>●</i></div>)}</div></section>

        <section className="offers band-dark" id="pricing"><div className="section-shell"><SectionMarker index="10">Pricing / ways to work together</SectionMarker><div className="split-heading reveal"><h2>A finance team <mark>without the full-time hire.</mark></h2><p>Every relationship begins with the Financial Control Review. Choose a starting scope, then let the realities of your operation shape the final engagement. It is an outsourced restaurant finance function—not another tool for your team to maintain.</p></div><article className="review-offer reveal"><span>Start with a clear picture</span><h3>Financial Control Review</h3><p>We look at your books, systems, payroll and tip process, cash visibility, and reporting routine. You leave knowing where the gaps are, what they are costing you, and what it will take to fix them.</p><a className="button button-ink" href="#review">Start with a review <span>↗</span></a></article><div className="offer-grid">{offers.map(([title, price, audience, copy], index) => <article className={`reveal offer-card-${title.toLowerCase()}`} key={title}><span>0{index + 1}</span><h3>Ready Margin {title}</h3><strong className="offer-price">{price}</strong><b className="offer-audience">{audience}</b><p>{copy}</p><a href="#review">Talk through fit <span>↗</span></a></article>)}</div><p className="pricing-note">Final scope depends on your locations, entities, payroll complexity, transaction volume, reporting needs, integrations, and any clean-up required.</p></div></section>

        <section className="about section-shell" id="about"><SectionMarker index="11">Built from restaurant operations</SectionMarker><div className="about-grid reveal"><div><h2>The finance function we wanted when we were operating restaurants.</h2><p>Ready Margin grew from the problems restaurant operators know firsthand: late reporting, payroll and tip errors, cash uncertainty, and finance providers who do not understand the pace of the operation. We combine recurring execution, clear ownership, and plain-English interpretation so financial work supports the operation instead of becoming another burden on it.</p></div><div className="operating-standard"><span>OPERATING STANDARD</span>{['Named finance ownership','Defined response standards','Monthly close rhythm','Clear review cadence','Escalation path','Plain-English reporting'].map(item => <p key={item}><i>✓</i>{item}</p>)}</div></div></section>

        <section className="faq section-shell" id="faq"><SectionMarker index="12">Questions operators ask</SectionMarker><div className="split-heading reveal"><h2>Clear answers before <em>the first conversation.</em></h2><p>We keep the model direct. If your question is not here, bring it to the Financial Control Review.</p></div><div className="faq-list reveal">{faqs.map(([question, answer], index) => <details key={question}><summary><span>{String(index + 1).padStart(2, '0')}</span><strong>{question}</strong><i aria-hidden="true">+</i></summary><p>{answer}</p></details>)}</div></section>

        <section className="review band-dark" id="review"><div className="section-shell review-grid"><div className="review-copy reveal"><SectionMarker index="13">Financial Control Review</SectionMarker><h2>Find the gaps before they become surprises.</h2><p>Tell us what is going on. We will help you see what is missing, what needs fixing, and whether Ready Margin is the right fit.</p><div className="margo-ready"><img src="/Ready_Margin_Margo_State_Ready.svg" alt="Margo ready to guide the Financial Control Review" /><div><span>MARGO / READY</span><strong>Bring the messy questions. We will help organize the next step.</strong></div></div></div><form className="review-form" onSubmit={handleSubmit} noValidate><div className="form-intro"><span>CONTROL REVIEW / INTAKE</span><strong>About your restaurant</strong></div><label>Full name<input name="name" autoComplete="name" required /></label><label>Work email<input name="email" type="email" autoComplete="email" required /></label><label>Phone<input name="phone" type="tel" autoComplete="tel" required /></label><label>Restaurant or group name<input name="company" autoComplete="organization" required /></label><label>Number of locations<select name="locations" required defaultValue=""><option value="" disabled>Select</option><option>1 location</option><option>2–3 locations</option><option>4–5 locations</option><option>6+ locations</option></select></label><label>Annual revenue range<select name="revenue" required defaultValue=""><option value="" disabled>Select</option><option>Under $1M</option><option>$1M–$3M</option><option>$3M–$10M</option><option>$10M+</option><option>Prefer not to say</option></select></label><label>Current accounting setup<select name="setup" required defaultValue=""><option value="" disabled>Select</option><option>Owner-managed</option><option>Bookkeeper</option><option>Accounting firm</option><option>Internal team</option><option>Mixed or unclear</option></select></label><fieldset><legend>Where do you need the most help?</legend>{['Accounting and close','Payroll coordination','Reporting and cash visibility','Multi-location finance','Financial guidance'].map(item => <label className="check" key={item}><input type="checkbox" name="needs" value={item} /><span>{item}</span></label>)}</fieldset><fieldset className="meeting-fieldset"><legend>Optional: schedule a conversation</legend><label className="check meeting-toggle"><input type="checkbox" name="meetingRequested" value="yes" onChange={(event) => setMeetingRequested(event.currentTarget.checked)} /><span>I’d like to suggest a meeting time.</span></label><div className="meeting-fields"><label>Preferred date<input name="meetingDate" type="date" required={meetingRequested} /></label><label>Preferred time<input name="meetingTime" type="time" required={meetingRequested} /></label></div><input type="hidden" name="timezone" value={timezone} /><p className="consent-note">We’ll check the requested time, create a calendar invitation if it is available, and email the event link to you and info@gsmnyc.com.</p></fieldset><fieldset className="consent-fieldset"><legend>Permission to follow up</legend><label className="check consent-check"><input type="checkbox" name="consent" value="yes" required /><span>I agree that Ready Margin may use the details I submit to respond to my Financial Control Review request by email or phone. I can withdraw this permission at any time by emailing contact@readymargin.com.</span></label><label className="check consent-check"><input type="checkbox" name="marketingOptIn" value="yes" /><span>Optional: I’d like occasional Ready Margin updates by email. I can unsubscribe at any time.</span></label><p className="consent-note">We use these details to respond to your request and provide follow-up. Optional marketing permission is separate.</p></fieldset><label className="field-full">What made you look for help now?<textarea name="trigger" rows={4} required /></label><button className="button button-lime form-submit" type="submit">Request My Financial Control Review <span>↗</span></button><p className="privacy-note">Your details go through the secure review workflow. If the server connection is still being completed, your email app opens as a fallback.</p>{formState === 'error' && <p className="form-message error" role="alert">Please complete the required fields before continuing.</p>}{formState === 'ready' && <p className="form-message success" role="status">Thanks — your request is in. We’ll contact you shortly.</p>}{formState === 'fallback' && <p className="form-message success" role="status">Your email draft is ready. Send it from your email app to complete the request.</p>}</form></div></section>
      </div>

      <aside className={`margo-guide ${celebrate ? 'is-celebrating' : ''} ${scrollProgress >= 85 ? 'is-powered' : ''} ${scrollProgress >= 100 ? 'is-super-saiyan' : ''} ${footerVisible ? 'is-footer-visible' : ''} ${guideDragging ? 'is-dragging' : ''}`} style={{ '--drag-x': `${guideOffset.x}px`, '--drag-y': `${guideOffset.y}px`, '--progress': `${footerVisible ? 100 : scrollProgress}%` } as React.CSSProperties} onPointerDown={startGuideDrag} aria-live="polite" aria-label="Margo page guide"><img src={celebrate ? '/Ready_Margin_Margo_State_Success.svg' : scrollProgress >= 100 ? '/ready-margin-margo-animated.svg' : scrollProgress >= 85 ? '/Ready_Margin_Margo_State_Success.svg' : guideStops[guideIndex][4]} alt={celebrate ? 'Margo is happy to help and checking your review' : scrollProgress >= 100 ? 'Margo is fully powered at 100 percent' : scrollProgress >= 85 ? 'Margo is fully powered and ready' : `Margo: ${guideStops[guideIndex][1]}`} /><div className="guide-copy"><span>{celebrate ? 'MARGO / HAPPY TO HELP' : scrollProgress >= 100 ? 'MARGO / SUPER SAIYAN' : scrollProgress >= 85 ? 'MARGO / FULL READINESS' : `MARGO / ${String(guideIndex + 1).padStart(2, '0')} OF ${String(guideStops.length).padStart(2, '0')} · ${guideStops[guideIndex][3].toUpperCase()}`}</span><strong>{celebrate ? 'We are happy to help.' : scrollProgress >= 100 ? 'Power fully charged.' : scrollProgress >= 85 ? 'Ready for the next move.' : guideStops[guideIndex][1]}</strong><p>{celebrate ? 'I’m checking your review details now.' : scrollProgress >= 100 ? 'Margo has reached super saiyan readiness.' : scrollProgress >= 85 ? 'Margo is fully powered and your path is clear.' : guideStops[guideIndex][2]}</p></div><div className="guide-progress" aria-label={`Page progress ${footerVisible ? 100 : scrollProgress}%`}><span style={{ width: `${footerVisible ? 100 : scrollProgress}%` }} /><b>{footerVisible ? 100 : scrollProgress}%</b></div></aside>
      <div className={`confetti ${celebrate ? 'is-active' : ''}`} aria-hidden="true">{Array.from({ length: 22 }, (_, index) => <i key={index} style={{ left: `${(index * 43) % 100}%`, animationDelay: `${(index % 8) * 55}ms`, ['--i' as string]: index } as React.CSSProperties} />)}</div>
      <div className="ambient-field" aria-hidden="true" />
      <div className={`cursor-orb ${cursorMode === 'interactive' ? 'is-active' : ''}`} aria-hidden="true" style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }} />
      <div className={`cursor-aura ${cursorMode === 'interactive' ? 'is-active' : ''}`} aria-hidden="true" style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }} />
      <footer className="site-footer" id="contact"><div className="footer-main"><a href="#top"><Logo /></a><h2>Clear numbers. Accountable people. Fewer financial surprises.</h2></div><div className="footer-links"><div><span>EXPLORE</span><a href="#services">Services</a><a href="#roadmap">What’s next</a><a href="#process">How it works</a><a href="#pricing">Pricing</a><a href="#fit">Who we help</a></div><div><span>START HERE</span><a href="#review">Financial Control Review</a><a href="#about">About Ready Margin</a></div><div className="footer-contact"><span>CONTACT US</span><i className="footer-contact-rule" aria-hidden="true" /><a className="footer-email" href="mailto:contact@readymargin.com">contact@readymargin.com</a><a href="https://in.linkedin.com/in/gursimarsandhu" target="_blank" rel="noreferrer">LinkedIn ↗</a><i className="footer-contact-rule" aria-hidden="true" /><span className="footer-coming-soon">Instagram / coming soon</span><span className="footer-coming-soon">Facebook / coming soon</span></div></div><div className="footer-bottom"><a href="mailto:contact@readymargin.com">© 2026 Ready Margin</a><span>Restaurant finance, run for you.</span><a href="https://in.linkedin.com/in/gursimarsandhu" target="_blank" rel="noreferrer">Made by SIM ↗</a></div></footer>
    </main>
  );
}
