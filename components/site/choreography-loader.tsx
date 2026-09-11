"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { lightMotion, motionAllowed } from "./motion-utils";

const PageChoreography = dynamic(
  () => import("./page-choreography").then((module) => module.PageChoreography),
  { ssr: false },
);

export function ChoreographyLoader() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!motionAllowed() || lightMotion()) return;
    const idle = window.requestIdleCallback?.(() => setReady(true), {
      timeout: 1200,
    });
    const timer =
      idle === undefined
        ? window.setTimeout(() => setReady(true), 200)
        : undefined;
    return () => {
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);
  return ready ? <PageChoreography /> : null;
}
