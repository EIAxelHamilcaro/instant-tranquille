import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { SHARE_IMAGE_SIZE } from "./spec";

const { width: WIDTH, height: HEIGHT } = SHARE_IMAGE_SIZE;
const CARD_WIDTH = HEIGHT - 2 * 24;
const CARD_PADDING = 34;
const CARD_BOTTOM = 34;
const TEXT_WIDTH = CARD_WIDTH - 2 * CARD_PADDING;
const STAMP = 84;
const RING_STEP = 150;
const RING_COUNT = 5;
const RING_REACH = RING_STEP * RING_COUNT;
const SUBJECT_LINE = 0.36;
const MAX_BYTES = 300_000;
const JPEG_QUALITIES = [84, 78, 72, 66];

const COLORS = {
  nuit: "#071917",
  etang: "#0e2b28",
  bouleau: "#f8f9f4",
  bruyere: "#93467a",
  encreDouce: "#4a5f59",
};

const TITLE_SCALE = [
  { size: 76, lines: 2 },
  { size: 66, lines: 2 },
  { size: 58, lines: 3 },
  { size: 52, lines: 3 },
  { size: 46, lines: 3 },
];
const TITLE_GLYPH_RATIO = 0.4;
const TITLE_FILL = 0.86;
const SMALLEST_TITLE = { size: 46, lines: 3 };
const PROOF_SCALE = [
  { size: 32, maxLength: 36 },
  { size: 28, maxLength: 42 },
];
const SMALLEST_PROOF = 25;

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
    WIDTH / upright.info.width,
    HEIGHT / upright.info.height,
  );
  const scaledWidth = Math.max(WIDTH, Math.round(upright.info.width * scale));
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
        (focal.x / 100) * scaledWidth - WIDTH / 2,
        scaledWidth - WIDTH,
      ),
      top: clamp(
        (focal.y / 100) * scaledHeight - HEIGHT * SUBJECT_LINE,
        scaledHeight - HEIGHT,
      ),
      width: WIDTH,
      height: HEIGHT,
    })
    .toBuffer();
}

function plainBackground() {
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
}

function Overlay({ siteName, title, proof }: OverlayProps) {
  const fitted = fitTitle(title);
  const stampCenter = CARD_PADDING + STAMP / 2;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: CARD_BOTTOM,
      }}
    >
      <div style={{ display: "flex", position: "relative", width: CARD_WIDTH }}>
        <svg
          width={RING_REACH * 2}
          height={RING_REACH * 2}
          viewBox={`0 0 ${RING_REACH * 2} ${RING_REACH * 2}`}
          fill="none"
          stroke={COLORS.bouleau}
          style={{
            position: "absolute",
            left: stampCenter - RING_REACH,
            top: -RING_REACH,
          }}
          aria-hidden="true"
        >
          {Array.from({ length: RING_COUNT }, (_, ring) => (
            <circle
              key={RING_STEP * (ring + 1)}
              cx={RING_REACH}
              cy={RING_REACH}
              r={RING_STEP * (ring + 1)}
              strokeWidth="1.5"
              strokeOpacity={0.46 - ring * 0.07}
            />
          ))}
        </svg>

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            paddingTop: STAMP / 2 + 22,
            paddingBottom: CARD_PADDING - 2,
            paddingLeft: CARD_PADDING,
            paddingRight: CARD_PADDING,
            borderRadius: 6,
            background: COLORS.bouleau,
            boxShadow: "0 22px 60px rgba(7, 25, 23, 0.38)",
          }}
        >
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
                marginTop: 16,
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

        <div
          style={{
            position: "absolute",
            left: CARD_PADDING,
            top: -STAMP / 2,
            width: STAMP,
            height: STAMP,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: STAMP / 2,
            border: `4px solid ${COLORS.bouleau}`,
            background: COLORS.etang,
          }}
        >
          <svg
            viewBox="0 0 64 64"
            width="50"
            height="50"
            fill="none"
            stroke={COLORS.bouleau}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M40 10c-6 0-9 3-7.5 8 1.5 5 7.5 7 7.5 13" />
            <path
              fill={COLORS.bouleau}
              stroke="none"
              d="M40 8 60 10 40 12ZM38 27.5C27 28 15 37 8 48c11 2 25 .5 31-6 3.5-4 3.6-8 3-12Z"
            />
            <path strokeWidth="3" d="M29 47v9.5" />
            <ellipse cx="29" cy="56.5" rx="18" ry="4.5" strokeWidth="3" />
          </svg>
        </div>

        <div
          style={{
            position: "absolute",
            left: CARD_PADDING + STAMP + 14,
            top: 12,
            display: "flex",
            fontFamily: "Bricolage",
            fontSize: 27,
            letterSpacing: "-0.01em",
            lineHeight: 1,
            color: COLORS.encreDouce,
          }}
        >
          {siteName}
        </div>
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
  const [background, overlay] = await Promise.all([
    photo ? cropPhoto(photo, focal) : plainBackground(),
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
    .composite([{ input: overlay }])
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
