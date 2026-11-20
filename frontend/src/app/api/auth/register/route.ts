import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://maa-diamond.onrender.com/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cleanBackendUrl = BACKEND_URL.replace(/\/$/, "");
    const targetUrl = cleanBackendUrl.endsWith("/api")
      ? `${cleanBackendUrl}/auth/register`
      : `${cleanBackendUrl}/api/auth/register`;

    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Auth register proxy error:", error);
    return NextResponse.json(
      { error: "Backend registration service is waking up or unreachable. Please try again shortly." },
      { status: 502 }
    );
  }
}
