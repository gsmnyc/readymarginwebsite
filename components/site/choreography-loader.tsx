"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { lightMotion, motionAllowed } from "./motion-utils";

const PageChoreography = dynamic(
  () => import("./page-choreography").then((module) => module.PageChoreography),
  { ssr: false },
);

export function ChoreographyLoader() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const enabled =
    pathname === "/" ||
    pathname === "/new-york-restaurant-bookkeeping" ||
    pathname.startsWith("/what-we-handle") ||
    pathname.startsWith("/how-it-works") ||
    pathname === "/margin-clarity-check";

  useEffect(() => {
    if (!enabled || !motionAllowed() || lightMotion()) return;
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
  }, [enabled]);

  return enabled && ready ? <PageChoreography /> : null;
}
