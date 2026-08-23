import { Globe2, Map as MapIcon, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { stations } from "@/features/expeditions/data";
import { cn } from "@/lib/utils";

const RADIUS = 148;
const CENTER = 170;
const DEG = Math.PI / 180;

interface Projected {
  x: number;
  y: number;
  visible: boolean;
}

function project(lon: number, lat: number, lambda0: number, phi0: number): Projected {
  const phi = lat * DEG;
  const lam = (lon - lambda0) * DEG;
  const p0 = phi0 * DEG;
  const cosc = Math.sin(p0) * Math.sin(phi) + Math.cos(p0) * Math.cos(phi) * Math.cos(lam);
  const x = Math.cos(phi) * Math.sin(lam);
  const y = Math.cos(p0) * Math.sin(phi) - Math.sin(p0) * Math.cos(phi) * Math.cos(lam);
  return { x: CENTER + x * RADIUS, y: CENTER - y * RADIUS, visible: cosc > 0 };
}

function polyline(points: [number, number][], lambda0: number, phi0: number): string[] {
  const segments: string[] = [];
  let current: string[] = [];
  for (const [lon, lat] of points) {
    const p = project(lon, lat, lambda0, phi0);
    if (p.visible) current.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    else if (current.length > 1) {
      segments.push(current.join(" "));
      current = [];
    } else current = [];
  }
  if (current.length > 1) segments.push(current.join(" "));
  return segments;
}

function graticule() {
  const meridians: [number, number][][] = [];
  for (let lon = -180; lon < 180; lon += 30) {
    const line: [number, number][] = [];
    for (let lat = -90; lat <= 90; lat += 3) line.push([lon, lat]);
    meridians.push(line);
  }
  const parallels: [number, number][][] = [];
  for (let lat = -60; lat <= 60; lat += 30) {
    const line: [number, number][] = [];
    for (let lon = -180; lon <= 180; lon += 3) line.push([lon, lat]);
    parallels.push(line);
  }
  const polarCircles: [number, number][][] = [-66.5, 66.5, -80, 80].map((lat) => {
    const line: [number, number][] = [];
    for (let lon = -180; lon <= 180; lon += 3) line.push([lon, lat]);
    return line;
  });
  return { meridians, parallels, polarCircles };
}

const GRID = graticule();

const views = [
  { id: "antarctic", label: "Antarctic view", lambda: 20, phi: -70 },
  { id: "arctic", label: "Arctic view", lambda: 12, phi: 72 },
  { id: "indian", label: "Indian Ocean sector", lambda: 65, phi: -25 },
] as const;

export function PolarGlobe() {
  const [lambda, setLambda] = useState(20);
  const [phi, setPhi] = useState(-70);
  const [spinning, setSpinning] = useState(true);
  const [mode, setMode] = useState<"globe" | "map">("globe");
  const [selected, setSelected] = useState<string>("maitri");
  const [supported, setSupported] = useState(true);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    // Graceful fallback: honour reduced motion and environments without SVG geometry APIs.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) setSpinning(false);
    if (typeof document.createElementNS !== "function") {
      setSupported(false);
      setMode("map");
    }
  }, []);

  useEffect(() => {
    if (!spinning || mode !== "globe") return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setLambda((l) => (l + dt * 0.008) % 360);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [spinning, mode]);

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    drag.current = { x: e.clientX, y: e.clientY };
    setSpinning(false);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    setLambda((l) => l + dx * 0.45);
    setPhi((p) => Math.max(-89, Math.min(89, p - dy * 0.45)));
  }, []);

  const onPointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<SVGSVGElement>) => {
    const step = e.shiftKey ? 15 : 5;
    if (e.key === "ArrowLeft") setLambda((l) => l - step);
    else if (e.key === "ArrowRight") setLambda((l) => l + step);
    else if (e.key === "ArrowUp") setPhi((p) => Math.min(89, p + step));
    else if (e.key === "ArrowDown") setPhi((p) => Math.max(-89, p - step));
    else return;
    setSpinning(false);
    e.preventDefault();
  }, []);

  const markers = useMemo(
    () =>
      stations.map((s) => ({
        station: s,
        p: project(s.lon, s.lat, lambda, phi),
      })),
    [lambda, phi],
  );

  const active = stations.find((s) => s.id === selected) ?? stations[0]!;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex gap-1" role="group" aria-label="Visualisation mode">
            <Button
              size="sm"
              variant={mode === "globe" ? "default" : "outline"}
              onClick={() => setMode("globe")}
              disabled={!supported}
              aria-pressed={mode === "globe"}
            >
              <Globe2 className="mr-1.5 size-4" aria-hidden />
              Globe
            </Button>
            <Button
              size="sm"
              variant={mode === "map" ? "default" : "outline"}
              onClick={() => setMode("map")}
              aria-pressed={mode === "map"}
            >
              <MapIcon className="mr-1.5 size-4" aria-hidden />
              Map
            </Button>
          </div>
          {mode === "globe" && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSpinning((s) => !s)}
              aria-label={spinning ? "Pause globe rotation" : "Resume globe rotation"}
            >
              {spinning ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
            </Button>
          )}
        </div>

        {mode === "globe" ? (
          <>
            <svg
              viewBox="0 0 340 340"
              className="w-full touch-none rounded-lg bg-primary/95 cursor-grab active:cursor-grabbing"
              role="img"
              aria-label="Interactive schematic globe showing Indian polar research station locations. Use arrow keys to rotate."
              tabIndex={0}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={onKeyDown}
            >
              <defs>
                <radialGradient id="globe-shade" cx="32%" cy="26%" r="78%">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.55" />
                  <stop offset="60%" stopColor="var(--color-primary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
                </radialGradient>
              </defs>
              <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="var(--color-ice)" opacity={0.22} />
              <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#globe-shade)" />
              {GRID.meridians.flatMap((line, i) =>
                polyline(line, lambda, phi).map((pts, j) => (
                  <polyline
                    key={`m${i}-${j}`}
                    points={pts}
                    fill="none"
                    stroke="var(--color-ice)"
                    strokeOpacity={0.3}
                    strokeWidth={0.8}
                  />
                )),
              )}
              {GRID.parallels.flatMap((line, i) =>
                polyline(line, lambda, phi).map((pts, j) => (
                  <polyline
                    key={`p${i}-${j}`}
                    points={pts}
                    fill="none"
                    stroke="var(--color-ice)"
                    strokeOpacity={0.3}
                    strokeWidth={0.8}
                  />
                )),
              )}
              {GRID.polarCircles.flatMap((line, i) =>
                polyline(line, lambda, phi).map((pts, j) => (
                  <polyline
                    key={`c${i}-${j}`}
                    points={pts}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeOpacity={0.75}
                    strokeWidth={1.4}
                    strokeDasharray="5 4"
                  />
                )),
              )}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke="var(--color-accent)"
                strokeOpacity={0.6}
              />
              {markers.map(({ station, p }) =>
                p.visible ? (
                  <g key={station.id}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={selected === station.id ? 8 : 5.5}
                      fill={selected === station.id ? "var(--color-accent)" : "var(--color-ice)"}
                      stroke="var(--color-primary)"
                      strokeWidth={1.5}
                      className="cursor-pointer"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => setSelected(station.id)}
                    />
                    <text
                      x={p.x + 11}
                      y={p.y + 4}
                      fill="var(--color-ice)"
                      fontSize="10"
                      className="pointer-events-none select-none"
                    >
                      {station.name}
                    </text>
                  </g>
                ) : null,
              )}
            </svg>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {views.map((v) => (
                <Button
                  key={v.id}
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSpinning(false);
                    setLambda(v.lambda);
                    setPhi(v.phi);
                  }}
                >
                  {v.label}
                </Button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Drag or use arrow keys to rotate. Schematic orthographic projection — not for
              navigation.
            </p>
          </>
        ) : (
          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <p className="mb-3 text-xs text-muted-foreground">
              Accessible fallback: station coordinates in a flat list, with a plate-carrée position
              grid. No WebGL or animation required.
            </p>
            <svg viewBox="0 0 360 180" className="w-full rounded bg-primary/90" role="presentation">
              {[-60, -30, 0, 30, 60].map((lat) => (
                <line
                  key={lat}
                  x1={0}
                  x2={360}
                  y1={90 - lat}
                  y2={90 - lat}
                  stroke="var(--color-ice)"
                  strokeOpacity={0.25}
                />
              ))}
              {[-120, -60, 0, 60, 120].map((lon) => (
                <line
                  key={lon}
                  y1={0}
                  y2={180}
                  x1={180 + lon}
                  x2={180 + lon}
                  stroke="var(--color-ice)"
                  strokeOpacity={0.25}
                />
              ))}
              {stations.map((s) => (
                <circle
                  key={s.id}
                  cx={180 + s.lon}
                  cy={90 - s.lat}
                  r={selected === s.id ? 5 : 3.5}
                  fill={selected === s.id ? "var(--color-accent)" : "var(--color-ice)"}
                  className="cursor-pointer"
                  onClick={() => setSelected(s.id)}
                />
              ))}
            </svg>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl font-semibold">{active.name}</h3>
            <Badge variant="secondary">{active.region}</Badge>
            {active.established ? <Badge variant="outline">Since {active.established}</Badge> : null}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{active.description}</p>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Latitude</dt>
              <dd className="font-medium tabular-nums">{active.lat.toFixed(4)}°</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Longitude</dt>
              <dd className="font-medium tabular-nums">{active.lon.toFixed(4)}°</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Berths</dt>
              <dd className="font-medium tabular-nums">
                {active.capacity > 0 ? active.capacity : "Unmanned"}
              </dd>
            </div>
          </dl>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {stations.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setSelected(s.id)}
                aria-pressed={selected === s.id}
                className={cn(
                  "w-full rounded-lg border p-3 text-left text-sm transition-colors",
                  selected === s.id
                    ? "border-accent bg-accent/10"
                    : "border-border bg-card hover:bg-secondary/50",
                )}
              >
                <span className="block font-medium">{s.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {s.region} · {s.lat.toFixed(1)}°, {s.lon.toFixed(1)}°
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
