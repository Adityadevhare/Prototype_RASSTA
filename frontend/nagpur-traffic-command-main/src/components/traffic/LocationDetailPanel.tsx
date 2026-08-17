import { AlertTriangle, Car, Crosshair, Navigation, Shield, ShieldAlert, X } from "lucide-react";

import { StatusBadge, hexFor, toneFor, toneText } from "@/components/common/StatusBadge";
import { useRaasta } from "@/lib/raasta/store";
import { cn } from "@/lib/utils";

export function LocationDetailPanel({ className }: { className?: string | undefined }) {
  const { selected, select, focusLocation, planRoute } = useRaasta();

  if (!selected) {
    return (
      <section className={cn("flex flex-col justify-center items-center text-center border border-border bg-surface/80 p-5 shadow-xs", className)}>
        <ShieldAlert className="size-8 text-subtle/70 mb-2" aria-hidden />
        <h3 className="text-[13px] font-bold text-foreground uppercase tracking-wide">No Sector Selected</h3>
        <p className="mt-1 text-[11.5px] text-muted-foreground max-w-56 leading-relaxed">
          Select any monitored sector on the map or live telemetry list to view real-time tactical intelligence and police deployment recommendations.
        </p>
      </section>
    );
  }

  const tone = toneText[toneFor(selected.risk_level)];
  const isCritical = selected.risk_level === "CRITICAL";

  return (
    <section
      className={cn(
        "flex flex-col border bg-surface shadow-md overflow-hidden transition-all",
        isCritical ? "border-critical/60" : "border-active/60",
        className
      )}
      aria-label={`Tactical dossier for ${selected.location}`}
    >
      <header className="flex h-9 shrink-0 items-center justify-between border-b border-border bg-surface-2 px-3">
        <div className="flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full", isCritical ? "bg-critical animate-ping" : "bg-active")} />
          <h2 className="label-xs text-foreground font-mono tracking-wider">Sector Intelligence Dossier</h2>
        </div>
        <button
          type="button"
          onClick={() => select(null)}
          title="Deselect Sector"
          aria-label="Close dossier"
          className="text-muted-foreground transition-colors duration-150 hover:text-foreground p-0.5"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      </header>

      <div className="overflow-y-auto scroll-thin p-3 space-y-3">
        {/* Sector Title & Risk Badge */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[16px] leading-tight font-bold text-foreground uppercase tracking-tight">
              {selected.location}
            </h3>
            <StatusBadge level={selected.risk_level} />
          </div>
          <div className="tabular mt-0.5 text-[10.5px] font-mono text-subtle">
            COORDS: {selected.latitude.toFixed(4)}°N, {selected.longitude.toFixed(4)}°E · SYNC: {selected.time}
          </div>
        </div>

        {/* Risk Score Index Banner */}
        <div className="flex items-center justify-between rounded-xs border border-border/80 bg-background/70 px-3 py-2">
          <div>
            <span className="label-xs text-muted-foreground block font-mono">RISK SEVERITY INDEX</span>
            <span className="text-[11px] text-subtle">Algorithmic Weighted Score</span>
          </div>
          <div className="text-right">
            <span className={cn("tabular text-[28px] leading-none font-bold font-mono", tone)}>
              {selected.risk_score.toFixed(1)}
            </span>
            <span className="text-[11px] text-muted-foreground"> / 100</span>
          </div>
        </div>

        {/* Traffic Flow Telemetry Grid */}
        <div className="border border-border/70 bg-surface-2/40 p-2.5 rounded-xs">
          <h4 className="label-xs text-muted-foreground font-mono mb-2 flex items-center gap-1.5">
            <Car className="size-3 text-active" /> Sensor Telemetry
          </h4>
          <dl className="grid grid-cols-2 gap-2 text-[12px]">
            <TelemetryBox label="Vehicle Density" value={`${selected.vehicle_count} /hr`} />
            <TelemetryBox label="Accidents Reported" value={`${selected.accidents} events`} />
            <TelemetryBox label="Congestion Index" value={`${selected.congestion} / 10`} highlight={selected.congestion >= 7} />
            <TelemetryBox label="Last Evaluation" value={selected.time} />
          </dl>
        </div>

        {/* Police Deployment Directive */}
        <div className="border border-active/40 bg-active-bg/20 p-2.5 rounded-xs">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="label-xs text-active font-mono flex items-center gap-1.5">
              <Shield className="size-3 text-active" /> Police Deployment Directive
            </h4>
            <span className="label-xs font-mono font-bold px-1.5 py-0.2 bg-active/20 text-active border border-active/40">
              PRIORITY {selected.priority}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[20px] font-bold text-active font-mono">{selected.police_units} Units</span>
            <span className="text-[11.5px] text-muted-foreground font-medium">Recommended for immediate dispatch</span>
          </div>

          <p className="mt-2 text-[11.5px] text-foreground/90 bg-background/60 p-2 border-l-2 border-active leading-relaxed font-sans">
            "{selected.recommendation}"
          </p>
        </div>

        {/* Tactical Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => focusLocation(selected.location)}
            className="flex items-center justify-center gap-1.5 border border-active/60 bg-active-bg/60 py-2 text-[11px] font-bold tracking-wider text-active uppercase transition-colors duration-150 hover:bg-active-bg"
          >
            <Crosshair className="size-3.5" aria-hidden /> Center Map
          </button>
          <button
            type="button"
            onClick={() => planRoute(selected.location)}
            className="flex items-center justify-center gap-1.5 border border-border bg-surface-2 py-2 text-[11px] font-bold tracking-wider text-foreground uppercase transition-colors duration-150 hover:bg-accent"
          >
            <Navigation className="size-3.5 text-normal" aria-hidden /> Route Target
          </button>
        </div>
      </div>
    </section>
  );
}

function TelemetryBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-background/60 border border-border/50 p-1.5">
      <span className="text-[10px] text-muted-foreground block truncate">{label}</span>
      <span className={cn("tabular font-mono text-[12px] font-bold block mt-0.5", highlight ? "text-critical" : "text-foreground")}>
        {value}
      </span>
    </div>
  );
}
