"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { lightMotion, motionAllowed } from "./motion-utils";

const PageChoreography = dynamic(
  () => import("./page-choreography").then((module) => module.PageChoreography),
  { ssr: false },
);

const motionExcluded = ["/book-a-review", "/contact", "/legal/", "/thank-you"];

export function ChoreographyLoader() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const enabled = !motionExcluded.some((prefix) =>
    prefix.endsWith("/") ? pathname.startsWith(prefix) : pathname === prefix,
  );

  useEffect(() => {
    setReady(false);
    if (!enabled || !motionAllowed() || lightMotion()) return;
    const idle = window.requestIdleCallback?.(() => setReady(true), { timeout: 900 });
    const timer = idle === undefined ? window.setTimeout(() => setReady(true), 160) : undefined;
    return () => {
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [enabled, pathname]);

  return enabled && ready ? <PageChoreography /> : null;
}
