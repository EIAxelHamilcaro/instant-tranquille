import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

interface OGTemplateProps {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  tags?: string[];
}

export function renderOGTemplate({
  title,
  subtitle,
  imageSrc,
  tags,
}: OGTemplateProps) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        fontFamily: "sans-serif",
        background: "#2d2418",
      }}
    >
      {imageSrc && (
        // biome-ignore lint/performance/noImgElement: next/og ImageResponse ne supporte pas next/image
        <img
          src={imageSrc}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: imageSrc
            ? "linear-gradient(to right, rgba(20,14,8,0.82) 0%, rgba(20,14,8,0.55) 55%, rgba(20,14,8,0.25) 100%)"
            : "linear-gradient(135deg, #2d2418 0%, #3d3020 50%, #4a3828 100%)",
        }}
      />

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

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "56px 64px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4a7c59"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="L'Instant Tranquille"
          >
            <title>L&apos;Instant Tranquille</title>
            <path d="M12 22V14" />
            <path d="M6 14h12l-2.5-4H16l2-3h-3l-3-5-3 5H6l2 3H5.5L6 14z" />
          </svg>
          <span
            style={{
              fontSize: 15,
              color: "#c5b8a8",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            L&apos;Instant Tranquille
          </span>
        </div>

        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#fdfcf9",
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            marginBottom: subtitle ? 16 : 24,
            maxWidth: 700,
          }}
        >
          {title}
        </div>

        {subtitle && (
          <div
            style={{
              fontSize: 22,
              color: "#c5b8a8",
              marginBottom: 24,
              maxWidth: 600,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        )}

        {tags && tags.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 14,
                  color: "#4a7c59",
                  background: "rgba(74,124,89,0.15)",
                  border: "1px solid rgba(74,124,89,0.35)",
                  borderRadius: 4,
                  padding: "4px 12px",
                  letterSpacing: "0.04em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 36,
          right: 64,
          fontSize: 15,
          color: "#8b7d6f",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>Romorantin-Lanthenay</span>
        <span style={{ color: "#4a7c59" }}>·</span>
        <span>Sologne</span>
      </div>
    </div>,
    { ...OG_SIZE },
  );
}
