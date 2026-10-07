import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { SHARE_IMAGE_SIZE } from "./spec";

const { width: WIDTH, height: HEIGHT } = SHARE_IMAGE_SIZE;
const SAFE_MARGIN = 60;
const TEXT_WIDTH = HEIGHT - 2 * 24;
const SUBJECT_LINE = 0.36;
const MAX_BYTES = 300_000;
const JPEG_QUALITIES = [84, 78, 72, 66];

const COLORS = {
  nuit: "#071917",
  etang: "#0e2b28",
  bouleau: "#f8f9f4",
  lumiere: "#f2c66d",
};

const TITLE_SCALE = [
  { size: 96, lines: 2 },
  { size: 84, lines: 2 },
  { size: 74, lines: 3 },
  { size: 64, lines: 3 },
  { size: 56, lines: 3 },
  { size: 50, lines: 3 },
];
const TITLE_GLYPH_RATIO = 0.4;
const TITLE_FILL = 0.86;
const SMALLEST_TITLE = { size: 50, lines: 3 };
const PROOF_SCALE = [
  { size: 35, maxLength: 37 },
  { size: 30, maxLength: 44 },
];
const SMALLEST_PROOF = 26;

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

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingTop: SAFE_MARGIN - 14,
          paddingBottom: 16,
          paddingLeft: 26,
          paddingRight: 30,
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          background: COLORS.bouleau,
          color: COLORS.etang,
          fontFamily: "Bricolage",
          fontSize: 34,
          letterSpacing: "-0.01em",
          lineHeight: 1,
        }}
      >
        <svg
          viewBox="0 0 64 64"
          width="46"
          height="46"
          fill="none"
          stroke={COLORS.etang}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M40 10c-6 0-9 3-7.5 8 1.5 5 7.5 7 7.5 13" />
          <path
            fill={COLORS.etang}
            stroke="none"
            d="M40 8 60 10 40 12ZM38 27.5C27 28 15 37 8 48c11 2 25 .5 31-6 3.5-4 3.6-8 3-12Z"
          />
          <path strokeWidth="3" d="M29 47v9.5" />
          <ellipse cx="29" cy="56.5" rx="18" ry="4.5" strokeWidth="3" />
        </svg>
        {siteName}
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 130,
          paddingBottom: SAFE_MARGIN - 6,
          backgroundImage:
            "linear-gradient(to bottom, rgba(7,25,23,0) 0px, rgba(7,25,23,0.32) 45px, rgba(7,25,23,0.7) 95px, rgba(7,25,23,0.87) 130px, rgba(7,25,23,0.95) 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: TEXT_WIDTH,
            textAlign: "center",
            textWrap: "balance",
            fontFamily: "Bricolage",
            fontSize: fitted.size,
            lineHeight: 0.96,
            letterSpacing: "-0.02em",
            color: COLORS.bouleau,
          }}
        >
          {fitted.text}
        </div>
        {proof ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: TEXT_WIDTH,
              marginTop: 18,
              textAlign: "center",
              fontFamily: "Newsreader",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: proofSize(proof),
              lineHeight: 1.15,
              color: COLORS.lumiere,
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
