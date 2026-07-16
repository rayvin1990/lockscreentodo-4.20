import { ImageResponse } from "next/og";
import { siteConfig } from "~/config/site";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en";
  const title =
    lang === "zh"
      ? "你的 Notion 任务没在锁屏上,为什么不?"
      : "Your Notion tasks aren't on your lock screen. Why not?";
  const subtitle =
    lang === "zh"
      ? "连接一次 Notion,任务自动出现在锁屏。"
      : "Connect Notion once. Today's tasks on your lock screen automatically.";
  const cta = lang === "zh" ? "立即试用" : "Try free";
  const eyebrow =
    lang === "zh" ? "把 Notion 搬到锁屏" : "Notion on your lock screen";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 50%, #0a0e1a 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#4ade80",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 36,
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 920,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#94a3b8",
            marginTop: 36,
            maxWidth: 900,
          }}
        >
          {subtitle}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 56,
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              background: "#4ade80",
              color: "#000000",
              padding: "20px 40px",
              fontSize: 22,
              fontWeight: 700,
              borderRadius: 8,
              letterSpacing: 1,
            }}
          >
            {cta}
          </div>
          <div
            style={{
              display: "flex",
              color: "#94a3b8",
              fontSize: 20,
            }}
          >
            {siteConfig.url}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 60,
            right: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#4ade80",
            fontSize: 100,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          ✓
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}