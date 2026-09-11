"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "@/components/site/link";

const streams = [
  ["People", "Managers, responsibilities and the handoffs between them.", "scheduling-attendance", "calendar"],
  ["Time", "Schedules, recorded hours and attendance exceptions.", "scheduling-attendance", "clock"],
  ["Pay", "Payroll, tips and the approval-ready handoff.", "payroll-tips", "tips"],
  ["Food", "Recipes, waste, inventory and purchasing questions.", "food-cost-vendors", "cost"],
  ["Bills", "Vendor records, changes and payment approvals.", "accounting-close", "book"],
  ["Books", "Reconciliation, close and the financial picture.", "accounting-close", "book"],
  ["Cash", "Dated visibility into cash and commitments.", "reporting-cash-visibility", "cost"],
  ["Decisions", "Interpretation, priorities and a named next action.", "turnaround-support", "chat"],
] as const;

export function Workstreams() {
  const [active, setActive] = useState(0);
  return (
    <div className="workstreams">
      <div className="stream-rail" aria-label="Operating workstreams">
        {streams.map(([name, , slug, icon], index) => (
          <Link
            href={"/what-we-handle/" + slug}
            key={name}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            className={active === index ? "active" : ""}
          >
            <Image
              src={"/icons/" + icon + ".svg"}
              alt=""
              width={38}
              height={38}
              sizes="38px"
            />
            <span>{name}</span>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
      <div className="stream-detail stream-detail-enter" key={active}>
        <span className="eyebrow">{streams[active][0]} → a clearer next step</span>
        <p>{streams[active][1]}</p>
      </div>
    </div>
  );
}
