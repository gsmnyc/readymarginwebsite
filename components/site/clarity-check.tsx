"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "@/components/site/link";
import { track } from "@/lib/analytics";
import { diagnose, diagnosticSchema } from "@/lib/forms";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaults = {
  locations: "1",
  restaurantType: "Full service",
  payroll: "Straightforward",
  systems: "2",
  cadence: "Weekly",
  food: "Simple",
  concern: "Time spent chasing",
};

function Choice({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
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
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

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
    setValues((current) => ({ ...current, [key]: value }));
    setResult(null);
  }

  function calculate(event: React.FormEvent) {
    event.preventDefault();
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
              onChange={(event) => set("locations", event.target.value)}
              required
            />
          </div>
          <Choice
            id="check-type"
            label="Restaurant type"
            value={values.restaurantType}
            onChange={(value) => set("restaurantType", value)}
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
            onChange={(value) => set("payroll", value)}
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
              onChange={(event) => set("systems", event.target.value)}
              required
            />
          </div>
          <Choice
            id="check-cadence"
            label="Current reporting cadence"
            value={values.cadence}
            onChange={(value) => set("cadence", value)}
            options={["Weekly", "Monthly", "Irregular / unclear"]}
          />
          <Choice
            id="check-food"
            label="Food / vendor complexity"
            value={values.food}
            onChange={(value) => set("food", value)}
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
            onChange={(value) => set("concern", value)}
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
              {result.gaps.map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
            <h3>Questions to bring</h3>
            <ul>
              {result.questions.map((question) => (
                <li key={question}>{question}</li>
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
