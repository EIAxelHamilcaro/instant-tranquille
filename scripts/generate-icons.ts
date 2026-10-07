import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

const ROOT = join(import.meta.dirname, "..");
const BACKGROUND = "#0e2b28";
const INK = "#e9ede5";
const HERON_BOX = { x: 3.5, y: 1, size: 62 };
const HERON = `
  <g fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M40 10c-6 0-9 3-7.5 8 1.5 5 7.5 7 7.5 13"/>
    <path fill="${INK}" stroke="none" d="M40 7.5 61 10 40 12.5ZM37.500 27.500C27 28 15 37 8 48c11 2 25 .5 31-6 3.500-4 3.700-8 3.500-12Z"/>
    <path stroke-width="4.5" d="M29 47v10"/>
  </g>`;

interface IconSpec {
  file: string;
  size: number;
  heronRatio: number;
  cornerRatio: number;
}

const APP_ICON = { heronRatio: 0.64, cornerRatio: 0.22 };
const FULL_BLEED = { cornerRatio: 0 };

const PNG_ICONS: IconSpec[] = [
  {
    file: "public/apple-touch-icon.png",
    size: 180,
    heronRatio: 0.62,
    ...FULL_BLEED,
  },
  { file: "public/icons/icon-192.png", size: 192, ...APP_ICON },
  { file: "public/icons/icon-512.png", size: 512, ...APP_ICON },
  {
    file: "public/icons/icon-maskable-512.png",
    size: 512,
    heronRatio: 0.5,
    ...FULL_BLEED,
  },
];
const FAVICON = { file: "src/app/favicon.ico", sizes: [16, 32, 48] };
const FAVICON_STYLE = { heronRatio: 0.74, cornerRatio: 0.2 };

function iconSvg({ size, heronRatio, cornerRatio }: Omit<IconSpec, "file">) {
  const scale = (size * heronRatio) / HERON_BOX.size;
  const offset = (size * (1 - heronRatio)) / 2;
  const translateX = offset - HERON_BOX.x * scale;
  const translateY = offset - HERON_BOX.y * scale;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * cornerRatio}" fill="${BACKGROUND}"/>
  <g transform="translate(${translateX} ${translateY}) scale(${scale})">${HERON}</g>
</svg>`;
}

function renderPng(spec: Omit<IconSpec, "file">) {
  const image = sharp(Buffer.from(iconSvg(spec)));

  return (
    spec.cornerRatio === 0 ? image.flatten({ background: BACKGROUND }) : image
  )
    .png({ compressionLevel: 9, palette: spec.cornerRatio === 0 })
    .toBuffer();
}

function buildIco(images: { size: number; png: Buffer }[]) {
  const HEADER_SIZE = 6;
  const ENTRY_SIZE = 16;
  const header = Buffer.alloc(HEADER_SIZE);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = HEADER_SIZE + ENTRY_SIZE * images.length;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(ENTRY_SIZE);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.byteLength, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.byteLength;

    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)]);
}

async function save(file: string, data: Buffer) {
  const path = join(ROOT, file);

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, data);
  console.log(`${file} (${data.byteLength} octets)`);
}

for (const { file, ...spec } of PNG_ICONS) {
  await save(file, await renderPng(spec));
}

const faviconImages = await Promise.all(
  FAVICON.sizes.map(async (size) => ({
    size,
    png: await renderPng({ size, ...FAVICON_STYLE }),
  })),
);

await save(FAVICON.file, buildIco(faviconImages));
