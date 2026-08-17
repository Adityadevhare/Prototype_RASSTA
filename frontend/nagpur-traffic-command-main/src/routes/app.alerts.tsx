import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertOctagon,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Car,
  CheckCircle2,
  ChevronRight,
  Crosshair,
  Filter,
  Radio,
  Shield,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";

import { Metric } from "@/components/common/Metric";
import { Panel } from "@/components/common/Panel";
import { StatusBadge, hexFor, toneFor, toneText } from "@/components/common/StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { useRaasta } from "@/lib/raasta/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/alerts")({
  head: () => ({
    meta: [
      { title: "Tactical Risk Alerts — RAASTA Nagpur" },
      {
        name: "description",
        content:
          "Operational traffic risk alerts, incident prioritization and police dispatch guidance for Nagpur sectors.",
      },
    ],
  }),
  component: AlertsPage,
});

function AlertsPage() {
  const { risk, isLoading, isError, refetch, focusLocation, source } = useRaasta();
  const [filter, setFilter] = useState<"ALL" | "CRITICAL" | "HIGH" | "MODERATE">("ALL");
  const navigate = useNavigate();

  const allAlerts = [...risk]
    .filter((r) => r.risk_level !== "NORMAL")
    .sort((a, b) => b.risk_score - a.risk_score);

  const filteredAlerts = allAlerts.filter((r) => (filter === "ALL" ? true : r.risk_level === filter));

  const criticalCount = risk.filter((r) => r.risk_level === "CRITICAL").length;
  const highCount = risk.filter((r) => r.risk_level === "HIGH").length;
  const moderateCount = risk.filter((r) => r.risk_level === "MODERATE").length;

  const open = (name: string) => {
    focusLocation(name);
    void navigate({ to: "/app/map" });
  };

  return (
    <div className="h-full min-h-0 overflow-y-auto scroll-thin p-2.5 space-y-2.5 bg-background">
      {/* ── ALERTS SUMMARY KPI ROW ── */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric
          label="Active Incidents"
          value={allAlerts.length}
          hint="Elevated traffic risk zones"
          accent="active"
          icon={<Bell />}
        />
        <Metric
          label="Critical Hotspots"
          value={criticalCount}
          accent="critical"
          hint="Immediate unit dispatch required"
          icon={<AlertOctagon />}
        />
        <Metric
          label="High Risk Zones"
          value={highCount}
          accent="critical"
          hint="Active surveillance required"
          icon={<AlertTriangle />}
        />
        <Metric
          label="Moderate Queueing"
          value={moderateCount}
          accent="moderate"
          hint="Signal timing adjustments"
          icon={<Car />}
        />
      </div>

      {/* ── INCIDENTS STREAM PANEL ── */}
      <Panel
        title="Live Traffic Risk Incidents & Directives"
        actions={
          <div className="flex items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 border border-border/80 bg-background/60 p-0.5">
              {(["ALL", "CRITICAL", "HIGH", "MODERATE"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-2 py-0.5 text-[10px] font-mono font-bold uppercase transition-colors",
                    filter === f
                      ? "bg-active text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <span className="font-mono text-[10px] text-muted-foreground border border-border px-1.5 py-0.5 bg-background/50 hidden sm:inline">
              {source === "live" ? "FASTAPI LIVE" : "TELEMETRY FALLBACK"}
            </span>
          </div>
        }
      >
        {isLoading ? (
          <LoadingState label="Polling real-time risk alerts…" />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : filteredAlerts.length === 0 ? (
          <EmptyState message={`No ${filter !== "ALL" ? filter.toLowerCase() : "active"} traffic alerts currently registered.`} />
        ) : (
          <div className="divide-y divide-border/60">
            {filteredAlerts.map((r, idx) => {
              const isCritical = r.risk_level === "CRITICAL";

              return (
                <div
                  key={r.location}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 transition-colors border-l-3 hover:bg-accent/40 cursor-pointer",
                    isCritical
                      ? "border-l-critical bg-critical-bg/10 hover:bg-critical-bg/20"
                      : r.risk_level === "HIGH"
                        ? "border-l-critical/70 hover:bg-accent/30"
                        : "border-l-moderate hover:bg-accent/30"
                  )}
                  onClick={() => open(r.location)}
                >
                  {/* Left: Indicator & Sector Info */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <StatusBadge level={r.risk_level} className="shrink-0 mt-0.5" />

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-bold text-foreground uppercase tracking-tight">
                          {r.location}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          · {r.latitude.toFixed(4)}°N, {r.longitude.toFixed(4)}°E
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-muted-foreground tabular">
                        <span>
                          Risk Score: <span className={cn("font-bold font-mono", toneText[toneFor(r.risk_level)])}>{r.risk_score.toFixed(1)}</span>
                        </span>
                        <span>·</span>
                        <span>Volume: <strong className="text-foreground">{r.vehicle_count}</strong> veh/hr</span>
                        <span>·</span>
                        <span>Congestion: <strong className="text-foreground">{r.congestion}/10</strong></span>
                        <span>·</span>
                        <span>Accidents: <strong className={r.accidents > 2 ? "text-critical" : "text-foreground"}>{r.accidents}</strong></span>
                      </div>

                      <div className="text-[11.5px] text-foreground/90 font-sans border-l-2 border-border/80 pl-2 mt-1">
                        {r.recommendation}
                      </div>
                    </div>
                  </div>

                  {/* Right: Tactical Action Directive & Dispatch */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                    <div className="flex items-center gap-1.5">
                      <span className="label-xs font-mono font-bold px-2 py-0.5 bg-active/20 text-active border border-active/40">
                        PRIORITY {r.priority}
                      </span>
                      <span className="font-mono text-[12px] font-bold text-active flex items-center gap-1">
                        <Shield className="size-3" /> {r.police_units} UNITS
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10.5px] font-mono text-muted-foreground">
                      <span>SYNC: {r.time}</span>
                      <ChevronRight className="size-3.5 text-active" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}
