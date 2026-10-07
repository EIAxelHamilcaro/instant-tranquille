import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import {
  SHARE_IMAGE_SIZE,
  type ShareFigure,
  type SharePanel,
  type ShareScene,
} from "./spec";

const { width: WIDTH, height: HEIGHT } = SHARE_IMAGE_SIZE;
const PHOTO_WIDTH = 690;
const PANEL_WIDTH = WIDTH - PHOTO_WIDTH;
const CARD_LEFT = 34;
const CARD_WIDTH = PHOTO_WIDTH - 2 * CARD_LEFT;
const CARD_PADDING = 32;
const CARD_BOTTOM = 34;
const PANEL_PADDING = 44;
const TEXT_WIDTH = CARD_WIDTH - 2 * CARD_PADDING;
const WATERLINE = 256;
const FIGURE_SCALE = [
  { count: 1, size: 156, label: 34 },
  { count: 2, size: 116, label: 29 },
  { count: 4, size: 104, label: 26 },
];
const SUBJECT_LINE = 0.4;
const MAX_BYTES = 300_000;
const JPEG_QUALITIES = [84, 78, 72, 66];

const COLORS = {
  nuit: "#071917",
  etang: "#0e2b28",
  brume: "#e9ede5",
  bouleau: "#f8f9f4",
  lumiere: "#f2c66d",
  bruyere: "#93467a",
  encreDouce: "#4a5f59",
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
const SCENE_DIRECTORY = join(process.cwd(), "src/assets/share-scenes");

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

const scenes = new Map<ShareScene, Promise<Buffer>>();

function loadScene(scene: ShareScene) {
  const cached = scenes.get(scene);
  if (cached) return cached;

  const loading = readFile(join(SCENE_DIRECTORY, `${scene}.png`));
  scenes.set(scene, loading);

  return loading;
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

function Figures({ figures }: { figures: ShareFigure[] }) {
  const scale =
    FIGURE_SCALE.find(({ count }) => figures.length <= count) ??
    FIGURE_SCALE[FIGURE_SCALE.length - 1];
  if (!scale) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: PHOTO_WIDTH + PANEL_PADDING,
        top: WATERLINE,
        width: PANEL_WIDTH - 2 * PANEL_PADDING,
        height: HEIGHT - WATERLINE - CARD_BOTTOM,
        display: "flex",
        flexWrap: "wrap",
        alignContent: "flex-start",
        rowGap: 28,
      }}
    >
      {figures.map(({ value, label }) => (
        <div
          key={label}
          style={{
            width: scale.count === 4 ? "50%" : "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Bricolage",
              fontSize: scale.size,
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
              fontSize: scale.label,
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
      {panel ? <Figures figures={panel.figures} /> : null}

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
  const [background, picture, scene, overlay] = await Promise.all([
    canvas(),
    photo ? cropPhoto(photo, focal) : null,
    overlayProps.panel ? loadScene(overlayProps.panel.scene) : null,
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
      ...(scene ? [{ input: scene, left: PHOTO_WIDTH, top: 0 }] : []),
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
