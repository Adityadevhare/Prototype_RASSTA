import { ClientOnly } from "@tanstack/react-router";
import { Crosshair, Loader2, Minus, Plus } from "lucide-react";
import { Suspense, lazy } from "react";

const TrafficMapView = lazy(() => import("./TrafficMapView.client"));

function MapFallback() {
  return (
    <div className="flex size-full items-center justify-center gap-2 bg-background text-xs text-muted-foreground">
      <Loader2 className="size-3.5 animate-spin" aria-hidden />
      Loading map…
    </div>
  );
}

function emit(name: string, detail?: unknown) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function MapCanvas() {
  return (
    <div className="relative size-full min-h-72 border border-border bg-background">
      <ClientOnly fallback={<MapFallback />}>
        <Suspense fallback={<MapFallback />}>
          <TrafficMapView />
        </Suspense>
      </ClientOnly>

      <div className="absolute top-2 right-2 z-[500] flex flex-col border border-border bg-surface">
        <MapButton label="Zoom in" onClick={() => emit("raasta:zoom", { delta: 1 })}>
          <Plus className="size-3.5" aria-hidden />
        </MapButton>
        <MapButton label="Zoom out" onClick={() => emit("raasta:zoom", { delta: -1 })}>
          <Minus className="size-3.5" aria-hidden />
        </MapButton>
        <MapButton label="Current location" onClick={() => emit("raasta:locate")}>
          <Crosshair className="size-3.5" aria-hidden />
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
    { color: "bg-normal", label: "Normal" },
    { color: "bg-moderate", label: "Moderate" },
    { color: "bg-critical", label: "High / Critical" },
    { color: "bg-active", label: "You / Route" },
  ];
  return (
    <div className="absolute bottom-2 left-2 z-[500] border border-border bg-surface/95 px-2 py-1.5">
      <div className="label-xs mb-1 text-muted-foreground">Legend</div>
      <ul className="flex flex-col gap-1">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className={`size-2 rounded-full ${r.color}`} aria-hidden />
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
