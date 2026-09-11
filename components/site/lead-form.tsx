"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/site/link";
import type { Settings } from "@/lib/content";
import { track } from "@/lib/analytics";
import { leadSchema } from "@/lib/forms";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export function LeadForm({ settings }: { settings: Settings }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "error" | "success">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const started = useRef(false);
  const submitted = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const success = useRef<HTMLElement>(null);

  useEffect(
    () => () => {
      if (started.current && !submitted.current) track("form_abandon");
    },
    [],
  );
  useEffect(() => {
    if (state === "success")
      requestAnimationFrame(() => success.current?.focus({ preventScroll: true }));
  }, [state]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    setState("sending");
    track("form_submit");
    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: AbortSignal.timeout(15000),
      });
      const data = (await response.json()) as { message?: string };
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
    }
  }

  if (state === "success")
    return (
      <section className="form-success" ref={success} role="status" tabIndex={-1}>
        <span className="eyebrow">Request received</span>
        <h2>Thank you. We have your enquiry.</h2>
        <p>
          We will contact you to agree the next step and a suitable review time.
        </p>
        <Link className="button" href="/thank-you">
          Prepare for your review ↗
        </Link>
        <Link className="text-link" href="/insights/weekly-pnl-review">
          Read the weekly P&amp;L guide ↗
        </Link>
      </section>
    );

  return (
    <form
      ref={form}
      className="lead-form"
      onSubmit={submit}
      noValidate
      onFocus={() => {
        if (!started.current) {
          started.current = true;
          track("form_start");
        }
      }}
    >
      <div className="form-heading">
        <p className="eyebrow">Start the conversation</p>
        <h2>
          Tell us a little
          <br />
          about your restaurant.
        </h2>
        <p>Only your name, business, email and consent are required.</p>
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
        {state === "sending" ? "Sending your request…" : settings.cta}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="caption">
        No commitment to a service package. Please do not include sensitive
        financial or employee information.
      </p>
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
