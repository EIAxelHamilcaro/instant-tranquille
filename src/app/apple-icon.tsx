import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf6f1",
          borderRadius: "36px",
        }}
      >
        <svg
          viewBox="0 0 32 32"
          width="120"
          height="120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="14" y="20" width="4" height="8" rx="1" fill="#4a7c59" />
          <polygon points="16,2 8,14 24,14" fill="#4a7c59" />
          <polygon points="16,7 6,19 26,19" fill="#4a7c59" opacity="0.85" />
          <polygon points="16,12 5,24 27,24" fill="#4a7c59" opacity="0.7" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
