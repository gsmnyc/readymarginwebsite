import { getContent, isProduction, siteOrigin } from "@/lib/content";

export const revalidate = 3600;

export async function GET() {
  const { pages, settings } = await getContent();
  const origin = siteOrigin();
  const lines = [
    "# Ready Margin",
    "",
    "> Managed restaurant finance, accounting, payroll, tax/compliance workflow and operations support.",
    "",
    "Ready Margin helps restaurant owners with agreed recurring accounting, bookkeeping, payroll, tips, tax and compliance workflows, payables, reporting, cash visibility, food and labor cost analysis, profitability and CFO-level guidance. Service boundaries, approvals and specialist responsibilities are confirmed in the engagement.",
    "",
    `Website: ${origin}`,
    `Contact: ${settings.email}`,
  ];

  const groups: [string, (page: (typeof pages)[number]) => boolean][] = [
    ["Restaurant finance services", (page) => ["service", "service-hub", "capability"].includes(page.kind) && !page.path.startsWith("/new-york")],
    ["Restaurant problems and solutions", (page) => ["solution", "solution-hub"].includes(page.kind)],
    ["Direct restaurant finance answers", (page) => page.kind === "answer"],
    ["New York restaurant services", (page) => page.path === "/new-york" || page.path.startsWith("/new-york/")],
    ["Restaurant finance guides", (page) => page.kind === "article"],
    ["How the service works", (page) => ["process", "rhythm", "implementation", "owner-view"].includes(page.kind)],
    ["Who we support", (page) => page.kind === "audience"],
  ];

  for (const [heading, matches] of groups) {
    const found = pages.filter((page) => page.published && page.indexable && matches(page));
    if (!found.length) continue;
    lines.push("", `## ${heading}`, "");
    for (const page of found) {
      lines.push(`- [${page.seoTitle || page.title}](${origin}${page.path}): ${page.answer || page.description}`);
    }
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": isProduction() ? "noindex, follow" : "noindex, nofollow",
    },
  });
}
