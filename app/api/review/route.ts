import { leadSchema } from "@/lib/forms";
export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 16000)
    return Response.json(
      { message: "Please keep the enquiry concise." },
      { status: 413 },
    );
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json(
      { message: "Please submit from this website." },
      { status: 403 },
    );
  try {
    const raw = await request.text();
    if (raw.length > 16000)
      return Response.json(
        { message: "Please keep the enquiry concise." },
        { status: 413 },
      );
    let input: unknown;
    try {
      input = JSON.parse(raw);
    } catch {
      return Response.json(
        { message: "Please submit a valid enquiry." },
        { status: 400 },
      );
    }
    const parsed = leadSchema.safeParse(input);
    if (!parsed.success)
      return Response.json(
        { message: "Check the required details and consent." },
        { status: 400 },
      );
    const legacy = !process.env.LEAD_WEBHOOK_URL && Boolean(process.env.GOOGLE_APPS_SCRIPT_URL);
    const url = process.env.LEAD_WEBHOOK_URL || process.env.GOOGLE_APPS_SCRIPT_URL;
    const token = process.env.LEAD_WEBHOOK_TOKEN;
    if (!url || (!legacy && !token))
      return Response.json(
        {
          message:
            "Online delivery is not connected yet. Please email contact@readymargin.com to arrange your review.",
        },
        { status: 503 },
      );
    if (!url.startsWith("https://"))
      return Response.json(
        {
          message:
            "Online delivery is temporarily unavailable. Please email contact@readymargin.com.",
        },
        { status: 503 },
      );
    const appsScript = legacy || process.env.LEAD_WEBHOOK_MODE === "apps-script";
    const target = new URL(url);
    const receivedAt = new Date().toISOString();
    // Identical enquiries within the same UTC day share a durable receipt key.
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(
        receivedAt.slice(0, 10) + JSON.stringify(parsed.data),
      ),
    );
    const submissionId = Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
    const response = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(!legacy ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        ...parsed.data,
        source: "ready-margin-website",
        receivedAt,
        submissionId,
        // Apps Script exposes the JSON body to doPost, but not request headers.
        ...(appsScript && !legacy ? { receiverToken: token } : {}),
        ...(legacy ? {
          company: parsed.data.business,
          phone: parsed.data.phone || "Not provided",
          locations: parsed.data.locations || "Not provided",
          revenue: "Not collected by this form",
          setup: parsed.data.systems || "Not provided",
          trigger: [parsed.data.concern, parsed.data.timing].filter(Boolean).join("\n") || "Restaurant Operations Review enquiry",
          needs: [],
          marketingOptIn: false,
          meetingRequested: false,
        } : {}),
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      return Response.json(
        {
          message:
            "Delivery could not be confirmed. Please retry or email contact@readymargin.com.",
        },
        { status: 502 },
      );
    if (appsScript) {
      const receipt = (await response.json().catch(() => null)) as {
        ok?: boolean;
      } | null;
      if (receipt?.ok !== true)
        return Response.json(
          {
            message:
              "Delivery could not be confirmed. Please retry or email contact@readymargin.com.",
          },
          { status: 502 },
        );
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      {
        message:
          "Delivery could not be confirmed. Your entries have been preserved; please retry or email contact@readymargin.com.",
      },
      { status: 502 },
    );
  }
}
