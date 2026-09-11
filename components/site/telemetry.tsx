"use client";

import { useEffect, useSyncExternalStore } from "react";
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
      <EventBridge />
    </>
  ) : null;
}

function EventBridge() {
  useEffect(() => {
    const send = (event: Event) => {
      const name = (event as CustomEvent<EventName>).detail;
      if (typeof name === "string") trackEvent(name);
    };
    window.addEventListener("rm-track", send);
    return () => window.removeEventListener("rm-track", send);
  }, []);
  return null;
}
