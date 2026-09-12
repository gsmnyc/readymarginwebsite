"use client";

import { useState } from "react";

export function Timeline({
  steps,
  pinned = false,
}: {
  steps: { title: string; body: string }[];
  pinned?: boolean;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="timeline" data-layout={pinned ? "focused" : "standard"}>
      <div className="timeline-nav">
        <div className="timeline-progress" />
        {steps.map((step, index) => (
          <button
            key={step.title}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            className={index === active ? "active" : ""}
          >
            <span>0{index + 1}</span>
            {step.title}
          </button>
        ))}
      </div>
      <div className="timeline-copy">
        <p className="eyebrow">The Ready Rhythm</p>
        {steps.map((step, index) => (
          <section
            key={step.title}
            className={index === active ? "current" : ""}
          >
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </section>
        ))}
        <p className="caption">
          A recurring managed service rhythm. Cadence is agreed for your
          restaurant.
        </p>
      </div>
    </div>
  );
}
