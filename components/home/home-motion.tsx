"use client";

import { useEffect } from "react";

/** Progressive enhancement only: the complete story is readable without this module. */
export function HomeMotion() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const device = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const animations = new Set<Animation>();
    let observer: IntersectionObserver | undefined;
    const stop = () => { observer?.disconnect(); animations.forEach(animation => animation.cancel()); animations.clear(); };
    const start = () => {
      stop();
      if (reduced.matches || device.connection?.saveData || (device.deviceMemory && device.deviceMemory < 4) || !Element.prototype.animate) return;
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer?.unobserve(entry.target);
          const elements = entry.target.matches("[data-story-chapter]") ? entry.target.querySelectorAll(".working-paper, .paper-action") : [entry.target];
          elements.forEach((element, index) => {
            const animation = element.animate([{ transform: "translateY(20px)", opacity: .65 }, { transform: "translateY(0)", opacity: 1 }], { duration: 400, delay: index * 100, easing: "cubic-bezier(.2,.7,.3,1)" });
            animations.add(animation);
            animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
          });
          entry.target.querySelectorAll<SVGPathElement>(".service-thread, .cash-thread").forEach(path => {
            const length = path.getTotalLength();
            const animation = path.animate([{ strokeDasharray: `${length}`, strokeDashoffset: length }, { strokeDasharray: `${length}`, strokeDashoffset: 0 }], { duration: 400, easing: "ease-out" });
            animations.add(animation);
            animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
          });
        }
      }, { threshold: .2 });
      document.querySelectorAll(".restaurant-illustration, [data-story-chapter], .cash-pressure").forEach(element => observer?.observe(element));
    };
    start();
    reduced.addEventListener("change", start);
    return () => { stop(); reduced.removeEventListener("change", start); };
  }, []);
  return null;
}
