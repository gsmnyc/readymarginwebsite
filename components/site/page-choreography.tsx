"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { lightMotion, motionAllowed } from "./motion-utils";

/*
 * Shared, semantic blocks keep motion consistent across every public template.
 * Content is never hidden in CSS: this remains a progressive enhancement.
 */
const revealTargets = [
  ".fit-note",
  ".section-copy > section",
  ".capability-grid > a",
  ".audience-grid > a",
  ".review-card",
  ".operator-photo",
  ".rhythm-sequence > li",
  ".rhythm-return",
  ".stream-rail > a",
  ".stream-detail",
  ".pricing-grid > article",
  ".pricing-matrix",
  ".article-browser > .filter-bar",
  ".article-browser > .caption",
  ".article-browser > .button",
  ".article-browser > .empty-state",
  ".article-browser > .article-directory",
  ".article-grid > *",
  ".related",
  ".resource-links > a",
  ".faq > details",
  ".faq-section > h2",
  ".cta-inner > *",
  ".lead-form > *",
  ".diagnostic > *",
  ".case-card",
  ".home-bridge > .home-wrap > *",
  ".home-work > .home-section-heading > *",
  ".home-service-index > section",
  ".story-introduction > *",
  ".story-chapter > .story-copy",
  ".story-chapter > .working-paper",
  ".story-ending > *",
  ".home-turnaround-layout > *",
  ".home-about > .restaurant-illustration",
  ".home-about-copy > .eyebrow",
  ".home-about-copy > .home-section-heading",
  ".home-context-links > a",
  ".home-faq > div:first-child",
  ".home-finish > .home-wrap > *",
  ".footer-top > *",
  ".footer-grid > *",
  ".footer-bottom",
].join(",");

const visualTargets =
  ".operator-photo,.review-card,.working-paper,.case-card,.pricing-matrix,.restaurant-illustration,.cash-pressure";

const staggerParents =
  ".capability-grid,.audience-grid,.rhythm-sequence,.stream-rail,.pricing-grid,.article-grid,.resource-links,.faq,.home-service-index,.home-context-links,.footer-grid";

export function PageChoreography() {
  const path = usePathname();

  useEffect(() => {
    if (!motionAllowed() || lightMotion() || !("animate" in Element.prototype)) return;

    const animations = new Set<Animation>();
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const play = (
      element: Element,
      frames: Keyframe[],
      options: KeyframeAnimationOptions,
    ) => {
      const animation = element.animate(frames, options);
      animations.add(animation);
      animation.finished.then(
        () => animations.delete(animation),
        () => animations.delete(animation),
      );
      return animation;
    };

    const animate = (element: HTMLElement) => {
      const parent = element.parentElement?.closest(staggerParents);
      const siblings = parent
        ? Array.from(parent.children).filter((child) => child.matches(revealTargets))
        : [];
      const position = Math.max(0, siblings.indexOf(element));
      const delay = Math.min(position % 4, 3) * 65;
      const visual = element.matches(visualTargets);
      play(
        element,
        [
          {
            transform: visual
              ? "translateY(18px) scale(.985)"
              : "translateY(16px)",
            opacity: visual ? 0.42 : 0.58,
          },
          { transform: "translateY(0)", opacity: 1 },
        ],
        {
          duration: visual ? 440 : 380,
          delay,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "backwards",
        },
      );

      if (element.matches(".working-paper")) {
        element.querySelectorAll<HTMLElement>(".paper-action").forEach((part) => {
          play(
            part,
            [
              { transform: "translateX(10px)", opacity: 0.5 },
              { transform: "translateX(0)", opacity: 1 },
            ],
            {
              duration: 420,
              delay: 100,
              easing: "cubic-bezier(.16,1,.3,1)",
              fill: "backwards",
            },
          );
        });
      }

      element.querySelectorAll<SVGPathElement>(".service-thread,.cash-thread").forEach((line) => {
        const length = line.getTotalLength();
        play(
          line,
          [
            { strokeDasharray: `${length}`, strokeDashoffset: length },
            { strokeDasharray: `${length}`, strokeDashoffset: 0 },
          ],
          { duration: 520, easing: "cubic-bezier(.16,1,.3,1)" },
        );
      });
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    document.querySelectorAll<HTMLElement>(revealTargets).forEach((element) => {
      if (element.getBoundingClientRect().top >= window.innerHeight * 0.82) {
        observer.observe(element);
      }
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
