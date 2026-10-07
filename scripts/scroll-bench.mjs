import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";

const ORIGIN = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const PATHS = (
  process.argv[3] ??
  "/,/le-gite,/les-alentours,/guides,/guides/amboise-et-clos-luce-depuis-romorantin,/tarifs-reservation,/contact"
).split(",");
const CPU_RATE = Number(process.env.BENCH_CPU ?? 4);
const PORT = 9333;
const SETTLE = 6000;
const MAX_TRAVEL = 16000;
const FRAME_BUDGET = 50;

const PROFILES = [
  {
    name: "bureau",
    width: 1440,
    height: 900,
    scale: 1,
    touch: false,
    pointer:
      "primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4",
  },
  {
    name: "telephone",
    width: 390,
    height: 844,
    scale: 3,
    touch: true,
    pointer:
      "primaryHoverType=1,availableHoverTypes=1,primaryPointerType=2,availablePointerTypes=2",
  },
];

const RECORDER = `(() => {
  const state = { deltas: [], running: true };
  let last = performance.now();
  const tick = (now) => {
    if (!state.running) return;
    state.deltas.push(now - last);
    last = now;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  window.__bench = state;
})()`;

const REPORT = `(() => {
  const state = window.__bench;
  state.running = false;
  const deltas = state.deltas.slice(1);
  const total = deltas.reduce((sum, delta) => sum + delta, 0);
  const sorted = [...deltas].sort((a, b) => a - b);

  return {
    fps: Math.round((deltas.length / total) * 1000),
    p95: Math.round(sorted[Math.floor(sorted.length * 0.95)] ?? 0),
    slow: deltas.filter((delta) => delta > ${FRAME_BUDGET}).length,
    travelled: Math.round(scrollY),
    smooth: document.documentElement.classList.contains("lenis"),
    hover: matchMedia("(hover: hover) and (pointer: fine)").matches,
  };
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

async function openBrowser(profile) {
  const chrome = spawn(
    chromePath(),
    [
      "--headless=new",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${mkdtempSync(join(tmpdir(), "scroll-bench-"))}`,
      "--mute-audio",
      `--window-size=${profile.width},${profile.height}`,
      `--blink-settings=${profile.pointer}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  const socket = new WebSocket(await debuggerUrl());
  await new Promise((resolve) => socket.addEventListener("open", resolve));

  const pending = new Map();
  const trace = { events: [], done: undefined, layers: 0 };
  let nextId = 0;

  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);

    if (message.method === "Tracing.dataCollected")
      trace.events.push(...message.params.value);
    if (message.method === "Tracing.tracingComplete") trace.done?.();
    if (
      message.method === "LayerTree.layerTreeDidChange" &&
      message.params.layers
    )
      trace.layers = message.params.layers.length;
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

  const evaluate = async (expression) => {
    const { result, exceptionDetails } = await send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (exceptionDetails) {
      throw new Error(
        exceptionDetails.exception?.description ?? "Page evaluation failed",
      );
    }

    return result.value;
  };

  const close = () => {
    socket.close();
    chrome.kill();
  };

  return { send, evaluate, trace, close };
}

async function scrollPage({ send }, profile, distance) {
  for (let travelled = 0; travelled < distance; travelled += 200) {
    await send("Input.dispatchMouseEvent", {
      type: "mouseWheel",
      x: profile.width / 2,
      y: profile.height / 2,
      deltaX: 0,
      deltaY: 200,
    });
    await sleep(30);
  }
}

async function measure(browser, profile, url) {
  const { send, evaluate, trace } = browser;

  await send("Emulation.setCPUThrottlingRate", { rate: 1 });
  await send("Page.navigate", { url });
  await sleep(SETTLE);

  const height = await evaluate("document.documentElement.scrollHeight");
  const distance = Math.min(height - profile.height, MAX_TRAVEL);

  await send("Emulation.setCPUThrottlingRate", { rate: CPU_RATE });
  await send("LayerTree.enable");
  trace.events = [];
  await send("Tracing.start", {
    transferMode: "ReportEvents",
    traceConfig: {
      includedCategories: ["disabled-by-default-devtools.timeline.frame"],
    },
  });
  await evaluate(RECORDER);
  await scrollPage(browser, profile, distance);
  await sleep(1500);
  const report = await evaluate(REPORT);

  const traced = new Promise((resolve) => {
    trace.done = resolve;
  });
  await send("Tracing.end");
  await traced;
  await send("LayerTree.disable");

  return {
    page: new URL(url).pathname,
    profil: profile.name,
    "images/s": report.fps,
    "p95 (ms)": report.p95,
    [`frames > ${FRAME_BUDGET} ms`]: report.slow,
    "frames perdues": trace.events.filter(
      (event) => event.name === "DroppedFrame",
    ).length,
    couches: trace.layers,
    "hauteur (px)": height,
    "parcouru (px)": report.travelled,
    pointeur: report.hover ? "souris" : "tactile",
    lenis: report.smooth,
  };
}

const rows = [];

for (const profile of PROFILES) {
  const browser = await openBrowser(profile);

  await browser.send("Page.enable");
  await browser.send("Runtime.enable");
  await browser.send("Network.enable");
  await browser.send("Network.setCacheDisabled", { cacheDisabled: true });
  await browser.send("Emulation.setDeviceMetricsOverride", {
    width: profile.width,
    height: profile.height,
    deviceScaleFactor: profile.scale,
    mobile: profile.touch,
  });
  await browser.send("Emulation.setTouchEmulationEnabled", {
    enabled: profile.touch,
  });

  for (const path of PATHS) {
    rows.push(await measure(browser, profile, `${ORIGIN}${path}`));
  }

  browser.close();
  await sleep(500);
}

console.table(rows);
