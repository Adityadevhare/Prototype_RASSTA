import { Crosshair, X } from "lucide-react";

import { StatusBadge, toneFor, toneText } from "@/components/common/StatusBadge";
import { useRaasta } from "@/lib/raasta/store";
import { cn } from "@/lib/utils";

export function LocationDetailPanel({ className }: { className?: string | undefined }) {
  const { selected, select, focusLocation } = useRaasta();

  if (!selected) {
    return (
      <section className={cn("border border-border bg-surface p-3", className)}>
        <h2 className="label-xs text-muted-foreground">Location</h2>
        <p className="mt-2 text-[12px] text-subtle">
          Select a traffic area from the list or the map to view risk details and deployment guidance.
        </p>
      </section>
    );
  }

  const tone = toneText[toneFor(selected.risk_level)];

  return (
    <section
      className={cn("border border-active/60 bg-surface", className)}
      aria-label={`Details for ${selected.location}`}
    >
      <header className="flex h-9 items-center justify-between border-b border-border px-3">
        <h2 className="label-xs text-muted-foreground">Location</h2>
        <button
          type="button"
          onClick={() => select(null)}
          title="Close details"
          aria-label="Close details"
          className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      </header>

      <div className="overflow-y-auto scroll-thin p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[16px] leading-tight font-semibold">{selected.location.toUpperCase()}</h3>
          <StatusBadge level={selected.risk_level} />
        </div>
        <div className="tabular mt-0.5 text-[11px] text-subtle">
          {selected.latitude.toFixed(4)}, {selected.longitude.toFixed(4)} · updated {selected.time}
        </div>

        <div className="mt-3 flex items-baseline gap-2 border-t border-border pt-3">
          <span className="label-xs text-muted-foreground">Risk score</span>
          <span className={cn("tabular text-[28px] leading-none font-semibold", tone)}>
            {selected.risk_score.toFixed(1)}
          </span>
        </div>

        <div className="mt-3 border-t border-border pt-3">
          <h4 className="label-xs text-muted-foreground">Traffic data</h4>
          <dl className="mt-2 grid grid-cols-2 gap-y-1.5 text-[13px]">
            <Row label="Vehicles" value={selected.vehicle_count} />
            <Row label="Accidents" value={selected.accidents} />
            <Row label="Congestion" value={`${selected.congestion}/10`} />
            <Row label="Time" value={selected.time} />
          </dl>
        </div>

        <div className="mt-3 border-t border-border pt-3">
          <h4 className="label-xs text-muted-foreground">Police deployment</h4>
          <dl className="mt-2 grid grid-cols-2 gap-y-1.5 text-[13px]">
            <Row label="Recommended units" value={selected.police_units} />
            <div className="text-muted-foreground">Priority</div>
            <div className={cn("text-right font-semibold", toneText[toneFor(selected.priority)])}>
              {selected.priority}
            </div>
          </dl>
          <p className="mt-2 border-l-2 border-border pl-2 text-[12.5px] text-muted-foreground">
            {selected.recommendation}
          </p>
        </div>

        <button
          type="button"
          onClick={() => focusLocation(selected.location)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 border border-active/60 bg-active-bg px-3 py-2 text-[11px] font-semibold tracking-[0.08em] text-active uppercase transition-colors duration-150 hover:bg-active/20"
        >
          <Crosshair className="size-3.5" aria-hidden /> View on map
        </button>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <>
      <div className="text-muted-foreground">{label}</div>
      <div className="tabular text-right font-medium">{value}</div>
    </>
  );
}
