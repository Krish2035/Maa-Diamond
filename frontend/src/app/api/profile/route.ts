import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://maa-diamond.onrender.com/api";

export async function GET() {
  try {
    const cleanBackendUrl = BACKEND_URL.replace(/\/$/, "");
    const targetUrl = cleanBackendUrl.endsWith("/api")
      ? `${cleanBackendUrl}/profile`
      : `${cleanBackendUrl}/api/profile`;

    const res = await fetch(targetUrl, {
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to load profile" }, { status: 502 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");
    const cleanBackendUrl = BACKEND_URL.replace(/\/$/, "");
    const targetUrl = cleanBackendUrl.endsWith("/api")
      ? `${cleanBackendUrl}/profile`
      : `${cleanBackendUrl}/api/profile`;

    const res = await fetch(targetUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 502 });
  }
}
