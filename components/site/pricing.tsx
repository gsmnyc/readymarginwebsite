"use client";

import Link from "@/components/site/link";
import type { Tier } from "@/lib/content";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Pricing({ tiers }: { tiers: Tier[] }) {
  return (
    <>
      <div className="pricing-grid">
        {tiers.map((tier, index) => (
          <article
            className={"price-card " + (index === 1 ? "featured" : "")}
            key={tier.name}
          >
            <p className="eyebrow">
              {index === 1
                ? "A connected relationship"
                : "Scope " + String(index + 1).padStart(2, "0")}
            </p>
            <h2>{tier.name}</h2>
            <h3>{tier.description}</h3>
            <p>{tier.fit}</p>
            <Link className="text-link" href="/book-a-review" data-cta>
              Discuss this scope ↗
            </Link>
            <p className="scope-note">{tier.note}</p>
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
              {tiers.map((tier) => (
                <TableHead key={tier.name}>{tier.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiers[0].features.map((feature, index) => (
              <TableRow key={feature}>
                <TableHead>{feature.split(":")[0]}</TableHead>
                {tiers.map((tier) => (
                  <TableCell key={tier.name}>
                    <span className="mobile-table-label" aria-hidden="true">
                      {tier.name}
                    </span>
                    {tier.features[index]?.split(":").slice(1).join(":").trim()}
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
