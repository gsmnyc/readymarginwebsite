"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "@/components/site/link";
import type { PageSummary, Settings } from "@/lib/content";
import { track } from "@/lib/analytics";
import { leadSchema, diagnosticSchema, diagnose } from "@/lib/forms";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Tier } from "@/lib/content";
export function Choice({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="form-select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem value={o} key={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
export function Pricing({ tiers }: { tiers: Tier[] }) {
  return (
    <>
      <div className="pricing-grid">
        {tiers.map((t, i) => (
          <article
            className={"price-card " + (i === 1 ? "featured" : "")}
            key={t.name}
          >
            <p className="eyebrow">
              {i === 1
                ? "A connected relationship"
                : "Scope " + String(i + 1).padStart(2, "0")}
            </p>
            <h2>{t.name}</h2>
            <h3>{t.description}</h3>
            <p>{t.fit}</p>
            <Link className="text-link" href="/book-a-review" data-cta>
              Discuss this scope ↗
            </Link>
            <p className="scope-note">{t.note}</p>
          </article>
        ))}
      </div>
      <div className="pricing-matrix">
        <h2>Compare the starting points.</h2>
        <p>
          These are proposed service levels, not automatic inclusions. The
          signed scope confirms what is included and what is an add-on.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workflow</TableHead>
              {tiers.map((t) => (
                <TableHead key={t.name}>{t.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiers[0].features.map((f, i) => (
              <TableRow key={f}>
                <TableHead>{f.split(":")[0]}</TableHead>
                {tiers.map((t) => (
                  <TableCell key={t.name}>
                    <span className="mobile-table-label" aria-hidden="true">
                      {t.name}
                    </span>
                    {t.features[i]?.split(":").slice(1).join(":").trim()}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
export function ArticleGrid({
  pages,
  all = false,
  kind = "articles",
}: {
  pages: PageSummary[];
  all?: boolean;
  kind?: string;
}) {
  const pool = pages.filter(
    (p) => p.indexable && (all || p.kind === "article"),
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const [page, setPage] = useState(1);
  const [pending, start] = useTransition();
  const [error, setError] = useState(false);
  const categories = [
    "All topics",
    ...new Set(pool.map((p) => p.category).filter(Boolean)),
  ];
  let filtered: PageSummary[] = [];
  try {
    filtered = pool.filter(
      (p) =>
        (category === "All topics" || p.category === category) &&
        (p.title + " " + p.description + " " + p.keyword)
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (kind !== "checklists" ||
          /checklist|payroll|preparation/.test(p.path)) &&
        (kind !== "guides" || !/checklist/.test(p.path)),
    );
  } catch {}
  const total = Math.max(1, Math.ceil(filtered.length / 6));
  function update(fn: () => void) {
    try {
      start(() => {
        fn();
        setPage(1);
      });
      track("filter_use");
    } catch {
      setError(true);
    }
  }
  return (
    <div className="article-browser">
      <div className="filter-bar">
        <div className="field">
          <label htmlFor="content-search">
            Search {all ? "the site" : "insights"}
          </label>
          <Input
            id="content-search"
            placeholder="Try payroll, food cost or cash…"
            value={query}
            onChange={(e) => update(() => setQuery(e.target.value))}
          />
        </div>
        {!all && (
          <Choice
            id="topic-filter"
            label="Topic"
            value={category}
            onChange={(v) => update(() => setCategory(v))}
            options={categories}
          />
        )}
      </div>
      <p className="caption" role="status" aria-live="polite">
        {pending
          ? "Updating results…"
          : `${filtered.length} ${filtered.length === 1 ? "result" : "results"}`}
      </p>
      {error ? (
        <div role="alert">
          <p>We could not update the list.</p>
          <button
            className="button"
            onClick={() => {
              setError(false);
              setQuery("");
              setCategory("All topics");
            }}
          >
            Reset and retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No matches yet.</h3>
          <p>Try a broader question or clear the filters.</p>
          <button
            className="button secondary"
            onClick={() => {
              setQuery("");
              setCategory("All topics");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="article-grid" aria-busy={pending}>
          {filtered.slice((page - 1) * 6, page * 6).map((p, i) => (
            <article key={p.path}>
              <div className="article-rule">
                <span>{p.category || p.kind.replace("-", " ")}</span>
                <span>{String((page - 1) * 6 + i + 1).padStart(2, "0")}</span>
              </div>
              <h2>
                <Link href={p.path}>{p.heading}</Link>
              </h2>
              <p>{p.description}</p>
              <Link className="text-link" href={p.path}>
                Read {p.kind === "article" ? "the insight" : "more"} ↗
              </Link>
            </article>
          ))}
        </div>
      )}
      {total > 1 && (
        <Pagination>
          <PaginationContent className="flex-wrap justify-center">
            {Array.from({ length: total }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#content-search"
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                    document.getElementById("content-search")?.focus();
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      )}
      {!all && (
        <details className="article-directory">
          <summary>Browse all operator insights</summary>
          <nav aria-label="All operator insights">
            {pool.map((p) => (
              <Link key={p.path} href={p.path}>
                {p.title}
              </Link>
            ))}
          </nav>
        </details>
      )}
    </div>
  );
}
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
  useEffect(
    () => () => {
      if (started.current && !submitted.current) track("form_abandon");
    },
    [],
  );
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = leadSchema.safeParse({ ...values, consent });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((x) => (errs[String(x.path[0])] = x.message));
      setErrors(errs);
      requestAnimationFrame(() =>
        form.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    setErrors({});
    setState("sending");
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
      setState("success");
      submitted.current = true;
      track("form_submit");
      form.current?.reset();
    } catch (e) {
      setState("error");
      setMessage(
        e instanceof Error ? e.message : "Your request could not be delivered.",
      );
      track("form_error");
    }
  }
  if (state === "success")
    return (
      <section className="form-success" role="status" tabIndex={-1}>
        <span className="eyebrow">Request received</span>
        <h2>Thank you. We have your enquiry.</h2>
        <p>
          We will contact you to agree the next step and a suitable review time.
        </p>
        <Link className="button" href="/thank-you">
          Prepare for your review ↗
        </Link>
        <Link className="text-link" href="/insights/weekly-pnl-review">
          Read the weekly P&L guide ↗
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
        {settings.formFields.map((f) => (
          <div
            className={"field " + (f.name === "concern" ? "full" : "")}
            key={f.name}
          >
            <label htmlFor={f.name}>
              {f.label}
              {f.required ? " *" : ""}
            </label>
            {f.name === "concern" ? (
              <textarea
                id={f.name}
                name={f.name}
                rows={3}
                maxLength={2000}
                aria-invalid={!!errors[f.name]}
                aria-describedby={
                  errors[f.name] ? f.name + "-error" : undefined
                }
              />
            ) : (
              <Input
                id={f.name}
                name={f.name}
                required={f.required}
                type={
                  f.name === "email"
                    ? "email"
                    : f.name === "phone"
                      ? "tel"
                      : "text"
                }
                inputMode={f.name === "locations" ? "numeric" : undefined}
                autoComplete={
                  f.name === "name"
                    ? "name"
                    : f.name === "business"
                      ? "organization"
                      : f.name === "email"
                        ? "email"
                        : f.name === "phone"
                          ? "tel"
                          : "off"
                }
                aria-invalid={!!errors[f.name]}
                aria-describedby={
                  errors[f.name] ? f.name + "-error" : undefined
                }
              />
            )}{" "}
            {errors[f.name] && (
              <span className="field-error" id={f.name + "-error"}>
                {errors[f.name]}
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
          onCheckedChange={(v) => setConsent(v === true)}
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? "consent-error" : undefined}
        />
        <label htmlFor="consent">
          I agree that Ready Margin may use these details to respond to my
          enquiry, as described in the{" "}
          <Link href="/legal/privacy">privacy notice</Link>.
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
const defaults = {
  locations: "1",
  restaurantType: "Full service",
  payroll: "Straightforward",
  systems: "2",
  cadence: "Weekly",
  food: "Simple",
  concern: "Time spent chasing",
};
export function ClarityCheck() {
  const [values, setValues] = useState(defaults);
  const [result, setResult] = useState<ReturnType<typeof diagnose> | null>(
    null,
  );
  const [error, setError] = useState("");
  const started = useRef(false);
  const output = useRef<HTMLDivElement>(null);
  function set(key: keyof typeof defaults, value: string) {
    if (!started.current) {
      started.current = true;
      track("calculator_start");
    }
    setValues((v) => ({ ...v, [key]: value }));
    setResult(null);
  }
  function calculate(e: React.FormEvent) {
    e.preventDefault();
    const parsed = diagnosticSchema.safeParse(values);
    if (!parsed.success) {
      setError(
        "Check your location and system counts. Locations must be 1–1000; systems 1–50.",
      );
      return;
    }
    setError("");
    setResult(diagnose(parsed.data));
    track("calculator_complete");
    requestAnimationFrame(() => output.current?.focus());
  }
  return (
    <div className="diagnostic">
      <form onSubmit={calculate} className="diagnostic-form">
        <p className="eyebrow">Your restaurant</p>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="check-locations">Number of locations</label>
            <Input
              id="check-locations"
              type="number"
              min="1"
              max="1000"
              value={values.locations}
              onChange={(e) => set("locations", e.target.value)}
              required
            />
          </div>
          <Choice
            id="check-type"
            label="Restaurant type"
            value={values.restaurantType}
            onChange={(v) => set("restaurantType", v)}
            options={[
              "Full service",
              "Quick service",
              "Cafe / bakery",
              "Bar / pub",
              "Other",
            ]}
          />
          <Choice
            id="check-payroll"
            label="Payroll complexity"
            value={values.payroll}
            onChange={(v) => set("payroll", v)}
            options={[
              "Straightforward",
              "Variable hours and tips",
              "Multiple teams or cycles",
            ]}
          />
          <div className="field">
            <label htmlFor="check-systems">Number of systems</label>
            <Input
              id="check-systems"
              type="number"
              min="1"
              max="50"
              value={values.systems}
              onChange={(e) => set("systems", e.target.value)}
              required
            />
          </div>
          <Choice
            id="check-cadence"
            label="Current reporting cadence"
            value={values.cadence}
            onChange={(v) => set("cadence", v)}
            options={["Weekly", "Monthly", "Irregular / unclear"]}
          />
          <Choice
            id="check-food"
            label="Food / vendor complexity"
            value={values.food}
            onChange={(v) => set("food", v)}
            options={[
              "Simple",
              "Several suppliers",
              "Complex inventory / recipes",
            ]}
          />
          <Choice
            id="check-concern"
            label="Primary concern"
            value={values.concern}
            onChange={(v) => set("concern", v)}
            options={[
              "Time spent chasing",
              "Payroll and tips",
              "Food cost",
              "Cash visibility",
              "Growth",
              "Performance pressure",
            ]}
          />
        </div>
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <div className="actions">
          <button className="button" type="submit">
            See what to review ↗
          </button>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setValues(defaults);
              setResult(null);
              setError("");
              started.current = false;
            }}
          >
            Reset
          </button>
        </div>
        <p className="caption">
          Answers stay in this page and are not sent to analytics or stored by
          the site.
        </p>
      </form>
      <div
        className="diagnostic-output"
        ref={output}
        tabIndex={-1}
        aria-live="polite"
      >
        {result ? (
          <div className="diagnostic-result" key="result">
            <p className="eyebrow">Questions to start with</p>
            <h2>{result.profile}</h2>
            <p>{result.context}</p>
            <h3>Likely gaps to investigate</h3>
            <ul>
              {result.gaps.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
            <h3>Questions to bring</h3>
            <ul>
              {result.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
            <p className="caption">
              More systems and complex payroll can mean more checks. These
              questions are a starting point for discussion, not an assessment
              of financial performance.
            </p>
            <Link className="button" href="/book-a-review" data-cta>
              Book a Restaurant Operations Review ↗
            </Link>
            <Link
              className="text-link"
              href={"/what-we-handle/" + result.capability}
            >
              Explore the relevant support ↗
            </Link>
          </div>
        ) : (
          <div className="diagnostic-empty" key="empty">
            <Image
              src="/brand/logo_symbol_primary_dark.svg"
              width={144}
              height={144}
              sizes="144px"
              alt=""
            />
            <h2>Tell us how the work gets done.</h2>
            <p>
              Answer the questions to see which parts of your process may need a
              closer look.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
