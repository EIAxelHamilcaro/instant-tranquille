import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const ORIGIN = (process.argv[2] ?? "http://localhost:3210").replace(/\/$/, "");
const OUTPUT = join(import.meta.dirname, "../src/assets/share-scenes");
const WIDTH = 510;
const HEIGHT = 630;
const DENSITY = 2;
const PORT = 9461;
const SETTLE = 6000;
const PARALLAX = 2500;
const FISHING = 2000;

const SKIP_OPENING = "try{sessionStorage.setItem('ouverture','1')}catch(e){}";
const QUIET =
  "html{scroll-behavior:auto!important}nextjs-portal{display:none!important}";

const TABLEAUX = [
  { name: "pond-heron", path: "/le-gite", selector: ".berge-etang" },
  { name: "pond", path: "/", selector: ".berge-etang" },
  {
    name: "forest",
    path: "/guides/brame-du-cerf-en-sologne",
    selector: ".berge-foret",
  },
];

const ISOLATE = (selector) => `(() => {
  const scene = document.querySelector(${JSON.stringify(selector)});
  if (!scene) return false;

  const style = document.createElement("style");
  style.textContent = ${JSON.stringify(
    `${QUIET}[data-scene]{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;z-index:99999!important;margin:0!important;content-visibility:visible!important;overflow:hidden!important}[data-scene]>:not(.berge){visibility:hidden!important}.berge{content-visibility:visible!important}`,
  )};
  document.head.append(style);
  scene.parentElement.dataset.scene = "";

  return true;
})()`;

const FREEZE_OPENING = `(() => {
  for (const animation of document.getAnimations()) animation.pause();

  const style = document.createElement("style");
  style.textContent = ${JSON.stringify(
    `${QUIET}.ouverture-titre,.ouverture-commandes{visibility:hidden!important}`,
  )};
  document.head.append(style);

  return document.documentElement.hasAttribute("data-ouverture");
})()`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;

  const cache = join(homedir(), ".cache", "ms-playwright");
  const builds = existsSync(cache)
    ? readdirSync(cache)
        .filter((name) => /^chromium-\d+$/.test(name))
        .sort()
    : [];
  const latest = builds.at(-1);
  if (!latest) {
    throw new Error(
      "No Chromium found: set CHROME_PATH or run `npx playwright install chromium`",
    );
  }

  return join(cache, latest, "chrome-linux64", "chrome");
}

async function debuggerUrl() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const targets = await (
        await fetch(`http://127.0.0.1:${PORT}/json`)
      ).json();
      const page = targets.find((target) => target.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      await sleep(200);
    }
  }

  throw new Error("Chromium did not expose a debugging target");
}

const chrome = spawn(
  chromePath(),
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${mkdtempSync(join(tmpdir(), "share-scenes-"))}`,
    "--mute-audio",
    "--hide-scrollbars",
    `--window-size=${WIDTH},${HEIGHT}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);
const socket = new WebSocket(await debuggerUrl());
await new Promise((resolve) => socket.addEventListener("open", resolve));

const pending = new Map();
let nextId = 0;

socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (!message.id) return;

  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    nextId += 1;
    pending.set(nextId, { resolve, reject });
    socket.send(JSON.stringify({ id: nextId, method, params }));
  });

async function prepare(expression, name) {
  const { result } = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
  });
  if (!result.value) throw new Error(`Scene "${name}" was not found`);
}

async function save(name) {
  const { data } = await send("Page.captureScreenshot", { format: "png" });

  await sharp(Buffer.from(data, "base64"))
    .resize(WIDTH, HEIGHT)
    .png({ compressionLevel: 9, palette: true, quality: 95 })
    .toFile(join(OUTPUT, `${name}.png`));
  console.log(`${name}.png`);
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: WIDTH,
  height: HEIGHT,
  deviceScaleFactor: DENSITY,
  mobile: false,
});

const { identifier } = await send("Page.addScriptToEvaluateOnNewDocument", {
  source: SKIP_OPENING,
});

for (const { name, path, selector } of TABLEAUX) {
  await send("Page.navigate", { url: `${ORIGIN}${path}` });
  await sleep(SETTLE);
  await prepare(ISOLATE(selector), name);
  await sleep(PARALLAX);
  await save(name);
}

await send("Page.removeScriptToEvaluateOnNewDocument", { identifier });
await send("Page.navigate", { url: `${ORIGIN}/?ouverture` });
await sleep(FISHING);
await prepare(FREEZE_OPENING, "opening");
await save("opening");

socket.close();
chrome.kill();
