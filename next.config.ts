import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const PAGES = ["/", "/day", "/week", "/month", "/year", "/settings"];
const revision = Date.now().toString();

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
  // Static export: precache every page so the app opens offline.
  // The .txt files are the RSC payloads that next/link fetches on client-side navigation.
  additionalPrecacheEntries: PAGES.flatMap((url) => [
    { url, revision },
    { url: `${url === "/" ? "/index" : url}.txt`, revision },
  ]),
});

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default withSerwist(nextConfig);
