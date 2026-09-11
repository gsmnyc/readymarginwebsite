"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { lightMotion, motionAllowed } from "./motion-utils";

if (typeof window !== "undefined" && typeof document !== "undefined")
  gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Timeline({
  steps,
  pinned = false,
}: {
  steps: { title: string; body: string }[];
  pinned?: boolean;
}) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const manual = useRef(false);
  const lastStep = useRef(0);

  useGSAP(
    () => {
      if (!motionAllowed() || lightMotion()) return;
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.to(".timeline-progress", {
            scaleY: 1,
            transformOrigin: "top",
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: pinned ? "top 120px" : "top 75%",
              end: pinned ? "+=600" : "bottom 30%",
              pin: pinned,
              scrub: true,
              onUpdate: (self) => {
                const step = Math.min(
                  steps.length - 1,
                  Math.floor(self.progress * steps.length),
                );
                if (!manual.current && step !== lastStep.current) {
                  lastStep.current = step;
                  setActive(step);
                }
              },
            },
          });
        },
      );
      const stop = (event: KeyboardEvent) => {
        if (event.key === "Tab") media.revert();
      };
      window.addEventListener("keydown", stop);
      return () => {
        media.revert();
        window.removeEventListener("keydown", stop);
      };
    },
    { scope: root },
  );

  return (
    <div className="timeline" ref={root}>
      <div className="timeline-nav">
        <div className="timeline-progress" />
        {steps.map((step, index) => (
          <button
            key={step.title}
            aria-pressed={active === index}
            onClick={() => {
              manual.current = true;
              setActive(index);
            }}
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
