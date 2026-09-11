import { eventNames } from "@/lib/analytics";
export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 1024) return new Response(null, { status: 413 });
    const { event, path } = JSON.parse(raw);
    if (
      !eventNames.includes(event) ||
      typeof path !== "string" ||
      !/^\/[a-z0-9/-]*$/.test(path) ||
      path.length > 200
    )
      return new Response(null, { status: 400 });
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin)
      return new Response(null, { status: 403 });
    const url = process.env.ANALYTICS_WEBHOOK_URL;
    if (url?.startsWith("https://"))
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.ANALYTICS_WEBHOOK_TOKEN
            ? { Authorization: `Bearer ${process.env.ANALYTICS_WEBHOOK_TOKEN}` }
            : {}),
        },
        body: JSON.stringify({ event, path }),
        signal: AbortSignal.timeout(3000),
      });
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 400 });
  }
}
