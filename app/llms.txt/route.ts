import { getContent, isProduction, siteOrigin } from "@/lib/content";

export const revalidate = 3600;

export async function GET() {
  const { pages, settings } = await getContent();
  const origin = siteOrigin();
  const sections = [
    ["Managed services", ["capability"]],
    ["How the service works", ["process", "rhythm", "implementation", "owner-view"]],
    ["Who we support", ["audience"]],
    ["Restaurant finance guides", ["article"]],
    ["Company and enquiries", ["about", "pricing", "form", "security"]],
  ] as const;
  const lines = [
    "# Ready Margin",
    "",
    "> Managed restaurant finance and operations support.",
    "",
    "Ready Margin provides agreed support with restaurant accounting, payroll, tips, reporting, food cost and operating work. Service scope and pricing are agreed through an enquiry. Software described as in development is not a released product. Illustrative workflows are not customer results.",
    "",
    `Website: ${origin}`,
    `Contact: ${settings.email}`,
  ];
  for (const [heading, kinds] of sections) {
    lines.push("", `## ${heading}`, "");
    for (const page of pages.filter(
      (p) => p.published && p.indexable && (kinds as readonly string[]).includes(p.kind),
    )) {
      lines.push(`- [${page.seoTitle || page.title}](${origin}${page.path}): ${page.description}`);
    }
  }
  lines.push("", "## New York", "", `- [Restaurant bookkeeping and payroll support in New York](${origin}/new-york-restaurant-bookkeeping)`, "");
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": isProduction() ? "noindex, follow" : "noindex, nofollow",
    },
  });
}
