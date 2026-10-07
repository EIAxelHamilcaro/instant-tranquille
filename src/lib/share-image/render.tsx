import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import type { PlaceCategory } from "@/lib/places";
import { SHARE_IMAGE_SIZE, type SharePanel } from "./spec";

const { width: WIDTH, height: HEIGHT } = SHARE_IMAGE_SIZE;
const PHOTO_WIDTH = 690;
const PANEL_WIDTH = WIDTH - PHOTO_WIDTH;
const CARD_LEFT = 34;
const CARD_WIDTH = PHOTO_WIDTH - 2 * CARD_LEFT;
const CARD_PADDING = 32;
const CARD_BOTTOM = 34;
const PANEL_PADDING = 44;
const TEXT_WIDTH = CARD_WIDTH - 2 * CARD_PADDING;
const ROSE_RADIUS = 208;
const ROSE_CENTER = { x: PHOTO_WIDTH + PANEL_WIDTH / 2, y: 252 };
const ROSE_RINGS = 6;
const ROSE_LABELLED_EVERY = 2;
const STAMP = 52;
const SUBJECT_LINE = 0.4;
const MAX_BYTES = 300_000;
const JPEG_QUALITIES = [84, 78, 72, 66];

const COLORS = {
  nuit: "#071917",
  etang: "#0e2b28",
  etangClair: "#1c423d",
  brume: "#e9ede5",
  bouleau: "#f8f9f4",
  lumiere: "#f2c66d",
  bruyere: "#93467a",
  encreDouce: "#4a5f59",
};

const CATEGORY_COLORS: Record<PlaceCategory, string> = {
  chateaux: "#d8b25a",
  equestre: "#e3a8cf",
  famille: "#e58a5f",
  nature: "#8fc7a2",
  villages: "#c9bda3",
  terroir: "#e49b9b",
  loire: "#89bec2",
  romorantin: "#86b9d6",
  pratique: "#a9b5ab",
};

const TITLE_SCALE = [
  { size: 72, lines: 2 },
  { size: 64, lines: 2 },
  { size: 56, lines: 3 },
  { size: 50, lines: 3 },
  { size: 44, lines: 3 },
];
const TITLE_GLYPH_RATIO = 0.4;
const TITLE_FILL = 0.86;
const SMALLEST_TITLE = { size: 44, lines: 3 };
const PROOF_SCALE = [
  { size: 30, maxLength: 36 },
  { size: 27, maxLength: 42 },
];
const SMALLEST_PROOF = 24;

const FONT_DIRECTORY = join(process.cwd(), "src/assets/fonts");

let fontsPromise: Promise<
  {
    name: string;
    data: Buffer;
    weight: 500 | 700;
    style: "normal" | "italic";
  }[]
> | null = null;

function loadFonts() {
  fontsPromise ??= Promise.all([
    readFile(join(FONT_DIRECTORY, "BricolageGrotesque-CondensedBold.ttf")),
    readFile(join(FONT_DIRECTORY, "Newsreader-MediumItalic.ttf")),
  ]).then(([bricolage, newsreader]) => [
    {
      name: "Bricolage",
      data: bricolage,
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: "Newsreader",
      data: newsreader,
      weight: 500 as const,
      style: "italic" as const,
    },
  ]);

  return fontsPromise;
}

function lineCapacity(size: number) {
  return TEXT_WIDTH / (size * TITLE_GLYPH_RATIO);
}

function titleCapacity({ size, lines }: { size: number; lines: number }) {
  return Math.floor(lineCapacity(size) * lines * TITLE_FILL);
}

function fitTitle(title: string) {
  const longestWord = Math.max(
    ...title.split(/\s+/).map((word) => word.length),
  );
  const step =
    TITLE_SCALE.find(
      (candidate) =>
        longestWord <= lineCapacity(candidate.size) &&
        title.length <= titleCapacity(candidate),
    ) ?? SMALLEST_TITLE;
  const capacity = titleCapacity(step);
  const text =
    title.length <= capacity
      ? title
      : `${title.slice(0, capacity).replace(/\s+\S*$/, "")}…`;

  return { size: step.size, text };
}

function proofSize(proof: string) {
  return (
    PROOF_SCALE.find(({ maxLength }) => proof.length <= maxLength)?.size ??
    SMALLEST_PROOF
  );
}

export interface FocalPoint {
  x: number;
  y: number;
}

async function cropPhoto(source: Buffer, focal: FocalPoint) {
  const upright = await sharp(source).rotate().toBuffer({
    resolveWithObject: true,
  });
  const scale = Math.max(
    PHOTO_WIDTH / upright.info.width,
    HEIGHT / upright.info.height,
  );
  const scaledWidth = Math.max(
    PHOTO_WIDTH,
    Math.round(upright.info.width * scale),
  );
  const scaledHeight = Math.max(
    HEIGHT,
    Math.round(upright.info.height * scale),
  );
  const clamp = (value: number, max: number) =>
    Math.round(Math.min(Math.max(value, 0), max));

  return sharp(upright.data)
    .resize(scaledWidth, scaledHeight)
    .extract({
      left: clamp(
        (focal.x / 100) * scaledWidth - PHOTO_WIDTH / 2,
        scaledWidth - PHOTO_WIDTH,
      ),
      top: clamp(
        (focal.y / 100) * scaledHeight - HEIGHT * SUBJECT_LINE,
        scaledHeight - HEIGHT,
      ),
      width: PHOTO_WIDTH,
      height: HEIGHT,
    })
    .toBuffer();
}

function canvas() {
  return sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 3,
      background: COLORS.etang,
    },
  })
    .png()
    .toBuffer();
}

interface OverlayProps {
  siteName: string;
  title: string;
  proof?: string | null;
  panel?: SharePanel | null;
}

function Heron({ size, color }: { size: number; color: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M40 10c-6 0-9 3-7.5 8 1.5 5 7.5 7 7.5 13" />
      <path
        fill={color}
        stroke="none"
        d="M40 8 60 10 40 12ZM38 27.5C27 28 15 37 8 48c11 2 25 .5 31-6 3.5-4 3.6-8 3-12Z"
      />
      <path strokeWidth="3" d="M29 47v9.5" />
      <ellipse cx="29" cy="56.5" rx="18" ry="4.5" strokeWidth="3" />
    </svg>
  );
}

function Rose({ panel }: { panel: Extract<SharePanel, { kind: "rose" }> }) {
  const span = ROSE_RADIUS * 2 + 40;
  const middle = span / 2;
  const ringStep = ROSE_RADIUS / ROSE_RINGS;
  const quiet = panel.points.filter((point) => !point.highlighted);
  const loud = panel.points.filter((point) => point.highlighted);
  const subject = panel.subject;

  return (
    <div
      style={{
        position: "absolute",
        left: ROSE_CENTER.x - middle,
        top: ROSE_CENTER.y - middle,
        width: span,
        height: span,
        display: "flex",
      }}
    >
      <svg
        width={span}
        height={span}
        viewBox={`0 0 ${span} ${span}`}
        fill="none"
        aria-hidden="true"
      >
        {Array.from({ length: ROSE_RINGS }, (_, ring) => (
          <circle
            key={ringStep * (ring + 1)}
            cx={middle}
            cy={middle}
            r={ringStep * (ring + 1)}
            stroke={COLORS.brume}
            strokeWidth={(ring + 1) % ROSE_LABELLED_EVERY === 0 ? 1.5 : 1}
            strokeOpacity={(ring + 1) % ROSE_LABELLED_EVERY === 0 ? 0.42 : 0.2}
          />
        ))}
        {subject ? (
          <line
            x1={middle}
            y1={middle}
            x2={middle + subject.x * ROSE_RADIUS}
            y2={middle + subject.y * ROSE_RADIUS}
            stroke={COLORS.lumiere}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ) : null}
        {quiet.map((point, index) => (
          <circle
            key={`quiet-${index}-${point.x}`}
            cx={middle + point.x * ROSE_RADIUS}
            cy={middle + point.y * ROSE_RADIUS}
            r="3.4"
            fill={CATEGORY_COLORS[point.category]}
            fillOpacity="0.62"
          />
        ))}
        {loud.map((point, index) => (
          <circle
            key={`loud-${index}-${point.x}`}
            cx={middle + point.x * ROSE_RADIUS}
            cy={middle + point.y * ROSE_RADIUS}
            r="7.5"
            fill={CATEGORY_COLORS[point.category]}
            stroke={COLORS.etang}
            strokeWidth="2.5"
          />
        ))}
        {subject ? (
          <circle
            cx={middle + subject.x * ROSE_RADIUS}
            cy={middle + subject.y * ROSE_RADIUS}
            r="10"
            fill={COLORS.lumiere}
            stroke={COLORS.etang}
            strokeWidth="3"
          />
        ) : null}
      </svg>

      {panel.ringLabels.map((label, index) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: middle + 6,
            top: middle - ringStep * ROSE_LABELLED_EVERY * (index + 1) - 21,
            display: "flex",
            fontFamily: "Bricolage",
            fontSize: 17,
            lineHeight: 1,
            color: COLORS.brume,
            opacity: 0.72,
          }}
        >
          {label}
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          left: middle - STAMP / 2,
          top: middle - STAMP / 2,
          width: STAMP,
          height: STAMP,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: STAMP / 2,
          background: COLORS.bouleau,
        }}
      >
        <Heron size={30} color={COLORS.etang} />
      </div>

      {subject ? (
        <div
          style={{
            position: "absolute",
            left:
              middle + subject.x * ROSE_RADIUS + (subject.x > 0.35 ? -96 : 16),
            top:
              middle + subject.y * ROSE_RADIUS + (subject.y > 0.5 ? -44 : 12),
            display: "flex",
            padding: "5px 11px 6px",
            borderRadius: 99,
            background: COLORS.lumiere,
            color: COLORS.nuit,
            fontFamily: "Bricolage",
            fontSize: 23,
            lineHeight: 1,
          }}
        >
          {subject.label}
        </div>
      ) : null}
    </div>
  );
}

function RoseLegend({
  panel,
}: {
  panel: Extract<SharePanel, { kind: "rose" }>;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: PHOTO_WIDTH + PANEL_PADDING,
        right: PANEL_PADDING,
        bottom: CARD_BOTTOM,
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "Bricolage",
          fontSize: 27,
          lineHeight: 1.02,
          letterSpacing: "-0.01em",
          color: COLORS.bouleau,
        }}
      >
        {panel.count}
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "Newsreader",
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 22,
          lineHeight: 1.15,
          color: COLORS.lumiere,
        }}
      >
        {panel.caption}
      </div>
    </div>
  );
}

function Figures({
  panel,
}: {
  panel: Extract<SharePanel, { kind: "figures" }>;
}) {
  const large = panel.figures.length <= 2;

  return (
    <div
      style={{
        position: "absolute",
        left: PHOTO_WIDTH + PANEL_PADDING,
        top: 0,
        width: PANEL_WIDTH - 2 * PANEL_PADDING,
        height: HEIGHT,
        display: "flex",
        flexWrap: "wrap",
        alignContent: "center",
        rowGap: large ? 54 : 64,
      }}
    >
      {panel.figures.map(({ value, label }) => (
        <div
          key={label}
          style={{
            width: large ? "100%" : "50%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Bricolage",
              fontSize: large ? 168 : 136,
              lineHeight: 0.88,
              letterSpacing: "-0.03em",
              color: COLORS.bouleau,
            }}
          >
            {value}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 8,
              fontFamily: "Newsreader",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: large ? 34 : 29,
              lineHeight: 1.1,
              color: COLORS.lumiere,
            }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

function Overlay({ siteName, title, proof, panel }: OverlayProps) {
  const fitted = fitTitle(title);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        paddingLeft: CARD_LEFT,
        paddingBottom: CARD_BOTTOM,
      }}
    >
      {panel?.kind === "rose" ? <Rose panel={panel} /> : null}
      {panel?.kind === "rose" ? <RoseLegend panel={panel} /> : null}
      {panel?.kind === "figures" ? <Figures panel={panel} /> : null}

      <div
        style={{
          width: CARD_WIDTH,
          display: "flex",
          flexDirection: "column",
          paddingTop: 24,
          paddingBottom: CARD_PADDING - 4,
          paddingLeft: CARD_PADDING,
          paddingRight: CARD_PADDING,
          borderRadius: 6,
          background: COLORS.bouleau,
          boxShadow: "0 22px 60px rgba(7, 25, 23, 0.45)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            marginBottom: 16,
            fontFamily: "Bricolage",
            fontSize: 25,
            letterSpacing: "-0.01em",
            lineHeight: 1,
            color: COLORS.encreDouce,
          }}
        >
          <Heron size={30} color={COLORS.etang} />
          {siteName}
        </div>
        <div
          style={{
            display: "flex",
            textWrap: "balance",
            fontFamily: "Bricolage",
            fontSize: fitted.size,
            lineHeight: 0.96,
            letterSpacing: "-0.02em",
            color: COLORS.etang,
          }}
        >
          {fitted.text}
        </div>
        {proof ? (
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontFamily: "Newsreader",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: proofSize(proof),
              lineHeight: 1.15,
              color: COLORS.bruyere,
            }}
          >
            {proof}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export interface ShareImageInput extends OverlayProps {
  photo?: Buffer | null;
  focal?: FocalPoint;
}

export async function renderShareImage({
  photo,
  focal = { x: 50, y: 50 },
  ...overlayProps
}: ShareImageInput) {
  const [background, picture, overlay] = await Promise.all([
    canvas(),
    photo ? cropPhoto(photo, focal) : null,
    loadFonts()
      .then((fonts) =>
        new ImageResponse(<Overlay {...overlayProps} />, {
          ...SHARE_IMAGE_SIZE,
          fonts,
        }).arrayBuffer(),
      )
      .then((data) => Buffer.from(data)),
  ]);
  const composed = await sharp(background)
    .composite([
      ...(picture ? [{ input: picture, left: 0, top: 0 }] : []),
      { input: overlay },
    ])
    .removeAlpha()
    .png({ compressionLevel: 0 })
    .toBuffer();

  let image = composed;

  for (const quality of JPEG_QUALITIES) {
    image = await sharp(composed)
      .jpeg({ quality, mozjpeg: true, chromaSubsampling: "4:2:0" })
      .toBuffer();

    if (image.byteLength <= MAX_BYTES) break;
  }

  return image;
}
