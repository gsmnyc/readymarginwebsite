"use client";

import { useEffect } from "react";
import { track as trackEvent } from "@vercel/analytics";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { EventName } from "@/lib/analytics";

function hasConsent() {
  try {
    return localStorage.getItem("rm-consent") === "allow";
  } catch {
    return false;
  }
}

function sanitize<T extends { url: string }>(event: T): T | null {
  if (!hasConsent()) return null;
  const url = new URL(event.url, location.origin);
  url.search = "";
  url.hash = "";
  return { ...event, url: url.href };
}

export function TelemetryRuntime() {
  useEffect(() => {
    const send = (event: Event) => {
      const name = (event as CustomEvent<EventName>).detail;
      if (typeof name === "string") trackEvent(name);
    };
    window.addEventListener("rm-track", send);
    return () => window.removeEventListener("rm-track", send);
  }, []);

  return (
    <>
      <Analytics beforeSend={sanitize} debug={false} />
      <SpeedInsights beforeSend={sanitize} debug={false} />
    </>
  );
}
