"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { lightMotion, motionAllowed } from "./motion-utils";

const headings =
  ".hero-grid h1,.page-hero h1,.section-heading h2,.problem h2,.review-scene h2,.experience-section h2,.cta-inner h2,.section-copy section h2,.faq-section h2,.fit-note h2";
const details =
  ".section-heading>.eyebrow,.section-heading>div>.eyebrow,.review-card dl>div,.cap-top,.audience-grid>a>.eyebrow,.section-copy section li,.related a,.resource-links a";

function prepareHeading(element: HTMLElement) {
  const original = [...element.childNodes];
  const accessibleName = element.getAttribute("aria-label");
  const label = element.innerText;
  const copy = element.cloneNode(true) as HTMLElement;
  const walker = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  const words: HTMLElement[] = [];

  for (const node of nodes) {
    const fragment = document.createDocumentFragment();
    for (const part of (node.textContent || "").split(/(\s+)/)) {
      if (!part.trim()) {
        fragment.append(part);
        continue;
      }
      const mask = document.createElement("span");
      mask.className = "text-reveal-word";
      const ink = document.createElement("span");
      ink.className = "text-reveal-ink";
      ink.textContent = part;
      mask.appendChild(ink);
      fragment.appendChild(mask);
      words.push(ink);
    }
    node.replaceWith(fragment);
  }

  const visual = document.createElement("span");
  visual.setAttribute("aria-hidden", "true");
  Array.from(copy.childNodes).forEach((node) => visual.appendChild(node));
  element.setAttribute("aria-label", label);
  element.replaceChildren(visual);

  return {
    words,
    restore: () => {
      element.replaceChildren(...original);
      if (accessibleName === null) element.removeAttribute("aria-label");
      else element.setAttribute("aria-label", accessibleName);
    },
  };
}

export function PageChoreography() {
  const path = usePathname();

  useEffect(() => {
    if (!motionAllowed() || lightMotion()) return;

    const animations = new Set<Animation>();
    const restores: (() => void)[] = [];
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const animate = (element: HTMLElement, keyframes: Keyframe[], delay = 0) => {
      const animation = element.animate(keyframes, {
        duration: 620,
        delay,
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "backwards",
      });
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);

          if (element.matches(headings)) {
            const { words, restore } = prepareHeading(element);
            restores.push(restore);
            const positions = words.map((word) => word.offsetTop);
            const lines = [...new Set(positions)];
            words.forEach((word, index) =>
              animate(
                word,
                [
                  { transform: "translateY(102%)" },
                  { transform: "translateY(0)" },
                ],
                lines.indexOf(positions[index]) * 70 + (index % 4) * 14,
              ),
            );
          } else {
            animate(element, [
              { transform: "translateY(10px)", opacity: 0.72 },
              { transform: "translateY(0)", opacity: 1 },
            ]);
          }
        }
      },
      { rootMargin: "0px 0px -7% 0px" },
    );

    document.querySelectorAll<HTMLElement>(headings + "," + details).forEach((element) => {
      if (element.getBoundingClientRect().top >= window.innerHeight * 0.9) observer.observe(element);
    });

    let stopped = false;
    const stop = () => {
      if (stopped) return;
      stopped = true;
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      restores.forEach((restore) => restore());
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
