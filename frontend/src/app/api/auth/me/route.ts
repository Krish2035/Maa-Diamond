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
      ? `${cleanBackendUrl}/auth/me`
      : `${cleanBackendUrl}/api/auth/me`;

    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Auth me proxy error:", error);
    return NextResponse.json(
      { error: "Authentication service temporarily unreachable." },
      { status: 502 }
    );
  }
}
