import { ImageResponse } from "next/og";

// Static export friendly: this route is evaluated at `next build` and emitted
// as a plain PNG under /opengraph-image.png. No server runtime involved.
export const dynamic = "force-static";

export const alt =
  "Florify — ปลูก รดน้ำ เก็บสะสมต้นไม้สุ่มสร้างของคุณเอง / Plant, water, and collect procedurally-generated trees";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fraunces 700 — same serif used by the in-app wordmark. Fetched from Google
// Fonts at build time. Only Latin glyphs are needed here; the Thai tagline
// falls back to Satori's bundled Noto Sans Thai-compatible default, which is
// fine for static OG rendering.
async function loadFraunces(): Promise<ArrayBuffer> {
  const cssRes = await fetch(
    "https://fonts.googleapis.com/css2?family=Fraunces:wght@700&display=swap",
    { headers: { "User-Agent": "Mozilla/5.0" } },
  );
  const css = await cssRes.text();
  const match = css.match(
    /src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/,
  );
  const url = match?.[1];
  if (!url) throw new Error("Fraunces font URL not found in Google CSS");
  const fontRes = await fetch(url);
  return fontRes.arrayBuffer();
}

export default async function Image() {
  const fraunces = await loadFraunces();

  // Brand tokens mirror apps/web/src/app/globals.css
  const cream50 = "#FBF8F3";
  const cream200 = "#EEE6D6";
  const cream300 = "#E3D7C0";
  const ink900 = "#2B241B";
  const ink500 = "#6B5E4B";
  const leaf500 = "#6B8E4E";
  const clay500 = "#C7825A";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 20% 20%, ${cream200} 0%, ${cream50} 60%)`,
        position: "relative",
        fontFamily: "Fraunces, serif",
      }}
    >
      {/* Decorative soft blobs */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 420,
          height: 420,
          borderRadius: 9999,
          background: cream300,
          opacity: 0.55,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -160,
          left: -100,
          width: 480,
          height: 480,
          borderRadius: 9999,
          background: cream200,
          opacity: 0.7,
          display: "flex",
        }}
      />

      {/* Small leaf mark above the wordmark */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 28,
          color: leaf500,
          fontSize: 28,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        {/* Pure-CSS leaf dot — avoids pulling a dynamic emoji font at build time */}
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 9999,
            background: leaf500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 9999,
              background: cream50,
              display: "flex",
            }}
          />
        </div>
        <span>a tiny garden</span>
      </div>

      {/* Wordmark */}
      <div
        style={{
          fontSize: 220,
          fontWeight: 700,
          color: ink900,
          letterSpacing: "0.02em",
          lineHeight: 1,
          display: "flex",
        }}
      >
        Florify
      </div>

      {/* Thai tagline */}
      <div
        style={{
          marginTop: 36,
          fontSize: 42,
          color: ink900,
          fontWeight: 700,
          letterSpacing: "0.04em",
          display: "flex",
        }}
      >
        ปลูก · รดน้ำ · เก็บสะสมต้นไม้ของคุณเอง
      </div>

      {/* English tagline */}
      <div
        style={{
          marginTop: 16,
          fontSize: 30,
          color: ink500,
          fontStyle: "italic",
          display: "flex",
        }}
      >
        Plant, water, and collect procedurally-generated trees
      </div>

      {/* Footer URL pill */}
      <div
        style={{
          position: "absolute",
          bottom: 44,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 28px",
          borderRadius: 9999,
          background: cream50,
          border: `2px solid ${cream300}`,
          color: clay500,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "0.08em",
        }}
      >
        florify.zeze.app
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Fraunces",
          data: fraunces,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
