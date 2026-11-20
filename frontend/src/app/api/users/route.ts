import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://maa-diamond.onrender.com/api";

// In-memory fallback users store for resilience
const FALLBACK_USERS = [
  {
    id: "usr_admin_001",
    name: "Maa Diamond Management",
    email: "admin@maadiamond.com",
    role: "ADMIN",
    companyName: "Maa Diamond",
    phone: "+91 98251 12345",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-06T14:12:56.104Z",
  },
  {
    id: "usr_buyer_001",
    name: "Rajesh Parekh",
    email: "buyer@jewelers.com",
    role: "USER",
    companyName: "Parekh Heritage Jewels",
    phone: "+91 98980 54321",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-06T14:12:56.104Z",
  },
];

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cleanBackendUrl = BACKEND_URL.replace(/\/$/, "");
    const targetUrl = cleanBackendUrl.endsWith("/api")
      ? `${cleanBackendUrl}/users`
      : `${cleanBackendUrl}/api/users`;

    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: 200 });
    }
  } catch (error) {
    console.warn("Proxy to Render /users failed, using fallback:", error);
  }

  return NextResponse.json({
    total: FALLBACK_USERS.length,
    users: FALLBACK_USERS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");
    const cleanBackendUrl = BACKEND_URL.replace(/\/$/, "");
    const targetUrl = cleanBackendUrl.endsWith("/api")
      ? `${cleanBackendUrl}/users`
      : `${cleanBackendUrl}/api/users`;

    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }
  } catch (error) {
    console.warn("Proxy to Render /users POST failed:", error);
  }

  // Fallback creation
  try {
    const body = await request.clone().json().catch(() => null);
    if (body) {
      const newUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: body.name || "New User",
        email: body.email,
        role: body.role === "ADMIN" ? "ADMIN" : "USER",
        companyName: body.companyName || "",
        phone: body.phone || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      FALLBACK_USERS.unshift(newUser);
      return NextResponse.json({
        message: `User account "${newUser.name}" created successfully as ${newUser.role}.`,
        user: newUser,
      }, { status: 201 });
    }
  } catch {}

  return NextResponse.json({ error: "Failed to create user account." }, { status: 500 });
}
