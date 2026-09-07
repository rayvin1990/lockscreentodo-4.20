// Compatibility shim: Next.js serves app/manifest.ts at /manifest.webmanifest,
// but Googlebot and older links request /manifest.json. Serve the identical
// manifest there so /manifest.json returns JSON instead of the SPA homepage.
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export function GET() {
  const manifest: MetadataRoute.Manifest = {
    name: "Lockscreen Todo: Your Notion Tasks on Your Lock Screen Wallpaper",
    short_name: "Lockscreen Todo",
    description:
      "Turn your Notion to-do list into a phone lock screen wallpaper. Free, read-only OAuth, no app install.",
    start_url: "/en",
    display: "standalone",
    background_color: "#0f0f13",
    theme_color: "#6c5ce7",
    orientation: "portrait",
    categories: ["productivity", "utilities"],
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
