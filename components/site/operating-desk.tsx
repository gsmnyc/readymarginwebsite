"use client";

import { useState } from "react";
import Link from "@/components/site/link";
import type { Settings } from "@/lib/content";

export function OperatingDesk({ chapters }: { chapters: Settings["workingDay"] }) {
  const [active, setActive] = useState(0);
  const chapter = chapters[active];

  return (
    <section className="operating-desk container" aria-labelledby="desk-title">
      <div className="desk-topline">
        <p className="eyebrow" id="desk-title">A restaurant day, behind the scenes</p>
        <span className="caption">Three moments. One connected operation.</span>
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
      <div id="desk-chapter" className="desk-chapter" role="region" aria-label={chapter.phase}>
        <div className="desk-story">
          <p className="eyebrow">{chapter.phase}</p>
          <h2>{chapter.heading}</h2>
          <p>{chapter.action}</p>
          <Link href={chapter.href} className="text-link">{chapter.link} <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="desk-work" aria-label="From record to next step">
          <div className="desk-record">
            <span className="eyebrow">Working note / 0{active + 1}</span>
            <strong>{chapter.record}</strong>
            <span className="desk-record-lines" aria-hidden="true"><i /><i /><i /></span>
          </div>
          <div className="desk-question"><span className="eyebrow">Check</span><p>{chapter.question}</p></div>
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
