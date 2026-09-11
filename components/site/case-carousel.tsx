"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "@/components/site/link";
import useEmblaCarousel from "embla-carousel-react";
import type { PageSummary } from "@/lib/content";

function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => {
      media.removeEventListener?.("change", update);
    };
  }, []);
  return reduced;
}

export function CaseCarousel({ pages }: { pages: PageSummary[] }) {
  const [ref, api] = useEmblaCarousel({ align: "start", loop: false });
  const [play, setPlay] = useState(false);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotionPreference();

  useEffect(() => {
    if (!api) return;
    const update = () => setActive(api.selectedScrollSnap());
    api.on("select", update);
    return () => {
      api.off("select", update);
    };
  }, [api]);

  useEffect(() => {
    if (!play || reduce || !api) return;
    const timer = setInterval(
      () => (api.canScrollNext() ? api.scrollNext() : api.scrollTo(0)),
      6500,
    );
    return () => clearInterval(timer);
  }, [play, reduce, api]);

  return (
    <section
      className={"case-carousel " + (reduce ? "static-grid" : "")}
      onFocusCapture={() => setPlay(false)}
      onMouseEnter={() => setPlay(false)}
      aria-label="Illustrative workflow examples"
    >
      <div
        className="carousel-viewport"
        ref={ref}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            if (event.key === "ArrowRight") api?.scrollNext();
            else api?.scrollPrev();
          }
        }}
        tabIndex={0}
        aria-label="Workflow cards; use left and right arrow keys"
      >
        <div className="carousel-track">
          {pages
            .filter((page) => page.kind === "case")
            .map((page, index) => (
              <article className="case-card" key={page.path}>
                <div className="case-art" aria-hidden="true">
                  <span>0{index + 1}</span>
                  <Image
                    src={
                      "/icons/" + ["tips", "cost", "book"][index % 3] + ".svg"
                    }
                    width={80}
                    height={80}
                    sizes="80px"
                    alt=""
                  />
                </div>
                <p className="eyebrow">Illustrative workflow</p>
                <h3>
                  <Link href={page.path}>
                    {page.heading}
                    <span aria-hidden="true">↗</span>
                  </Link>
                </h3>
                <p>{page.description.replace("Illustrative workflow: ", "")}</p>
              </article>
            ))}
        </div>
      </div>
      <div className="carousel-controls js-only">
        <button
          aria-label="Previous workflow"
          disabled={active === 0}
          onClick={() => api?.scrollPrev()}
        >
          ←
        </button>
        <span aria-live="polite">Workflow {active + 1}</span>
        <button
          aria-label="Next workflow"
          disabled={api ? !api.canScrollNext() : false}
          onClick={() => api?.scrollNext()}
        >
          →
        </button>
        <button onClick={() => setPlay(!play)} disabled={reduce}>
          {play ? "Pause" : "Play"} slideshow
        </button>
      </div>
    </section>
  );
}
