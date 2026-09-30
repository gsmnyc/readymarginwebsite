"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/site/link";
import type { Settings } from "@/lib/content";
import { track } from "@/lib/analytics";
import { leadSchema, type Lead } from "@/lib/forms";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export function LeadForm({ settings, demo = false }: { settings: Settings; demo?: boolean }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "error" | "success" | "email-ready">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");
  const emailOnly = process.env.NEXT_PUBLIC_ENQUIRY_MODE === "email";
  const started = useRef(false);
  const submitted = useRef(false);
  const sending = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const success = useRef<HTMLElement>(null);
  const draft = useRef<HTMLDivElement>(null);

  useEffect(
    () => () => {
      if (started.current && !submitted.current) track("form_abandon");
    },
    [],
  );
  useEffect(() => {
    if (state !== "success" && state !== "email-ready") return;
    const frame = requestAnimationFrame(() => {
      if (state === "success") success.current?.focus({ preventScroll: true });
      else draft.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [state]);

  function prepareEmail(details: Lead) {
    const body = [demo ? "Free demo request" : "Restaurant finance enquiry", "", `Name: ${details.name}`, `Restaurant: ${details.business}`, `Email: ${details.email}`, details.phone && `Phone: ${details.phone}`, details.locations && `Locations: ${details.locations}`, "", demo && "I’d like to book my free demo and discuss a price tailored to my restaurant.", details.concern || "I’d like to discuss finance support for my restaurant."].filter(Boolean).join("\n");
    setEmailDraft(`mailto:${settings.email}?subject=${encodeURIComponent(`${demo ? "Free demo request" : "Restaurant finance enquiry"} — ${details.business}`)}&body=${encodeURIComponent(body)}`);
    setState("email-ready");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = leadSchema.safeParse({ ...values, consent });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach(
        (issue) => (nextErrors[String(issue.path[0])] = issue.message),
      );
      setErrors(nextErrors);
      requestAnimationFrame(() =>
        form.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    setErrors({});
    setMessage("");
    if (emailOnly) { prepareEmail(parsed.data); return; }
    setState("sending");
    sending.current = true;
    track("form_submit");
    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: AbortSignal.timeout(15000),
      });
      const data = (await response.json()) as { message?: string };
      if (response.status === 503) { prepareEmail(parsed.data); return; }
      if (!response.ok)
        throw new Error(
          data.message ||
            "Your request could not be delivered. Please retry or email us.",
        );
      submitted.current = true;
      track("lead_accepted");
      form.current?.reset();
      setState("success");
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Your request could not be delivered.",
      );
      track("form_error");
    } finally {
      sending.current = false;
    }
  }

  if (state === "success")
    return (
      <section className="form-success" ref={success} role="status" tabIndex={-1}>
        <span className="eyebrow">Request received</span>
        <h2>Your enquiry has been received.</h2>
        <p>
          {demo ? "We’ll contact you to arrange your free demo." : "We’ll contact you to agree the next step and a suitable time."}
        </p>
        <Link className="button" href="/thank-you">
          Prepare for your free demo
        </Link>
        <Link className="text-link" href="/insights/weekly-pnl-review">
          Read the weekly P&amp;L guide
        </Link>
      </section>
    );

  return (
    <form
      ref={form}
      className="lead-form"
      onSubmit={submit}
      noValidate
      aria-busy={state === "sending"}
      onChangeCapture={(event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
        const name = target.name;
        if (name && errors[name])
          setErrors((current) => {
            const next = { ...current };
            delete next[name];
            return next;
          });
      }}
      onFocus={() => {
        if (!started.current) {
          started.current = true;
          track("form_start");
        }
      }}
    >
      <div className="form-heading">
        <p className="eyebrow">{demo ? "Book your free demo" : "Start the conversation"}</p>
        <h2>
          Introduce
          <br />
          your restaurant.
        </h2>
        <p>{demo ? "Share a few details and we’ll arrange your free demo." : "Only your name, business, email and consent are required."}</p>
      </div>
      <div className="form-grid">
        {settings.formFields.map((field) => (
          <div
            className={"field " + (field.name === "concern" ? "full" : "")}
            key={field.name}
          >
            <label htmlFor={field.name}>
              {field.label}
              {field.required ? " *" : ""}
            </label>
            {field.name === "concern" ? (
              <textarea
                id={field.name}
                name={field.name}
                rows={3}
                maxLength={2000}
                autoComplete="off"
                aria-invalid={!!errors[field.name]}
                aria-describedby={
                  errors[field.name] ? field.name + "-error" : undefined
                }
              />
            ) : (
              <Input
                id={field.name}
                name={field.name}
                required={field.required}
                type={
                  field.name === "email"
                    ? "email"
                    : field.name === "phone"
                      ? "tel"
                      : "text"
                }
                inputMode={field.name === "locations" ? "numeric" : undefined}
                enterKeyHint={field.name === "email" ? "next" : undefined}
                autoComplete={
                  field.name === "name"
                    ? "name"
                    : field.name === "business"
                      ? "organization"
                      : field.name === "email"
                        ? "email"
                        : field.name === "phone"
                          ? "tel"
                          : "off"
                }
                aria-invalid={!!errors[field.name]}
                aria-describedby={
                  errors[field.name] ? field.name + "-error" : undefined
                }
              />
            )}
            {errors[field.name] && (
              <span className="field-error" id={field.name + "-error"}>
                {errors[field.name]}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="honey" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="consent-line">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={(value) => setConsent(value === true)}
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? "consent-error" : undefined}
        />
        <label htmlFor="consent">
          I agree that Ready Margin may use these details to respond to my
          enquiry, as described in the <Link href="/legal/privacy">privacy notice</Link>.
        </label>
      </div>
      {errors.consent && (
        <p className="field-error" id="consent-error">
          {errors.consent}
        </p>
      )}
      <button disabled={state === "sending"} className="button" type="submit">
        {state === "sending" ? "Sending your request…" : state === "email-ready" ? "Update email draft" : emailOnly ? (demo ? "Prepare free demo request" : "Prepare enquiry email") : (demo ? "Request your free demo" : "Send enquiry")}
      </button>
      <p className="caption">
        No commitment to a service package. Please do not include sensitive
        financial or employee information.
      </p>
      {state === "email-ready" && <div ref={draft} tabIndex={-1} className="email-draft-ready" role="status"><h3>{demo ? "Your free demo request is ready to send." : "Your enquiry is ready to send."}</h3><p>Open the draft in your email app, then send it to {settings.email}. You can adjust the details above before opening it.</p><a className="button" href={emailDraft}>{demo ? "Open demo request email" : "Open enquiry email"}</a><p className="caption">The request is sent when you send the email from your email app.</p></div>}
      {state === "error" && (
        <div className="form-error" role="alert">
          <strong>Your request has not been sent.</strong>
          <p>{message}</p>
          <p>
            Your entries are still here. You can retry using the button above or{" "}
            <a href={"mailto:" + settings.email}>email {settings.email}</a>.
          </p>
        </div>
      )}
      <noscript>
        <p>
          To make an enquiry without JavaScript, email{" "}
          <a href={"mailto:" + settings.email}>{settings.email}</a>.
        </p>
      </noscript>
    </form>
  );
}
