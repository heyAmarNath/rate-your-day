import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rate Your Day",
    short_name: "Rate Day",
    description: "Rate each day from 1 to 5 and see your days in color.",
    start_url: "/day",
    scope: "/",
    display: "standalone",
    background_color: "#f7f7f5",
    theme_color: "#1c1c1a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
