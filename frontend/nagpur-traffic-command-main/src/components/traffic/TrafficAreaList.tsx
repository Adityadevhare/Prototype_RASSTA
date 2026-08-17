import { Crosshair, Shield, TrendingUp } from "lucide-react";
import { StatusBadge, StatusDot, hexFor, toneFor, toneText } from "@/components/common/StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { Panel } from "@/components/common/Panel";
import { useRaasta } from "@/lib/raasta/store";
import { cn } from "@/lib/utils";

export function TrafficAreaList({ className }: { className?: string }) {
  const { risk, isLoading, isError, selected, select, focusLocation, refetch } = useRaasta();

  const sorted = [...risk].sort((a, b) => b.risk_score - a.risk_score);

  return (
    <Panel
      title="Sector Risk Telemetry"
      className={className}
      actions={
        <span className="tabular text-[11px] font-mono text-muted-foreground border border-border px-1.5 py-0.2 bg-background/50">
          {risk.length} SECTORS
        </span>
      }
      bodyClassName="overflow-y-auto scroll-thin"
    >
      {isLoading ? (
        <LoadingState label="Acquiring sector telemetry…" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : sorted.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="divide-y divide-border/60">
          {sorted.map((r, idx) => {
            const active = selected?.location === r.location;
            const isCritical = r.risk_level === "CRITICAL";

            return (
              <div
                key={r.location}
                className={cn(
                  "group relative flex flex-col p-2.5 transition-all duration-150 cursor-pointer border-l-2",
                  active
                    ? "border-l-active bg-active-bg/50 shadow-inner"
                    : isCritical
                      ? "border-l-critical/80 bg-critical-bg/15 hover:bg-critical-bg/30"
                      : "border-l-transparent hover:bg-accent/40"
                )}
                onClick={() => select(r.location)}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-[10px] text-subtle/80 font-semibold w-3.5">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[13.5px] font-bold text-foreground truncate uppercase tracking-tight">
                      {r.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn("tabular text-[15px] font-bold tracking-tight", toneText[toneFor(r.risk_level)])}>
                      {r.risk_score.toFixed(1)}
                    </span>
                    <button
                      type="button"
                      title="Focus on Map"
                      aria-label={`Focus ${r.location} on map`}
                      onClick={(e) => {
                        e.stopPropagation();
                        focusLocation(r.location);
                      }}
                      className="opacity-60 group-hover:opacity-100 p-1 text-muted-foreground hover:text-active transition-opacity"
                    >
                      <Crosshair className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar visual for risk score */}
                <div className="mt-1.5 h-1.5 w-full bg-background/80 overflow-hidden border border-border/40">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.max(8, r.risk_score))}%`,
                      backgroundColor: hexFor(r.risk_level),
                    }}
                  />
                </div>

                {/* Telemetry pills row */}
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <StatusBadge level={r.risk_level} className="text-[9px] py-0 px-1" />
                    <span className="tabular text-subtle text-[10.5px]">
                      {r.vehicle_count} veh/hr
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-medium text-active">
                    <Shield className="size-3 opacity-80" />
                    <span className="tabular">{r.police_units} Units</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
