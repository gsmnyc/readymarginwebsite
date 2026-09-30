"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAnimate, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion-tokens";
import { lightMotion, motionAllowed } from "./motion-utils";

const revealTargets = [
  ".fit-note", ".section-copy > section", ".capability-grid > a",
  ".audience-grid > a", ".rhythm-sequence > li", ".rhythm-return",
  ".stream-detail", ".pricing-grid > article", ".pricing-matrix",
  ".article-grid > *", ".related", ".resource-links > a", ".case-card",
  ".cta-inner", ".lead-form", ".diagnostic", ".home-responsibility > article",
  ".home-service-index > article", "[data-motion-card]", ".home-cash-copy", ".cash-review",
  ".home-proof li", ".home-finish-copy",
].join(",");

/* Enhance offscreen content once. The server always renders readable content. */
export function PageChoreography() {
  const path = usePathname();
  const [scope, animate] = useAnimate();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !motionAllowed() || lightMotion()) return;
    const animations = new Set<ReturnType<typeof animate>>();
    const seen = new WeakSet<Element>();
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stopped = false;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || stopped) return;
        observer.unobserve(entry.target);
        const element = entry.target as HTMLElement;
        if (element.contains(document.activeElement)) return;
        const siblings = Array.from(element.parentElement?.children ?? []).filter(child => child.matches(revealTargets));
        const position = Math.max(0, siblings.indexOf(element));
        const control = animate(element, {
          opacity: [0.7, 1],
          transform: [`translateY(${motionTokens.distance.sm}px)`, "translateY(0px)"],
        }, {
          duration: motionTokens.duration.normal,
          delay: Math.min(position, 3) * motionTokens.stagger,
          ease: motionTokens.easing.smooth,
        });
        animations.add(control);
        control.then(() => animations.delete(control));
      });
    }, { rootMargin: "0px 0px -24px 0px", threshold: 0.05 });

    const register = () => document.querySelectorAll<HTMLElement>(revealTargets).forEach(element => {
      if (seen.has(element)) return;
      seen.add(element);
      if (element.getBoundingClientRect().top >= window.innerHeight) observer.observe(element);
    });
    register();
    // Filtered articles and route content can mount after the initial effect.
    const content = document.querySelector("main");
    const changes = new MutationObserver(register);
    if (content) changes.observe(content, { childList: true, subtree: true });

    const stop = () => {
      stopped = true;
      observer.disconnect();
      changes.disconnect();
      animations.forEach(control => control.complete());
      animations.clear();
    };
    const keyboard = (event: KeyboardEvent) => { if (event.key === "Tab") stop(); };
    window.addEventListener("keydown", keyboard);
    window.addEventListener("rm-motion-change", stop);
    preference.addEventListener("change", stop);
    return () => {
      stop();
      window.removeEventListener("keydown", keyboard);
      window.removeEventListener("rm-motion-change", stop);
      preference.removeEventListener("change", stop);
    };
  }, [path, animate, reduced]);

  return <div ref={scope} className="reading-progress" aria-hidden="true" />;
}
