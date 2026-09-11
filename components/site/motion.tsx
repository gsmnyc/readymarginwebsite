"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "@/components/site/link";
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
      const el = root.current;
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 1024px) and (min-height: 700px)",
          mobile: "(max-width: 1023px), (max-height: 699px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (context.conditions?.reduce) return;
          const desktop = context.conditions?.desktop && !lightMotion();
          el.dataset.scene = desktop ? "desktop" : "mobile";
          if (desktop) {
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: el,
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
                    el.clientWidth / 2 -
                    (target.offsetLeft + target.offsetWidth / 2),
                  y: (_, target: HTMLElement) =>
                    el.clientHeight * 0.5 -
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
            delete el.dataset.scene;
          };
        },
      );
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          mm.revert();
          el.dataset.scene = "keyboard";
        }
      };
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        mm.revert();
      };
    },
    { scope: root, dependencies: [skip], revertOnUpdate: true },
  );
  function finish() {
    done.current = true;
    ScrollTrigger.getAll()
      .filter((t) => t.trigger === root.current)
      .forEach((t) => t.kill(true));
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
          onClick={(e) => {
            e.preventDefault();
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
        ].map(([label, task], i) => (
          <div className={"work-ticket ticket-" + i} key={label}>
            <span>
              0{i + 1} / {label}
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
            onClick={(e) => {
              e.preventDefault();
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
export function ModelScene() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!motionAllowed()) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils
          .toArray<HTMLElement>(".model-step", root.current!)
          .forEach((el) => {
            const sequence = gsap.timeline({
              scrollTrigger: { trigger: el, start: "top 82%", once: true },
            });
            sequence
              .from(el.querySelector(".model-word"), {
                yPercent: 95,
                duration: 0.85,
                ease: "power3.out",
              })
              .from(
                el.querySelectorAll(".model-evidence div"),
                { x: 18, stagger: 0.1, duration: 0.6 },
                0.2,
              )
              .from(
                el.querySelector(".model-rule"),
                { scaleX: 0, transformOrigin: "left", duration: 0.85 },
                0,
              );
          });
      });
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
    <div className="model" ref={root}>
      <p className="model-example-label">
        One payroll question, followed through. An illustrative workflow.
      </p>
      {[
        [
          "Run",
          "We take on the recurring jobs.",
          "Books, hours, tips and supplier records. We agree the work, then get on with it.",
        ],
        [
          "Explain",
          "We tell you what the numbers mean.",
          "What changed this week? What is still missing? What needs your attention?",
        ],
        [
          "Improve",
          "We stay with the follow-up.",
          "Agree the action, put someone in charge and check it at the next review.",
        ],
      ].map(([a, b, c], i) => (
        <div className="model-step" key={a}>
          <span className="step-num">0{i + 1}</span>
          <h3 className="model-heading">
            <span className="model-word">
              {a}
              <span>.</span>
            </span>
          </h3>
          <div className="model-description">
            <h4>{b}</h4>
            <p>{c}</p>
          </div>
          <dl
            className="model-evidence"
            aria-label={a + ": illustrative payroll handoff"}
          >
            {[
              [
                ["Input", "A shift is missing its end time."],
                ["Work", "Check the schedule and request a correction."],
                ["Handoff", "Manager confirms the hours."],
              ],
              [
                ["Finding", "The payroll record is still incomplete."],
                ["Consequence", "Approval needs the confirmed hours."],
                ["Question", "Who can verify the shift before cutoff?"],
              ],
              [
                ["Next action", "Record the verified correction."],
                ["Decision owner", "Your payroll approver."],
                ["Next check", "Confirm the handoff at the agreed cutoff."],
              ],
            ][i].map(([label, text]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
          <span className="model-rule" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}
const streams = [
  [
    "People",
    "Managers, responsibilities and the handoffs between them.",
    "scheduling-attendance",
    "calendar",
  ],
  [
    "Time",
    "Schedules, recorded hours and attendance exceptions.",
    "scheduling-attendance",
    "clock",
  ],
  [
    "Pay",
    "Payroll, tips and the approval-ready handoff.",
    "payroll-tips",
    "tips",
  ],
  [
    "Food",
    "Recipes, waste, inventory and purchasing questions.",
    "food-cost-vendors",
    "cost",
  ],
  [
    "Bills",
    "Vendor records, changes and payment approvals.",
    "accounting-close",
    "book",
  ],
  [
    "Books",
    "Reconciliation, close and the financial picture.",
    "accounting-close",
    "book",
  ],
  [
    "Cash",
    "Dated visibility into cash and commitments.",
    "reporting-cash-visibility",
    "cost",
  ],
  [
    "Decisions",
    "Interpretation, priorities and a named next action.",
    "turnaround-support",
    "chat",
  ],
];
export function Workstreams() {
  const [active, setActive] = useState(0);
  return (
    <div className="workstreams">
      <div className="stream-rail" aria-label="Operating workstreams">
        {streams.map(([name, , slug, icon], i) => (
          <Link
            href={"/what-we-handle/" + slug}
            key={name}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={active === i ? "active" : ""}
          >
            <Image
              src={"/icons/" + icon + ".svg"}
              alt=""
              width={38}
              height={38}
              sizes="38px"
            />
            <span>{name}</span>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
      <div className="stream-detail stream-detail-enter" key={active}>
        <span className="eyebrow">
          {streams[active][0]} → a clearer next step
        </span>
        <p>{streams[active][1]}</p>
      </div>
    </div>
  );
}
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
      const mm = gsap.matchMedia();
      mm.add(
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
        if (event.key === "Tab") mm.revert();
      };
      window.addEventListener("keydown", stop);
      return () => {
        mm.revert();
        window.removeEventListener("keydown", stop);
      };
    },
    { scope: root },
  );
  return (
    <div className="timeline" ref={root}>
      <div className="timeline-nav">
        <div className="timeline-progress" />
        {steps.map((s, i) => (
          <button
            key={s.title}
            aria-pressed={active === i}
            onClick={() => {
              manual.current = true;
              setActive(i);
            }}
            className={i === active ? "active" : ""}
          >
            <span>0{i + 1}</span>
            {s.title}
          </button>
        ))}
      </div>
      <div className="timeline-copy">
        <p className="eyebrow">The Ready Rhythm</p>
        {steps.map((s, i) => (
          <section key={s.title} className={i === active ? "current" : ""}>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
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
