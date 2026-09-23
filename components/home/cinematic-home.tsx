"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import Link from "@/components/site/link";
import { ArrowUpRight } from "lucide-react";
import { home } from "@/content/home";

type Props = {
  cta: string;
  reviewOffer: string;
  email: string;
};

const films = [
  { src: "/media/ready-margin-01.mp4", poster: "/brand/restaurant-pass-1536.webp" },
  { src: "/media/ready-margin-02.mp4", poster: "/brand/restaurant-pass-1536.webp" },
  { src: "/media/ready-margin-03.mp4", poster: "/brand/restaurant-team-1536.webp" },
];

const capabilities = [
  ["Accounting & close", "/restaurant-accounting-services", "Books, reconciliations, payables and month-end handled with a clear owner."],
  ["Payroll & tips", "/restaurant-payroll-services", "Hours, corrections, payroll handoffs and tip workflows connected to restaurant reality."],
  ["Food cost & vendors", "/restaurant-food-cost-management", "Price changes, inventory, recipe costs and supplier issues made visible before they drift."],
  ["Reporting & cash", "/restaurant-cfo-services", "Timely P&L, cash visibility and interpretation that helps you decide what happens next."],
  ["Labor workflows", "/restaurant-labor-cost-management", "Schedules, attendance and labor information reviewed before they become payroll surprises."],
  ["Turnaround support", "/restaurant-turnaround-consulting", "A calm financial picture, practical priorities and follow-through when pressure is building."],
] as const;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function CinematicHome({ cta, reviewOffer, email }: Props) {
  const filmRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const systemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || root.dataset.motion === "off";
    if (reduce) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const section = filmRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / travel);

      videoRefs.current.forEach((video, index) => {
        if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
        const start = index / films.length;
        const end = (index + 1) / films.length;
        const local = clamp((progress - start) / (end - start));
        const target = local * Math.max(0.01, video.duration - 0.04);
        if (!video.seeking && Math.abs(video.currentTime - target) > 0.035) {
          try { video.currentTime = target; } catch {}
        }

        const feather = 0.035;
        let opacity = 0;
        if (progress >= start && progress <= end) opacity = 1;
        if (index > 0 && progress > start - feather && progress < start + feather) {
          opacity = clamp((progress - (start - feather)) / (feather * 2));
        }
        if (index < films.length - 1 && progress > end - feather && progress < end + feather) {
          opacity = 1 - clamp((progress - (end - feather)) / (feather * 2));
        }
        if (index === 0 && progress < start + feather) opacity = 1;
        if (index === films.length - 1 && progress > end - feather) opacity = 1;
        video.style.opacity = String(opacity);
      });

      const centers = [0.08, 0.33, 0.62, 0.91];
      copyRefs.current.forEach((node, index) => {
        if (!node) return;
        const strength = clamp(1 - Math.abs(progress - centers[index]) / 0.17);
        node.style.opacity = String(strength);
        node.style.transform = `translate3d(0,${(1 - strength) * 28}px,0)`;
        node.style.filter = `blur(${(1 - strength) * 5}px)`;
        node.style.pointerEvents = strength > 0.55 ? "auto" : "none";
      });

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleY(${Math.max(0.02, progress)})`;
      }
    };

    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".rm-reveal"));
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.18 },
    );
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const system = systemRef.current;
    if (!system || window.matchMedia("(hover: none)").matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      system.style.setProperty("--rm-tilt-x", `${(-y * 5).toFixed(2)}deg`);
      system.style.setProperty("--rm-tilt-y", `${(x * 7).toFixed(2)}deg`);
      raf = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      const r = system.getBoundingClientRect();
      tx = clamp((event.clientX - r.left) / r.width, 0, 1) * 2 - 1;
      ty = clamp((event.clientY - r.top) / r.height, 0, 1) * 2 - 1;
    };
    const leave = () => { tx = 0; ty = 0; };
    system.addEventListener("pointermove", move);
    system.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      system.removeEventListener("pointermove", move);
      system.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <section ref={filmRef} className="rm-film" aria-label="Ready Margin restaurant finance story">
        <div className="rm-film-sticky">
          <div className="rm-film-media" aria-hidden="true">
            {films.map((film, index) => (
              <video
                key={film.src}
                ref={node => { videoRefs.current[index] = node; }}
                className="rm-film-video"
                muted
                playsInline
                preload="auto"
                poster={film.poster}
                src={film.src}
              />
            ))}
            <div className="rm-film-scrim" />
            <div className="rm-film-grain" />
          </div>

          <div className="rm-film-corners" aria-hidden="true"><i /><i /></div>

          <div className="rm-film-copy">
            <div ref={node => { copyRefs.current[0] = node; }} className="rm-film-message rm-film-message--hero">
              <p className="eyebrow">Managed restaurant finance</p>
              <h1>Restaurant finance,<br /><span>run for you.</span></h1>
              <p>Ready Margin handles the recurring work behind the restaurant, then helps you understand what changed and what happens next.</p>
              <div className="rm-film-actions">
                <Link className="rm-gold-button" href="/book-a-review" data-cta>{cta}<ArrowUpRight size={18} /></Link>
                <Link className="rm-film-link" href="#work">See the work <span>↓</span></Link>
              </div>
            </div>

            <div ref={node => { copyRefs.current[1] = node; }} className="rm-film-message">
              <p className="eyebrow">The work behind it</p>
              <h2>It should not keep<br />landing back on you.</h2>
              <p>Hours. Tips. Supplier bills. Books. Cash. Reporting. Each question needs an owner, evidence and a next check.</p>
            </div>

            <div ref={node => { copyRefs.current[2] = node; }} className="rm-film-message rm-film-message--right">
              <p className="eyebrow">Run. Explain. Improve.</p>
              <h2>Separate inputs.<br /><span>One clear picture.</span></h2>
              <p>We connect recurring finance and operating work so the restaurant is not left stitching the answer together.</p>
            </div>

            <div ref={node => { copyRefs.current[3] = node; }} className="rm-film-message rm-film-message--final">
              <p className="eyebrow">Back to the good part</p>
              <h2>Clear numbers.<br />Accountable people.<br /><span>Fewer financial surprises.</span></h2>
            </div>
          </div>

          <div className="rm-film-progress" aria-hidden="true">
            <span>01</span><div><i ref={progressRef} /></div><span>03</span>
          </div>
        </div>
      </section>

      <section id="work" className="rm-work">
        <div className="rm-shell">
          <div className="rm-section-intro rm-reveal">
            <p className="eyebrow">What comes off your desk</p>
            <h2>The finance function<br />behind the restaurant.</h2>
            <p>Start with the work you need handled. Agree the scope together. Ready Margin takes responsibility for the recurring work, not another dashboard for you to operate.</p>
          </div>
          <div className="rm-work-index">
            {home.services.map((service, index) => (
              <article className="rm-work-row rm-reveal" key={service.title}>
                <span className="rm-row-number">0{index + 1}</span>
                <div><h3>{service.title}</h3><p>{service.description}</p></div>
                <nav aria-label={service.title}>
                  {service.links.map(link => <Link key={link.href} href={link.href}>{link.label}<ArrowUpRight size={16} /></Link>)}
                </nav>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rm-system-section">
        <div className="rm-shell rm-system-layout">
          <div className="rm-system-copy rm-reveal">
            <p className="eyebrow">One accountable relationship</p>
            <h2>Scattered work becomes<br /><span>a clear next action.</span></h2>
            <p>Restaurant activity, financial information and human follow-through should meet in the same place. The point is not more software. The point is knowing what changed, who owns it and what happens next.</p>
            <Link className="rm-text-link" href="/how-it-works">See how Ready Margin works <ArrowUpRight size={17} /></Link>
          </div>

          <div ref={systemRef} className="rm-system-3d" aria-label="Three restaurant finance workstreams converging on a clear next action">
            <div className="rm-system-orbit" aria-hidden="true" />
            <div className="rm-plane rm-plane--people"><span>01</span><strong>People & shifts</strong><small>Hours</small></div>
            <div className="rm-plane rm-plane--costs"><span>02</span><strong>Costs & cash</strong><small>Costs</small></div>
            <div className="rm-plane rm-plane--books"><span>03</span><strong>Books & reporting</strong><small>Books</small></div>
            <div className="rm-system-focus"><i /><span>Next action</span></div>
          </div>
        </div>
      </section>

      <section className="rm-rhythm">
        <div className="rm-shell">
          <p className="eyebrow rm-reveal">The Ready Margin rhythm</p>
          <div className="rm-rhythm-grid">
            {[
              ["01", "RUN", "We handle the agreed recurring financial and operational work."],
              ["02", "EXPLAIN", "We turn activity and financial information into a picture you can actually use."],
              ["03", "IMPROVE", "We recommend the next move and keep the follow-through moving."],
            ].map(item => (
              <article className="rm-rhythm-card rm-reveal" key={item[1]}>
                <span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rm-capabilities">
        <div className="rm-shell">
          <div className="rm-section-intro rm-reveal">
            <p className="eyebrow">The work</p>
            <h2>One team across the numbers<br />that keep moving every week.</h2>
          </div>
          <div className="rm-cap-grid">
            {capabilities.map(([title, href, body], index) => (
              <Link className="rm-cap-card rm-reveal" href={href} key={href}>
                <span>0{index + 1}</span><h3>{title}</h3><p>{body}</p><ArrowUpRight aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rm-who">
        <div className="rm-who-image">
          <Image src="/brand/restaurant-team-1536.webp" alt="Illustrative restaurant operators reviewing work together before service" fill sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
        <div className="rm-who-copy rm-reveal">
          <p className="eyebrow">Who it is for</p>
          <h2>Too big for DIY.<br />Not ready for a full internal finance team.</h2>
          <p>Ready Margin is built for restaurant owners and growing groups who need the work owned, the numbers explained and the next step followed through.</p>
          <div className="rm-who-links">
            <Link href="/who-we-help">Independent restaurants <ArrowUpRight size={16} /></Link>
            <Link href="/multi-location-restaurant-finance">Multi-location groups <ArrowUpRight size={16} /></Link>
            <Link href="/restaurant-turnaround-consulting">Restaurants under pressure <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="rm-final">
        <Image src="/brand/restaurant-pass-1536.webp" alt="" fill sizes="100vw" />
        <div className="rm-final-overlay" />
        <div className="rm-shell rm-final-inner rm-reveal">
          <p className="eyebrow">Back to the good part</p>
          <h2>You focus on the restaurant.<br /><span>We handle what keeps it running behind the scenes.</span></h2>
          <p>{reviewOffer}</p>
          <div className="rm-final-actions">
            <Link className="rm-gold-button" href="/book-a-review" data-cta>{cta}<ArrowUpRight size={18} /></Link>
            <a href={"mailto:" + email}>{email}</a>
          </div>
        </div>
      </section>
    </>
  );
}
