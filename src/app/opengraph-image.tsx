import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "L'Instant Tranquille — Gîte de charme en Sologne";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f0eb 0%, #e8ddd2 50%, #d4c5b0 100%)",
          position: "relative",
        }}
      >
        {/* Decorative top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "#4a7c59",
          }}
        />

        {/* Tree icon */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4a7c59"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginBottom: 24 }}
        >
          <path d="M12 22V14" />
          <path d="M6 14h12l-2.5-4H16l2-3h-3l-3-5-3 5H6l2 3H5.5L6 14z" />
        </svg>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#2d2418",
            letterSpacing: "-0.02em",
            marginBottom: 12,
            fontFamily: "serif",
          }}
        >
          L&apos;Instant Tranquille
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: 80,
            height: 3,
            background: "#4a7c59",
            borderRadius: 2,
            marginBottom: 20,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: "#6b5d4f",
            fontFamily: "sans-serif",
          }}
        >
          Gîte de charme en Sologne
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 16,
            color: "#8b7d6f",
            fontFamily: "sans-serif",
          }}
        >
          <span>Châteaux de la Loire</span>
          <span style={{ color: "#4a7c59" }}>•</span>
          <span>Nature préservée</span>
          <span style={{ color: "#4a7c59" }}>•</span>
          <span>Calme absolu</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
