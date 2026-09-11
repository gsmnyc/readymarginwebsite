export const eventNames = [
  "intro_skip",
  "intro_complete",
  "cta_click",
  "form_start",
  "form_submit",
  "form_error",
  "calculator_start",
  "calculator_complete",
  "case_open",
  "filter_use",
  "faq_open",
  "resource_download",
  "cta_view",
  "form_abandon",
  "qualified_review",
  "guide_assist",
] as const;
export type EventName = (typeof eventNames)[number];
export function track(event: EventName) {
  try {
    if (localStorage.getItem("rm-consent") !== "allow") return;
    const path = location.pathname;
    navigator.sendBeacon(
      "/api/events",
      new Blob([JSON.stringify({ event, path })], { type: "application/json" }),
    );
  } catch {}
}
