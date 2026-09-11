"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/site/link";
import type { Settings } from "@/lib/content";

export function OperatingDesk({ chapters }: { chapters: Settings["workingDay"] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLElement>(null);
  const chapter = chapters[active];

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let inView = false;
    const visibility = () => {
      element.dataset.visible = String(inView && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      visibility();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return (
    <section ref={root} className="operating-desk container" data-paused={paused} aria-labelledby="desk-title">
      <div className="desk-topline">
        <p className="eyebrow" id="desk-title">A restaurant day, behind the scenes</p>
        <button className="desk-pause" onClick={() => setPaused(!paused)} aria-pressed={paused}>
          {paused ? "Resume background motion" : "Pause background motion"}
          <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
        </button>
      </div>
      <div className="desk-phases" aria-label="Explore a restaurant day">
        {chapters.map((item, index) => (
          <button key={item.phase} aria-pressed={active === index} aria-controls="desk-chapter" onClick={() => setActive(index)}>
            <span className="desk-phase-number" aria-hidden="true">0{index + 1}</span>
            <span>{item.phase}</span>
            <span className="desk-phase-arrow" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div id="desk-chapter" className="desk-chapter" key={active}>
        <div className="desk-story">
          <p className="eyebrow">{chapter.phase}</p>
          <h2>{chapter.heading}</h2>
          <p>{chapter.action}</p>
          <Link href={chapter.href} className="text-link">{chapter.link} <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="desk-work" aria-label="From record to next step">
          <svg className="desk-route" viewBox="0 0 400 360" fill="none" aria-hidden="true">
            <path d="M45 50H320Q350 50 350 80V280Q350 310 320 310H80Q50 310 50 280V210" />
            <path className="desk-tracer" d="M45 50H320Q350 50 350 80V280Q350 310 320 310H80Q50 310 50 280V210" pathLength="100" />
          </svg>
          <div className="desk-record">
            <span className="eyebrow">The record</span>
            <strong>{chapter.record}</strong>
            <span className="desk-record-lines" aria-hidden="true"><i /><i /><i /></span>
          </div>
          <div className="desk-question"><span aria-hidden="true">?</span><p>{chapter.question}</p></div>
          <div className="desk-handoff">
            <span className="eyebrow">The next step</span>
            <strong>{chapter.handoff}</strong>
            <span className="desk-check" aria-hidden="true">↗</span>
          </div>
        </div>
      </div>
      <p className="desk-caption">Illustrative workflow. The work and approvals depend on your agreed service scope.</p>
    </section>
  );
}
