"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { lightMotion, motionAllowed } from "./motion-utils";

const revealTargets =
  ".section-heading h2,.problem h2,.review-scene h2,.experience-section h2,.cta-inner h2,.section-copy section h2,.faq-section h2,.fit-note h2,.section-heading>.eyebrow,.section-heading>div>.eyebrow,.review-card dl>div,.cap-top,.audience-grid>a>.eyebrow,.section-copy section li,.related a,.resource-links a";

export function PageChoreography() {
  const path = usePathname();

  useEffect(() => {
    if (!motionAllowed() || lightMotion()) return;

    const animations = new Set<Animation>();
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const animate = (element: HTMLElement) => {
      const animation = element.animate(
        [
          { transform: "translateY(12px)", opacity: 0.82 },
          { transform: "translateY(0)", opacity: 1 },
        ],
        {
        duration: 340,
        easing: "cubic-bezier(.2,.8,.2,1)",
        fill: "backwards",
        },
      );
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);

          animate(element);
        }
      },
      { rootMargin: "0px 0px -7% 0px" },
    );

    document.querySelectorAll<HTMLElement>(revealTargets).forEach((element) => {
      if (element.getBoundingClientRect().top >= window.innerHeight * 0.9) observer.observe(element);
    });

    let stopped = false;
    const stop = () => {
      if (stopped) return;
      stopped = true;
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Tab") stop();
    };

    window.addEventListener("keydown", keyboard);
    preference.addEventListener("change", stop);
    return () => {
      stop();
      window.removeEventListener("keydown", keyboard);
      preference.removeEventListener("change", stop);
    };
  }, [path]);

  return <div className="reading-progress" aria-hidden="true" />;
}
