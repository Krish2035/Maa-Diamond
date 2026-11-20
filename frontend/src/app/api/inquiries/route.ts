import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://maa-diamond.onrender.com/api";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cleanBackendUrl = BACKEND_URL.replace(/\/$/, "");
    const targetUrl = cleanBackendUrl.endsWith("/api")
      ? `${cleanBackendUrl}/inquiries`
      : `${cleanBackendUrl}/api/inquiries`;

    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to load inquiries" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idempotency = request.headers.get("x-idempotency-key");
    const authHeader = request.headers.get("authorization");
    const cleanBackendUrl = BACKEND_URL.replace(/\/$/, "");
    const targetUrl = cleanBackendUrl.endsWith("/api")
      ? `${cleanBackendUrl}/inquiries`
      : `${cleanBackendUrl}/api/inquiries`;

    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
        ...(idempotency ? { "X-Idempotency-Key": idempotency } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 502 });
  }
}
