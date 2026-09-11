"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { track } from "@/lib/analytics";
import { lightMotion, motionAllowed } from "./motion-utils";

if (typeof window !== "undefined" && typeof document !== "undefined")
  gsap.registerPlugin(ScrollTrigger, useGSAP);

export function IntroReveal() {
  const root = useRef<HTMLElement>(null);
  const [skip, setSkip] = useState(false);
  const done = useRef(false);

  useGSAP(
    () => {
      if (!root.current || skip || !motionAllowed()) return;
      const element = root.current;
      const media = gsap.matchMedia();
      media.add(
        {
          desktop: "(min-width: 1024px) and (min-height: 700px)",
          mobile: "(max-width: 1023px), (max-height: 699px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (context.conditions?.reduce) return;
          const desktop = context.conditions?.desktop && !lightMotion();
          element.dataset.scene = desktop ? "desktop" : "mobile";

          if (desktop) {
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: element,
                start: "top 94px",
                end: "+=170%",
                pin: true,
                scrub: 0.5,
                invalidateOnRefresh: true,
                onLeave: () => {
                  if (!done.current) {
                    done.current = true;
                    track("intro_complete");
                  }
                },
              },
            });
            timeline
              .to(
                ".cinema-question .word",
                { yPercent: -110, stagger: 0.06, duration: 0.65 },
                0.12,
              )
              .to(
                ".cinema-question-support",
                { opacity: 0, duration: 0.3 },
                0.12,
              )
              .fromTo(
                ".work-ticket",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.06, duration: 0.5 },
                0.7,
              )
              .to(
                ".work-ticket",
                {
                  x: (_, target: HTMLElement) =>
                    element.clientWidth / 2 -
                    (target.offsetLeft + target.offsetWidth / 2),
                  y: (_, target: HTMLElement) =>
                    element.clientHeight * 0.5 -
                    (target.offsetTop + target.offsetHeight / 2),
                  opacity: 0,
                  scale: 0.8,
                  stagger: 0.035,
                  duration: 0.85,
                },
                1.65,
              )
              .fromTo(
                ".cinema-mark",
                { scale: 0.88, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.7 },
                2.3,
              )
              .fromTo(
                ".cinema-answer",
                { y: 28, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7 },
                2.65,
              )
              .to(".cinema-rule", { scaleX: 1, duration: 3.4, ease: "none" }, 0)
              .to({}, { duration: 0.6 });
          } else {
            gsap.from(".work-ticket", {
              y: 18,
              stagger: 0.045,
              duration: 0.65,
              scrollTrigger: {
                trigger: ".ticket-field",
                start: "top 85%",
                once: true,
              },
            });
            gsap.from(".cinema-resolution", {
              y: 24,
              duration: 0.85,
              scrollTrigger: {
                trigger: ".cinema-resolution",
                start: "top 85%",
                once: true,
              },
            });
            gsap.to(".cinema-rule", {
              scaleX: 1,
              duration: 0.8,
              scrollTrigger: {
                trigger: ".cinema-resolution",
                start: "top 80%",
                once: true,
              },
            });
          }
          return () => {
            delete element.dataset.scene;
          };
        },
      );
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          media.revert();
          element.dataset.scene = "keyboard";
        }
      };
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        media.revert();
      };
    },
    { scope: root, dependencies: [skip], revertOnUpdate: true },
  );

  function finish() {
    done.current = true;
    ScrollTrigger.getAll()
      .filter((trigger) => trigger.trigger === root.current)
      .forEach((trigger) => trigger.kill(true));
    setSkip(true);
    track("intro_skip");
    requestAnimationFrame(() => {
      const hero = document.getElementById("home-hero");
      hero?.scrollIntoView({ behavior: "instant" });
      hero?.focus({ preventScroll: true });
      ScrollTrigger.refresh();
    });
  }

  return (
    <section
      ref={root}
      className="intro cinema-intro"
      style={skip ? { display: "none" } : undefined}
      aria-label="The work behind service"
    >
      <div className="cinema-top">
        <span className="eyebrow">Ready Margin / Behind service</span>
        <a
          href="#home-hero"
          onClick={(event) => {
            event.preventDefault();
            finish();
          }}
        >
          Skip intro ↘
        </a>
      </div>
      <div className="cinema-question">
        <p aria-label="Who is handling everything behind your restaurant while you are busy running it?">
          {[
            "Who is handling everything",
            "behind your restaurant",
            "while you are busy running it?",
          ].map((line) => (
            <span className="word-mask" key={line}>
              <span className="word">{line}</span>
            </span>
          ))}
        </p>
        <p className="cinema-question-support">
          Follow the work from a loose end to a clear next step.
        </p>
      </div>
      <div className="ticket-field" aria-label="Restaurant work to be handled">
        {[
          ["People", "Manager handoff"],
          ["Time", "Missing clock-out"],
          ["Pay", "Approval due"],
          ["Food", "Price to check"],
          ["Bills", "Invoice to check"],
          ["Books", "Month to close"],
          ["Cash", "Next decision"],
        ].map(([label, task], index) => (
          <div className={"work-ticket ticket-" + index} key={label}>
            <span>
              0{index + 1} / {label}
            </span>
            <strong>{task}</strong>
            <i aria-hidden="true">↗</i>
          </div>
        ))}
      </div>
      <div className="cinema-resolution">
        <Image
          className="cinema-mark"
          src="/brand/symbol-scene.svg"
          width={280}
          height={280}
          sizes="(max-width: 1023px) 100px, 24vw"
          alt="Ready Margin"
        />
        <div className="cinema-answer">
          <p className="eyebrow">Ready Margin</p>
          <h2>You shouldn’t have to hold it all together.</h2>
          <p>
            From payroll questions to supplier bills, we agree who handles the
            work, what needs your approval and when you’ll hear from us.
          </p>
          <a
            href="#home-hero"
            onClick={(event) => {
              event.preventDefault();
              finish();
            }}
          >
            Meet Ready Margin ↘
          </a>
        </div>
      </div>
      <div className="cinema-bottom">
        <span>Run. Explain. Improve.</span>
        <span className="scroll-cue">Scroll to follow the work ↓</span>
        <div className="cinema-rule" />
      </div>
    </section>
  );
}
