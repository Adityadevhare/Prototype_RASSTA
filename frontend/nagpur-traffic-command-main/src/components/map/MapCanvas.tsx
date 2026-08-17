import { ClientOnly } from "@tanstack/react-router";
import { Crosshair, Layers, Loader2, Minus, Navigation, Plus, Shield } from "lucide-react";
import { Suspense, lazy } from "react";

import { useRaasta } from "@/lib/raasta/store";

const TrafficMapView = lazy(() => import("./TrafficMapView.client"));

function MapFallback() {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-2 bg-background text-xs text-muted-foreground">
      <Loader2 className="size-5 animate-spin text-active" aria-hidden />
      <span className="font-mono text-[11px]">INITIALIZING GEOSPATIAL ENGINE…</span>
    </div>
  );
}

function emit(name: string, detail?: unknown) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function MapCanvas({ className }: { className?: string }) {
  const { risk, route } = useRaasta();
  const criticalCount = risk.filter((r) => r.risk_level === "CRITICAL").length;

  return (
    <div className={`relative size-full min-h-72 border border-border bg-background shadow-xs overflow-hidden ${className || ""}`}>
      {/* Top Left Sector Radar Status Badge */}
      <div className="absolute top-2 left-2 z-[500] flex items-center gap-2 border border-border/80 bg-surface/90 backdrop-blur-xs px-2.5 py-1 text-[11px] shadow-sm">
        <span className="flex size-2 rounded-full bg-active animate-ping" />
        <span className="font-mono font-semibold text-foreground tracking-wider uppercase text-[10.5px]">
          Nagpur Sector Grid
        </span>
        <span className="text-subtle">|</span>
        <span className="tabular text-muted-foreground text-[10.5px]">
          {risk.length} Hotspots
          {criticalCount > 0 ? (
            <span className="ml-1 text-critical font-bold">({criticalCount} Critical)</span>
          ) : null}
        </span>
      </div>

      <ClientOnly fallback={<MapFallback />}>
        <Suspense fallback={<MapFallback />}>
          <TrafficMapView />
        </Suspense>
      </ClientOnly>

      {/* Floating Tactical Controls */}
      <div className="absolute top-2 right-2 z-[500] flex flex-col border border-border bg-surface/95 backdrop-blur-xs shadow-md">
        <MapButton label="Zoom in" onClick={() => emit("raasta:zoom", { delta: 1 })}>
          <Plus className="size-3.5" aria-hidden />
        </MapButton>
        <MapButton label="Zoom out" onClick={() => emit("raasta:zoom", { delta: -1 })}>
          <Minus className="size-3.5" aria-hidden />
        </MapButton>
        <MapButton label="Locate Patrol Base" onClick={() => emit("raasta:locate")}>
          <Crosshair className="size-3.5 text-normal" aria-hidden />
        </MapButton>
      </div>

      <MapLegend />
    </div>
  );
}

function MapButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex size-7 items-center justify-center border-b border-border text-muted-foreground transition-colors duration-150 last:border-b-0 hover:bg-accent hover:text-foreground"
    >
      {children}
    </button>
  );
}

function MapLegend() {
  const rows = [
    { color: "bg-critical", label: "Critical Risk (70+)" },
    { color: "bg-moderate", label: "High / Moderate" },
    { color: "bg-normal", label: "Normal (<40)" },
    { color: "bg-active", label: "Route / Target" },
  ];

  return (
    <div className="absolute bottom-2 left-2 z-[500] border border-border bg-surface/90 backdrop-blur-xs px-2.5 py-1.5 shadow-sm">
      <div className="label-xs mb-1 text-muted-foreground tracking-wider font-mono">Telemetry Legend</div>
      <ul className="flex flex-col gap-1">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
            <span className={`size-2 rounded-full ${r.color}`} aria-hidden />
            <span>{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
