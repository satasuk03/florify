import type { Metadata, Viewport } from "next";
import { Fraunces, Sarabun } from "next/font/google";
import { StoreHydrator } from "@/store/StoreHydrator";
import { ToastContainer } from "@/components/ToastContainer";
import { MobileFrame } from "@/components/MobileFrame";
import { SPECIES } from "@/data/species";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sarabun",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-fraunces",
});

// NOTE: static export — Next.js resolves `metadataBase` at build time and
// inlines absolute URLs for the OG/Twitter image tags, so crawlers and
// unfurlers work even though there is no server runtime in production.
const SITE_URL = "https://florify.zeze.app";

const speciesCount = SPECIES.length;
const titleEN = `Florify — Plant, water & collect ${speciesCount}+ unique tree species`;
const titleTH = `Florify — ปลูก รดน้ำ เก็บสะสมต้นไม้กว่า ${speciesCount} สายพันธุ์`;
const descriptionEN =
  `A tiny mobile-first garden game. Plant a seed, water it daily, and collect ${speciesCount}+ unique tree species in your personal gallery.`;
const descriptionTH =
  `เกมสวนจิ๋วบนมือถือ ปลูกเมล็ด รดน้ำทุกวัน แล้วเก็บสะสมต้นไม้กว่า ${speciesCount} สายพันธุ์ในแกลเลอรีของคุณเอง`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: titleTH,
    template: "%s · Florify",
  },
  description: `${descriptionTH} · ${descriptionEN}`,
  applicationName: "Florify",
  keywords: [
    "Florify",
    "ปลูกต้นไม้",
    "เกมปลูกต้นไม้",
    "สวนจิ๋ว",
    "เกมสะสม",
    "plant game",
    "gardening game",
    "idle garden",
    "tree species",
    "collect trees",
    "mobile web game",
  ],
  authors: [{ name: "Florify" }],
  creator: "Florify",
  publisher: "Florify",
  alternates: {
    canonical: "/",
    languages: {
      "th-TH": "/",
      "en-US": "/",
    },
  },
  openGraph: {
    type: "website",
    siteName: "Florify",
    title: titleTH,
    description: descriptionTH,
    url: SITE_URL,
    locale: "th_TH",
    alternateLocale: ["en_US"],
    // The /opengraph-image route (next/og) is auto-wired by Next.js; no
    // explicit `images` entry is required here.
  },
  twitter: {
    card: "summary_large_image",
    title: titleEN,
    description: descriptionEN,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "game",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FBF8F3",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${sarabun.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream-50 md:bg-cream-200 text-ink-900">
        <StoreHydrator />
        <MobileFrame>{children}</MobileFrame>
        <ToastContainer />
      </body>
    </html>
  );
}
