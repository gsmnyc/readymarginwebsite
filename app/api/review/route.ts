import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!endpoint) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 });
  }

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    const text = await upstream.text();
    let responseBody: unknown = { ok: upstream.ok };
    try {
      responseBody = JSON.parse(text);
    } catch {
      // Keep a stable JSON response even if the upstream service returns plain text.
    }
    return NextResponse.json(responseBody, { status: upstream.ok ? 200 : 502 });
  } catch {
    return NextResponse.json({ ok: false, error: 'upstream_unavailable' }, { status: 502 });
  }
}
