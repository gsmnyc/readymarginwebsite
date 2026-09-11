"use client";

import { useSyncExternalStore } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

function hasConsent() {
  try {
    return localStorage.getItem("rm-consent") === "allow";
  } catch {
    return false;
  }
}

function subscribe(update: () => void) {
  window.addEventListener("rm-consent", update);
  window.addEventListener("storage", update);
  return () => {
    window.removeEventListener("rm-consent", update);
    window.removeEventListener("storage", update);
  };
}

function sanitize<T extends { url: string }>(event: T): T | null {
  if (!hasConsent()) return null;
  const url = new URL(event.url, location.origin);
  url.search = "";
  url.hash = "";
  return { ...event, url: url.href };
}

export function Telemetry() {
  const allowed = useSyncExternalStore(subscribe, hasConsent, () => false);
  return allowed ? (
    <>
      <Analytics beforeSend={sanitize} debug={false} />
      <SpeedInsights beforeSend={sanitize} debug={false} />
    </>
  ) : null;
}
