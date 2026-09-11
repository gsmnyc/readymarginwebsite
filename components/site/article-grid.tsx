"use client";

import { useState, useTransition } from "react";
import Link from "@/components/site/link";
import type { PageSummary } from "@/lib/content";
import { track } from "@/lib/analytics";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
            <SelectItem value={option} key={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
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
    (page) => page.indexable && (all || page.kind === "article"),
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const [page, setPage] = useState(1);
  const [pending, start] = useTransition();
  const [error, setError] = useState(false);
  const categories = [
    "All topics",
    ...new Set(pool.map((item) => item.category).filter(Boolean)),
  ];
  const filtered = pool.filter(
    (item) =>
      (category === "All topics" || item.category === category) &&
      (item.title + " " + item.description + " " + item.keyword)
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (kind !== "checklists" ||
        /checklist|payroll|preparation/.test(item.path)) &&
      (kind !== "guides" || !/checklist/.test(item.path)),
  );
  const total = Math.max(1, Math.ceil(filtered.length / 6));

  function update(change: () => void) {
    start(() => {
      change();
      setPage(1);
    });
    track("filter_use");
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
            onChange={(event) => update(() => setQuery(event.target.value))}
          />
        </div>
        {!all && (
          <Choice
            id="topic-filter"
            label="Topic"
            value={category}
            onChange={(value) => update(() => setCategory(value))}
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
          {filtered.slice((page - 1) * 6, page * 6).map((item, index) => (
            <article key={item.path}>
              <div className="article-rule">
                <span>{item.category || item.kind.replace("-", " ")}</span>
                <span>{String((page - 1) * 6 + index + 1).padStart(2, "0")}</span>
              </div>
              <h2>
                <Link href={item.path}>{item.heading}</Link>
              </h2>
              <p>{item.description}</p>
              <Link className="text-link" href={item.path}>
                Read {item.kind === "article" ? "the insight" : "more"} ↗
              </Link>
            </article>
          ))}
        </div>
      )}
      {total > 1 && (
        <Pagination>
          <PaginationContent className="flex-wrap justify-center">
            {Array.from({ length: total }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#content-search"
                  isActive={page === index + 1}
                  onClick={(event) => {
                    event.preventDefault();
                    setPage(index + 1);
                    document.getElementById("content-search")?.focus();
                  }}
                >
                  {index + 1}
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
            {pool.map((item) => (
              <Link key={item.path} href={item.path}>
                {item.title}
              </Link>
            ))}
          </nav>
        </details>
      )}
    </div>
  );
}
