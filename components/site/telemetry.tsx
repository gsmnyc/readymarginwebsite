"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const TelemetryRuntime = dynamic(
  () => import("./telemetry-runtime").then((module) => module.TelemetryRuntime),
  { ssr: false },
);

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

export function Telemetry() {
  const allowed = useSyncExternalStore(subscribe, hasConsent, () => false);
  return allowed ? <TelemetryRuntime /> : null;
}
