"use client";

import Image from "next/image";
import {
  type ComponentType,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Emblem } from "@/components/shared/Logo";
import {
  formatDrive,
  type GeoPoint,
  type PlaceCategory,
  type PlottedPlace,
  placeRingTicks,
  plotPlaces,
  type RosePlace,
} from "@/lib/places";
import { cn } from "@/lib/utils";

const CENTER = 280;
const HERON_SCALE = 0.6;
const MAX_RADIUS = 236;
const RINGS = [15, 30, 45, 60, 75, 90];
const MAX_MINUTES = 90;
const MAX_LABELS = 12;
const COMPACT_FROM = 21;
const LABEL_LIMIT = 40;
const MAX_LABEL_LENGTH = 24;
const MAX_SECOND_LINE_LENGTH = 18;
const LABEL_OFFSET = MAX_RADIUS + 34;
const ELBOW_OFFSET = MAX_RADIUS + 14;
const BUBBLE_HEIGHT = 54;
const BUBBLE_REACH = 244;
const TOUR_DELAY = 4200;
const EXIT_DELAY = 280;
const IDLE_DELAY = 7000;
const VIEW_BOX = { x: -240, y: -12, width: 1040, height: 584 };
const HOVER_REACH = 18;
const TAP_REACH = 30;
const TICK_BOX = { width: 64, height: 16, clearance: 9 };
const TARGET_INSET = LABEL_OFFSET - 12;
const TARGET_WIDTH = CENTER - VIEW_BOX.x - TARGET_INSET;

type PreviewSpot =
  | "bas"
  | "gauche"
  | "droite"
  | "marge-gauche"
  | "marge-droite";

const COVERED_COLUMN: Record<PreviewSpot, PlottedPlace["side"] | null> = {
  bas: null,
  gauche: "left",
  droite: "right",
  "marge-gauche": "left",
  "marge-droite": "right",
};

const bearingOf = (place: PlottedPlace) =>
  (Math.round(
    (Math.atan2(place.x - CENTER, CENTER - place.y) * 180) / Math.PI,
  ) +
    360) %
  360;

function outwardSide(place: PlottedPlace): PreviewSpot {
  const deltaX = place.x - CENTER;
  const deltaY = place.y - CENTER;

  if (deltaY < 0 || Math.abs(deltaX) >= Math.abs(deltaY) * 0.6)
    return deltaX < 0 ? "gauche" : "droite";

  return "bas";
}

const facingMargin = (place: PlottedPlace): PreviewSpot =>
  place.side === "right" ? "marge-gauche" : "marge-droite";

const turnTo = (heading: number, bearing: number) =>
  heading + ((((bearing - heading) % 360) + 540) % 360) - 180;

const percent = (value: number, start: number, size: number) =>
  `${(((value - start) / size) * 100).toFixed(3)}%`;

const shortLabel = (name: string, limit = MAX_LABEL_LENGTH) =>
  name.length > limit ? `${name.slice(0, limit).trimEnd()}…` : name;

function labelLines(name: string, compact: boolean) {
  const wordBreak = name.lastIndexOf(" ", MAX_LABEL_LENGTH);
  if (compact || name.length <= MAX_LABEL_LENGTH || wordBreak <= 0)
    return [shortLabel(name)];

  return [
    name.slice(0, wordBreak),
    shortLabel(name.slice(wordBreak + 1), MAX_SECOND_LINE_LENGTH),
  ];
}

const direction = (place: PlottedPlace) => (place.side === "right" ? 1 : -1);

function leaderPath(place: PlottedPlace) {
  const elbow = CENTER + direction(place) * ELBOW_OFFSET;
  const end = CENTER + direction(place) * (LABEL_OFFSET - 8);

  return `M${place.x} ${place.y} L${elbow} ${place.labelY} L${end} ${place.labelY}`;
}

function labelTarget(place: PlottedPlace, compact: boolean) {
  const height = compact ? 24 : 44;
  const inner = CENTER + direction(place) * TARGET_INSET;

  return {
    x: place.side === "right" ? inner : inner - TARGET_WIDTH,
    y: place.labelY - (compact ? 12 : 21),
    width: TARGET_WIDTH,
    height,
  };
}

function bubbleBox(place: PlottedPlace) {
  const width = Math.max(place.name.length * 10.4 + 32, 132);
  const reach = BUBBLE_REACH - width / 2;
  const x = Math.min(Math.max(place.x, CENTER - reach), CENTER + reach);
  const above = place.y - BUBBLE_HEIGHT - 18 > CENTER - MAX_RADIUS - 6;
  const y = above ? place.y - BUBBLE_HEIGHT - 18 : place.y + 18;

  return { x: x - width / 2, y, width, middle: x };
}

interface Departure {
  id: string;
  docked: boolean;
}

export interface DriveTimeRoseLabels {
  title: string;
  home: string;
  north: string;
  all: string;
  ring: string;
  hint: string;
  directions: string[];
  categories: Partial<Record<PlaceCategory, string>>;
}

export interface RoseFilterProps {
  className: string;
  isPressed: boolean;
  onPress: () => void;
  children: ReactNode;
}

export interface DriveTimeRoseProps {
  origin: GeoPoint;
  places: RosePlace[];
  labels: DriveTimeRoseLabels;
  Filter?: ComponentType<RoseFilterProps>;
  className?: string;
}

export function DriveTimeRose({
  origin,
  places,
  labels,
  Filter,
  className,
}: DriveTimeRoseProps) {
  const titleId = useId();
  const frame = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [category, setCategory] = useState<PlaceCategory | null>(null);
  const [touring, setTouring] = useState(true);
  const [heading, setHeading] = useState(0);
  const [departure, setDeparture] = useState<Departure | null>(null);
  const [dockedId, setDockedId] = useState<string | null>(null);
  const [aimed, setAimed] = useState(false);
  const previousId = useRef<string | null>(null);
  const previousDockedId = useRef<string | null>(null);
  const exitTimer = useRef<number | undefined>(undefined);
  const idleTimer = useRef<number | undefined>(undefined);

  const candidates =
    category === null
      ? places.filter(
          (place) => places.length <= MAX_LABELS || Boolean(place.featured),
        )
      : places.filter((place) => place.category === category);
  const labelledIds = new Set(
    [...candidates]
      .sort((a, b) => a.driveMin - b.driveMin)
      .slice(0, LABEL_LIMIT)
      .map((place) => place.id),
  );
  const compact = labelledIds.size >= COMPACT_FROM;

  const plotted = plotPlaces(
    places,
    {
      origin,
      center: CENTER,
      maxRadius: MAX_RADIUS,
      maxMinutes: MAX_MINUTES,
      labelGap: compact ? 24 : 46,
      minDistance: 15,
    },
    (place) => labelledIds.has(place.id),
  );
  const countByCategory = (item: PlaceCategory) =>
    places.filter((place) => place.category === item).length;
  const categories = [...new Set(places.map((place) => place.category))].filter(
    (item) => countByCategory(item) > 1,
  );
  const active = plotted.find((place) => place.id === activeId);
  const departing = plotted.find(
    (place) => place.id === departure?.id && place.id !== activeId,
  );
  const previews = [departing, active].filter(
    (place): place is PlottedPlace => place !== undefined,
  );
  const labelled = plotted.filter((place) => place.labelled);
  const tourStops = labelled
    .map((place) => ({ id: place.id, bearing: bearingOf(place) }))
    .sort((a, b) => a.bearing - b.bearing)
    .map((stop) => `${stop.id}:${stop.bearing}`)
    .join(" ");

  useEffect(() => {
    const element = frame.current;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!touring || !element || reducedMotion || !tourStops) return;

    const stops = tourStops.split(" ");
    let step = 0;
    let timer: number | undefined;
    let starter: number | undefined;

    const advance = () => {
      const [id, bearing] = (stops[step % stops.length] ?? "").split(":");
      if (!id) return;

      setActiveId(id);
      setDockedId((current) => (current === id ? null : current));
      setHeading((current) => turnTo(current, Number(bearing)));
      step += 1;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearInterval(timer);
        window.clearTimeout(starter);
        if (!entry?.isIntersecting) return;

        starter = window.setTimeout(advance, 900);
        timer = window.setInterval(advance, TOUR_DELAY);
      },
      { threshold: 0.5 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      window.clearTimeout(starter);
    };
  }, [touring, tourStops]);

  useEffect(
    () => () => {
      window.clearTimeout(idleTimer.current);
      window.clearTimeout(exitTimer.current);
    },
    [],
  );

  useEffect(() => {
    const leaving = previousId.current;
    const docked = previousDockedId.current === leaving;
    previousId.current = activeId;
    previousDockedId.current = dockedId;
    if (!leaving || leaving === activeId) return;

    setDeparture({ id: leaving, docked });
    window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => setDeparture(null), EXIT_DELAY);
  }, [activeId, dockedId]);

  const select = (id: string, fromLabel = false) => {
    const place = plotted.find((item) => item.id === id);
    if (!place) return;

    pause();
    setActiveId(id);
    setDockedId((current) => {
      if (fromLabel) return id;

      return current === id ? null : current;
    });
    setHeading((current) => turnTo(current, bearingOf(place)));
  };

  const placeNear = (event: React.MouseEvent<SVGSVGElement>, reach: number) => {
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix) return undefined;

    const pointer = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    const x = pointer.x + VIEW_BOX.x;
    const y = pointer.y + VIEW_BOX.y;
    const distanceTo = (place: PlottedPlace) =>
      Math.hypot(place.x - x, place.y - y);
    const [nearest] = plotted
      .filter((place) => category === null || place.category === category)
      .filter((place) => distanceTo(place) <= reach)
      .sort((a, b) => distanceTo(a) - distanceTo(b));

    return nearest;
  };

  const aim = (event: React.MouseEvent<SVGSVGElement>) => {
    const place = placeNear(event, HOVER_REACH);
    setAimed(place !== undefined);
    if (place && place.id !== activeId) select(place.id);
  };

  const pick = (event: React.MouseEvent<SVGSVGElement>) => {
    const { target } = event;
    if (target instanceof Element && target.closest(".rose-etiquette")) return;

    const place = placeNear(event, TAP_REACH);
    if (place) select(place.id);
  };

  const pause = () => {
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setTouring(true), IDLE_DELAY);
    setTouring(false);
  };

  const release = () => {
    if (touring) return;

    window.clearTimeout(idleTimer.current);
    setActiveId(null);
    setTouring(true);
  };

  const filter = (next: PlaceCategory | null) => {
    window.clearTimeout(idleTimer.current);
    setActiveId(null);
    setCategory(next);
    setTouring(true);
  };

  const spotOf = (place: PlottedPlace) =>
    place.id === dockedId || (place === departing && departure?.docked)
      ? facingMargin(place)
      : outwardSide(place);

  const coveredColumn = active ? COVERED_COLUMN[spotOf(active)] : null;
  const focused = !touring && activeId !== null;
  const bubble = active && bubbleBox(active);
  const ticks = placeRingTicks(
    RINGS.map((minutes) => (minutes / MAX_MINUTES) * MAX_RADIUS),
    plotted,
    { center: CENTER, ...TICK_BOX },
  );

  const reach = active
    ? Math.min(
        Math.hypot(active.x - CENTER, active.y - CENTER) + 18,
        MAX_RADIUS,
      )
    : MAX_RADIUS;
  const middleX = CENTER - VIEW_BOX.x;
  const middleY = CENTER - VIEW_BOX.y;
  const spread = MAX_RADIUS * Math.sin(Math.PI / 15);
  const rise = MAX_RADIUS * Math.cos(Math.PI / 15);

  return (
    <div ref={frame} className={cn("rose-cadre", className)}>
      {Filter && (
        <div className="rose-filtres">
          <Filter
            className="pastille pastille-ronde"
            isPressed={category === null}
            onPress={() => filter(null)}
          >
            {labels.all}
            <span className="compte">{places.length}</span>
          </Filter>
          {categories.map((item) => (
            <Filter
              key={item}
              className={cn("pastille pastille-ronde", `categorie-${item}`)}
              isPressed={category === item}
              onPress={() => filter(category === item ? null : item)}
            >
              {labels.categories[item] ?? item}
              <span className="compte">{countByCategory(item)}</span>
            </Filter>
          ))}
        </div>
      )}

      {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer leave only clears the hover preview, every place stays reachable by keyboard */}
      <div className="rose-scene" onMouseLeave={release}>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: pointer picks the nearest marker, each marker stays focusable and selects itself on focus */}
        <svg
          className="rose"
          viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
          role="group"
          aria-labelledby={titleId}
          data-anime
          data-apercu={active ? spotOf(active) : undefined}
          data-vise={aimed ? "" : undefined}
          onMouseMove={aim}
          onMouseLeave={() => setAimed(false)}
          onClick={pick}
        >
          <title id={titleId}>{labels.title}</title>

          <path
            className={cn(
              "rose-balayage",
              active && `categorie-${active.category}`,
            )}
            data-actif={active ? "" : undefined}
            style={{
              rotate: `${heading}deg`,
              scale: String(Math.round((reach / MAX_RADIUS) * 1000) / 1000),
            }}
            d={`M${middleX} ${middleY} L${middleX - spread} ${middleY - rise} A${MAX_RADIUS} ${MAX_RADIUS} 0 0 1 ${middleX + spread} ${middleY - rise} Z`}
          />

          <g transform={`translate(${-VIEW_BOX.x} ${-VIEW_BOX.y})`}>
            {RINGS.map((minutes, rank) => {
              const radius = (minutes / MAX_MINUTES) * MAX_RADIUS;
              const tick = ticks[rank];

              return (
                <g
                  key={minutes}
                  style={{ "--rang": rank } as React.CSSProperties}
                >
                  <circle
                    className="rose-anneau"
                    cx={CENTER}
                    cy={CENTER}
                    r={radius}
                  />
                  {tick && (
                    <text
                      className="rose-duree"
                      x={tick.x}
                      y={tick.y}
                      textAnchor={tick.anchor}
                    >
                      {labels.ring.replace("{minutes}", String(minutes))}
                    </text>
                  )}
                </g>
              );
            })}

            <line
              className="rose-rayon"
              x1={CENTER}
              y1={CENTER - MAX_RADIUS}
              x2={CENTER}
              y2={CENTER + MAX_RADIUS}
            />
            <line
              className="rose-rayon"
              x1={CENTER - MAX_RADIUS}
              y1={CENTER}
              x2={CENTER + MAX_RADIUS}
              y2={CENTER}
            />
            <text
              className="rose-cardinal"
              x={CENTER}
              y={CENTER - MAX_RADIUS - 12}
              textAnchor="middle"
            >
              {labels.north}
            </text>

            {/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: pointer-only duplicates of the markers, a plain SVG group is not focusable */}
            <g aria-hidden="true">
              {labelled.map((place) => {
                const labelX = CENTER + direction(place) * LABEL_OFFSET;
                const [firstLine, secondLine] = labelLines(place.name, compact);

                return (
                  // biome-ignore lint/a11y/noStaticElementInteractions: extra pointer and touch target, the marker of the same place is the keyboard and screen reader control
                  <g
                    key={place.id}
                    className={cn(
                      "rose-etiquette",
                      `categorie-${place.category}`,
                    )}
                    data-cote={place.side === "right" ? "droite" : "gauche"}
                    data-serre={compact ? "" : undefined}
                    data-actif={place.id === activeId ? "" : undefined}
                    data-estompe={
                      focused && place.id !== activeId ? "" : undefined
                    }
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") select(place.id, true);
                    }}
                    onClick={() => {
                      if (place.side !== coveredColumn) select(place.id, true);
                    }}
                  >
                    <rect
                      className="rose-cible"
                      {...labelTarget(place, compact)}
                    />
                    <path className="rose-filet" d={leaderPath(place)} />
                    <text
                      x={labelX}
                      y={compact ? place.labelY + 5 : place.labelY - 3}
                      textAnchor={place.side === "right" ? "start" : "end"}
                    >
                      <tspan className="rose-nom">{firstLine}</tspan>
                      {secondLine && (
                        <tspan className="rose-nom" x={labelX} dy="1.15em">
                          {secondLine}
                        </tspan>
                      )}
                      <tspan
                        className="rose-temps"
                        {...(compact || secondLine
                          ? { dx: 8 }
                          : { x: labelX, dy: "1.15em" })}
                      >
                        {formatDrive(place.driveMin)}
                      </tspan>
                    </text>
                  </g>
                );
              })}
            </g>

            {previews.map((place) => (
              <line
                key={`trajet-${place.id}`}
                className={cn("rose-trajet", `categorie-${place.category}`)}
                data-sortie={place === departing ? "" : undefined}
                x1={CENTER}
                y1={CENTER}
                x2={place.x}
                y2={place.y}
                pathLength={1}
              />
            ))}

            <circle className="rose-gite-halo" cx={CENTER} cy={CENTER} r={16} />
            <g
              className="rose-heron"
              transform={`translate(${CENTER - 29 * HERON_SCALE} ${CENTER - 56.5 * HERON_SCALE}) scale(${HERON_SCALE})`}
            >
              <Emblem
                className="heron-vif"
                entrance="visible"
                scene="still"
                size={64}
              />
            </g>

            {plotted.map((place) => {
              const filtered = category !== null && place.category !== category;

              return (
                // biome-ignore lint/a11y/noInteractiveElementToNoninteractiveRole: SVG marker, exposed as a focusable group with an accessible name
                <g
                  key={place.id}
                  className={cn("rose-lieu", `categorie-${place.category}`)}
                  style={{ "--minutes": place.driveMin } as React.CSSProperties}
                  tabIndex={filtered ? -1 : 0}
                  role="img"
                  aria-label={`${place.name}, ${formatDrive(place.driveMin)}, ${place.driveKm} km`}
                  data-actif={place.id === activeId ? "" : undefined}
                  data-estompe={filtered ? "" : undefined}
                  onFocus={() => select(place.id)}
                >
                  <circle
                    className="rose-onde"
                    cx={place.x}
                    cy={place.y}
                    r={15}
                  />
                  <circle
                    className="rose-point"
                    cx={place.x}
                    cy={place.y}
                    r={place.featured ? 7 : 5}
                  />
                </g>
              );
            })}

            {active && bubble && (
              // biome-ignore lint/a11y/noAriaHiddenOnFocusable: decorative tooltip, a plain SVG group is not focusable
              <g
                key={`bulle-${active.id}`}
                className={cn("rose-bulle", `categorie-${active.category}`)}
                data-etiquete={active.labelled ? "" : undefined}
                aria-hidden="true"
              >
                <rect
                  x={bubble.x}
                  y={bubble.y}
                  width={bubble.width}
                  height={BUBBLE_HEIGHT}
                  rx={10}
                />
                <text x={bubble.middle} y={bubble.y + 23} textAnchor="middle">
                  {active.name}
                  <tspan className="rose-temps" x={bubble.middle} dy="1.15em">
                    {formatDrive(active.driveMin)}, {active.driveKm} km
                  </tspan>
                </text>
              </g>
            )}
          </g>
        </svg>
        {previews.map((place) => (
          <div
            key={place.id}
            className={cn("rose-apercu", `categorie-${place.category}`)}
            data-cote={spotOf(place)}
            data-sortie={place === departing ? "" : undefined}
            style={
              {
                "--x": percent(place.x, VIEW_BOX.x, VIEW_BOX.width),
                "--y": percent(place.y, VIEW_BOX.y, VIEW_BOX.height),
                "--rangee": percent(place.labelY, VIEW_BOX.y, VIEW_BOX.height),
                "--marge": percent(
                  CENTER + LABEL_OFFSET,
                  VIEW_BOX.x,
                  VIEW_BOX.width,
                ),
              } as React.CSSProperties
            }
            aria-hidden="true"
          >
            {place.photo && (
              <div
                className="photo"
                style={
                  { "--foyer": place.photo.position } as React.CSSProperties
                }
              >
                <Image
                  src={place.photo.url}
                  alt=""
                  fill
                  sizes="240px"
                  loading="eager"
                  {...(place.photo.blurDataURL
                    ? {
                        placeholder: "blur",
                        blurDataURL: place.photo.blurDataURL,
                      }
                    : {})}
                />
              </div>
            )}
            <strong>{place.name}</strong>
            <span className="trajet">
              {formatDrive(place.driveMin)}, {place.driveKm} km
            </span>
            <span className="discret">
              {[
                place.commune,
                labels.directions[Math.round(bearingOf(place) / 45) % 8],
              ]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        ))}
      </div>

      <p
        className={cn(
          "rose-fiche ui",
          active && `categorie-${active.category}`,
        )}
        aria-live={touring ? "off" : "polite"}
      >
        {active ? (
          <>
            {active.photo && (
              <span
                className="photo"
                style={
                  { "--foyer": active.photo.position } as React.CSSProperties
                }
              >
                <Image
                  src={active.photo.url}
                  alt=""
                  fill
                  sizes="120px"
                  loading="eager"
                />
              </span>
            )}
            <strong>{active.name}</strong>
            <span className="trajet">
              {formatDrive(active.driveMin)}, {active.driveKm} km
            </span>
            {active.summary && (
              <span className="discret">{active.summary}</span>
            )}
          </>
        ) : (
          <span className="discret">{labels.hint}</span>
        )}
      </p>
    </div>
  );
}
