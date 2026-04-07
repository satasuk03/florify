import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Florify — ปลูก รดน้ำ เก็บสะสมต้นไม้",
    short_name: "Florify",
    description: "เกมสวนจิ๋วบนมือถือ ปลูกเมล็ด รดน้ำทุกวัน",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF8F3",
    theme_color: "#FBF8F3",
    orientation: "portrait",
    id: "/",
    categories: ["games", "entertainment"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
