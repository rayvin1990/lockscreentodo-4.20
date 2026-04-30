import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 极简防刷：记录 IP 和最后提交时间 (内存版，重启会重置，但对 Vercel 实例有效)
const rateLimit = new Map<string, number[]>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  
  // 1. 频率限制检查
  const now = Date.now();
  const userRequests = rateLimit.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < 60000); // 最近 1 分钟
  
  if (recentRequests.length >= 3) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Take a breath." },
      { status: 429 }
    );
  }
  
  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);

  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json(
        { ok: false, error: "Invalid email" },
        { status: 400 },
      );
    }

    const payload = {
      email,
      source: stringField(body.source),
      intent: stringField(body.intent),
      priceAnchor: typeof body.priceAnchor === "number" ? body.priceAnchor : null,
    };

    // 2. 同时也打个日志作为备份
    console.log("VibeRunner Waitlist Entry:", JSON.stringify(payload));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 },
    );
  }
}

function stringField(value: unknown) {
  return typeof value === "string" ? value.slice(0, 100) : null;
}
