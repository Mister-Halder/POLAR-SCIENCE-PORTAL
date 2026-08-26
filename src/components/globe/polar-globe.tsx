import { Globe2, Map as MapIcon, Pause, Play, ZoomIn, ZoomOut, Target } from "lucide-react";
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

const HQ = { id: "hq", name: "NCPOR Goa", lat: 15.39, lon: 73.81 };

function getRoutePoints(start: { lat: number; lon: number }, end: { lat: number; lon: number }, steps = 30) {
  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = start.lat + (end.lat - start.lat) * t;
    let lon = start.lon + (end.lon - start.lon) * t;
    points.push([lon, lat]);
  }
  return points;
}

const getMockWeather = (name: string) => {
  if (name === "Himadri") return "-8°C, Wind 12km/h";
  if (name === "Maitri") return "-18°C, Wind 35km/h";
  if (name === "Bharati") return "-22°C, Wind 42km/h";
  return "28°C, Clear";
};

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
  const [hovered, setHovered] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [targetView, setTargetView] = useState<{ lambda: number; phi: number; t: number } | null>(null);
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

  useEffect(() => {
    if (!targetView) return;
    setSpinning(false);
    setZoom(1.5);
    
    const startLambda = lambda;
    const startPhi = phi;
    
    let dLambda = targetView.lambda - startLambda;
    if (dLambda > 180) dLambda -= 360;
    if (dLambda < -180) dLambda += 360;
    const dPhi = targetView.phi - startPhi;
    
    const startTime = performance.now();
    const duration = 750;
    let animFrame: number;
    
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      
      setLambda((startLambda + dLambda * ease) % 360);
      setPhi(startPhi + dPhi * ease);
      
      if (progress < 1) animFrame = requestAnimationFrame(tick);
    };
    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetView]);

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
    setMapPan((pan) => ({ x: pan.x + dx * 0.5, y: pan.y + dy * 0.5 }));
  }, []);

  const onPointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  const wheelRef = useCallback((el: SVGSVGElement | null) => {
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => Math.max(0.5, Math.min(4, z - e.deltaY * 0.002)));
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const visibleStations = useMemo(() => stations.filter(s => s.established <= currentYear), [currentYear]);

  const handleSelect = useCallback((id: string) => {
    setSelected(id);
    if (id === "hq") {
      if (mode === "globe") {
        setTargetView({ lambda: HQ.lon, phi: HQ.lat, t: Date.now() });
      } else {
        setMapPan({ x: -HQ.lon, y: HQ.lat });
        setZoom(2.5);
      }
      return;
    }
    const s = visibleStations.find((st) => st.id === id);
    if (s) {
      if (mode === "globe") {
        setTargetView({ lambda: s.lon, phi: s.lat, t: Date.now() });
      } else {
        setMapPan({ x: -s.lon, y: s.lat });
        setZoom(2.5);
      }
    }
  }, [mode, visibleStations]);

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
      [HQ, ...visibleStations].map((s) => ({
        station: s,
        p: project(s.lon, s.lat, lambda, phi),
      })),
    [lambda, phi, visibleStations],
  );

  const routeLines = useMemo(
    () => visibleStations.map((s) => polyline(getRoutePoints(HQ, s), lambda, phi)),
    [lambda, phi, visibleStations],
  );

  const active = visibleStations.find((s) => s.id === selected) ?? visibleStations[0] ?? stations[0]!;

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
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => setZoom(z => Math.max(0.5, z - 0.3))} aria-label="Zoom out">
              <ZoomOut className="size-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setZoom(z => Math.min(4, z + 0.3))} aria-label="Zoom in">
              <ZoomIn className="size-4" />
            </Button>
          </div>
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
              ref={wheelRef}
            >
              <g style={{ transform: `scale(${zoom})`, transformOrigin: `${CENTER}px ${CENTER}px`, transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
                <style>
                  {`
                    @keyframes flow {
                      to { stroke-dashoffset: -20; }
                    }
                    .route-line {
                      animation: flow 1.5s linear infinite;
                    }
                  `}
                </style>
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
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
              {routeLines.flatMap((segments, i) =>
                segments.map((pts, j) => (
                  <polyline
                    key={`route-${i}-${j}`}
                    points={pts}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeOpacity={0.9}
                    strokeWidth={1.8}
                    strokeDasharray="4 4"
                    className="route-line"
                    filter="url(#glow)"
                  />
                )),
              )}
              {markers.map(({ station, p }) =>
                p.visible ? (
                  <g key={station.id}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={selected === station.id ? 8 : station.id === "hq" ? 6 : 5.5}
                      strokeWidth={1.5}
                      className={cn(
                        "cursor-pointer transition-all duration-200",
                        selected === station.id
                          ? "fill-[var(--color-accent)] stroke-foreground"
                          : station.id === "hq"
                            ? "fill-amber-500 stroke-[var(--color-card)] hover:brightness-110"
                            : "fill-[var(--color-ice)] stroke-[var(--color-primary)] hover:fill-[var(--color-accent)] hover:stroke-foreground"
                      )}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => handleSelect(station.id)}
                      onPointerEnter={() => setHovered(station.id)}
                      onPointerLeave={() => setHovered(null)}
                    />
                    <text
                      x={p.x + 11}
                      y={p.y + 4}
                      fill="var(--color-foreground)"
                      fontSize="10"
                      fontWeight="500"
                      className="pointer-events-none select-none drop-shadow-md"
                    >
                      {station.name}
                    </text>
                    {hovered === station.id && (
                      <g className="pointer-events-none transition-opacity">
                        <rect x={p.x + 11} y={p.y - 32} width="115" height="38" rx="4" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1" opacity="0.95" />
                        <text x={p.x + 18} y={p.y - 18} fill="var(--color-foreground)" fontSize="11" fontWeight="bold">{station.name}</text>
                        <text x={p.x + 18} y={p.y - 4} fill="var(--color-accent)" fontSize="10" fontWeight="500">{getMockWeather(station.name)}</text>
                      </g>
                    )}
                  </g>
                ) : null,
              )}
              </g>
            </svg>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Button
                size="sm"
                variant="secondary"
                className="mr-2"
                onClick={() => setSpinning((s) => !s)}
              >
                {spinning ? (
                  <>
                    <Pause className="mr-1.5 size-4" aria-hidden />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-1.5 size-4" aria-hidden />
                    Continue
                  </>
                )}
              </Button>
              {views.map((v) => (
                <Button
                  key={v.id}
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setTargetView({ lambda: v.lambda, phi: v.phi, t: Date.now() });
                  }}
                >
                  {v.label}
                </Button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 bg-muted/40 p-3 rounded-lg border border-border">
              <span className="text-xs font-semibold text-muted-foreground w-8 text-right">1981</span>
              <input
                type="range"
                min={1981}
                max={new Date().getFullYear()}
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="flex-1 h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-accent"
                aria-label="Filter stations by year"
              />
              <span className="text-xs font-bold text-foreground w-8">{currentYear}</span>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
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
            <svg 
              viewBox="0 0 360 180" 
              className="w-full touch-none rounded bg-primary/90 overflow-hidden cursor-grab active:cursor-grabbing" 
              role="presentation" 
              ref={wheelRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <g style={{ transform: `scale(${zoom}) translate(${mapPan.x}px, ${mapPan.y}px)`, transformOrigin: '180px 90px', transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
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
              {visibleStations.map((s) => (
                <g key={s.id}>
                  <polyline
                    points={`${180 + HQ.lon},${90 - HQ.lat} ${180 + s.lon},${90 - s.lat}`}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeOpacity={0.9}
                    strokeWidth={1.8}
                    strokeDasharray="4 4"
                    className="route-line pointer-events-none"
                    filter="url(#glow)"
                  />
                  <circle
                    cx={180 + s.lon}
                    cy={90 - s.lat}
                    r={selected === s.id ? 5 : 3.5}
                    strokeWidth={1.5}
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      selected === s.id
                        ? "fill-[var(--color-accent)] stroke-foreground"
                        : "fill-[var(--color-ice)] stroke-[var(--color-primary)] hover:fill-[var(--color-accent)] hover:stroke-foreground"
                    )}
                    onClick={() => handleSelect(s.id)}
                    onPointerEnter={() => setHovered(s.id)}
                    onPointerLeave={() => setHovered(null)}
                  />
                  <text
                    x={180 + s.lon + 11}
                    y={90 - s.lat + 4}
                    fill="var(--color-foreground)"
                    fontSize="10"
                    fontWeight="500"
                    className="pointer-events-none select-none drop-shadow-md"
                  >
                    {s.name}
                  </text>
                  {hovered === s.id && (
                    <g className="pointer-events-none transition-opacity">
                      <rect x={180 + s.lon + 8} y={90 - s.lat - 32} width="115" height="38" rx="4" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1" opacity="0.95" />
                      <text x={180 + s.lon + 15} y={90 - s.lat - 18} fill="var(--color-foreground)" fontSize="11" fontWeight="bold">{s.name}</text>
                      <text x={180 + s.lon + 15} y={90 - s.lat - 4} fill="var(--color-accent)" fontSize="10" fontWeight="500">{getMockWeather(s.name)}</text>
                    </g>
                  )}
                </g>
              ))}
              <g key="hq-map">
                <circle
                  cx={180 + HQ.lon}
                  cy={90 - HQ.lat}
                  r={selected === "hq" ? 5 : 4}
                  className="fill-amber-500 cursor-pointer stroke-[var(--color-card)] hover:brightness-110"
                  onClick={() => handleSelect("hq")}
                  onPointerEnter={() => setHovered("hq")}
                  onPointerLeave={() => setHovered(null)}
                />
                <text
                  x={180 + HQ.lon + 11}
                  y={90 - HQ.lat + 4}
                  fill="var(--color-foreground)"
                  fontSize="10"
                  fontWeight="500"
                  className="pointer-events-none select-none drop-shadow-md"
                >
                  {HQ.name}
                </text>
                {hovered === "hq" && (
                  <g className="pointer-events-none transition-opacity">
                    <rect x={180 + HQ.lon + 8} y={90 - HQ.lat - 32} width="115" height="38" rx="4" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1" opacity="0.95" />
                    <text x={180 + HQ.lon + 15} y={90 - HQ.lat - 18} fill="var(--color-foreground)" fontSize="11" fontWeight="bold">{HQ.name}</text>
                    <text x={180 + HQ.lon + 15} y={90 - HQ.lat - 4} fill="var(--color-accent)" fontSize="10" fontWeight="500">{getMockWeather(HQ.name)}</text>
                  </g>
                )}
              </g>
              </g>
            </svg>
            <div className="mt-4 flex items-center gap-3 bg-muted/40 p-3 rounded-lg border border-border">
              <span className="text-xs font-semibold text-muted-foreground w-8 text-right">1981</span>
              <input
                type="range"
                min={1981}
                max={new Date().getFullYear()}
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="flex-1 h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-accent"
                aria-label="Filter stations by year"
              />
              <span className="text-xs font-bold text-foreground w-8">{currentYear}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl font-semibold">{active.name}</h3>
            <Badge variant="secondary">{active.region}</Badge>
            {active.established ? <Badge variant="outline">{active.established} - {new Date().getFullYear()}</Badge> : null}
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
                onClick={() => handleSelect(s.id)}
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
