import type { MetadataRoute } from "next";

// App Router manifest convention -> served at /manifest.json and auto-linked
// from <head>. Replaces an old public/manifest.json left over from a different
// project (it still advertised "Desktop Todo").
export default function manifest(): MetadataRoute.Manifest {
  return {
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
}
