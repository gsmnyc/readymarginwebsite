export const eventNames = [
  "cta_click",
  "form_start",
  "form_submit",
  "lead_accepted",
  "form_error",
  "calculator_start",
  "calculator_complete",
  "case_open",
  "filter_use",
  "faq_open",
  "resource_download",
  "cta_view",
  "form_abandon",
] as const;
export type EventName = (typeof eventNames)[number];

/** The analytics bridge is mounted only after the visitor opts in. */
export function track(event: EventName) {
  try {
    if (localStorage.getItem("rm-consent") !== "allow") return;
    window.dispatchEvent(new CustomEvent("rm-track", { detail: event }));
  } catch {}
}
