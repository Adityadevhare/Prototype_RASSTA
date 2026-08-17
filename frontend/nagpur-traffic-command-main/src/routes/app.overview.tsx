import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowUpRight,
  Car,
  CheckCircle2,
  ChevronRight,
  Crosshair,
  Gauge,
  Layers,
  Radio,
  Server,
  Shield,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Metric } from "@/components/common/Metric";
import { Panel } from "@/components/common/Panel";
import { StatusBadge, hexFor, toneFor, toneText } from "@/components/common/StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { MapCanvas } from "@/components/map/MapCanvas";
import { LocationDetailPanel } from "@/components/traffic/LocationDetailPanel";
import { TrafficAreaList } from "@/components/traffic/TrafficAreaList";
import { useRaasta } from "@/lib/raasta/store";
import { cn } from "@/lib/utils";
import { deriveSummary } from "@/services/api";

export const Route = createFileRoute("/app/overview")({
  head: () => ({
    meta: [
      { title: "Command Center Overview — RAASTA Nagpur" },
      {
        name: "description",
        content:
          "Real-time urban traffic risk monitoring, geospatial incident map and police deployment decision support for Nagpur City.",
      },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  const { risk, selected, select, focusLocation, planRoute, isLoading, isError, source, refetch } = useRaasta();
  const s = deriveSummary(risk);

  const highest = [...risk].sort((a, b) => b.risk_score - a.risk_score)[0];
  const sortedRisk = [...risk].sort((a, b) => b.risk_score - a.risk_score);
  const activeAlerts = risk.filter((r) => r.risk_level === "CRITICAL" || r.risk_level === "HIGH");

  const chartData = sortedRisk.map((r) => ({
    name: r.location,
    score: r.risk_score,
    level: r.risk_level,
    vehicles: r.vehicle_count,
  }));

  return (
    <div className="h-full min-h-0 overflow-y-auto scroll-thin p-2.5 space-y-2.5 bg-background">
      {/* ── TOP KPI INTELLIGENCE GRID ── */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        <Metric
          label="City Risk Index"
          value={s.average_risk_score.toFixed(1)}
          subtext="/ 100"
          hint={`Weighted across ${s.total_locations} monitored sectors`}
          accent={s.average_risk_score >= 60 ? "critical" : s.average_risk_score >= 40 ? "moderate" : "normal"}
          icon={<Gauge />}
        />
        <Metric
          label="Critical Sectors"
          value={s.critical_risk_locations}
          hint={s.critical_risk_locations > 0 ? "Immediate tactical response" : "No critical hotspots"}
          accent="critical"
          icon={<AlertOctagon />}
        />
        <Metric
          label="High Risk Sectors"
          value={s.high_risk_locations}
          hint="Active surveillance required"
          accent="critical"
          icon={<AlertTriangle />}
        />
        <Metric
          label="Moderate Congestion"
          value={s.moderate_risk_locations}
          hint="Queue monitoring active"
          accent="moderate"
          icon={<Car />}
        />
        <Metric
          label="Normal Traffic Flow"
          value={s.normal_risk_locations}
          hint="Within safe velocity band"
          accent="normal"
          icon={<CheckCircle2 />}
        />
        <Metric
          label="Police Units Deployed"
          value={s.total_police_units}
          subtext="Active"
          hint="Decision support recommended"
          accent="active"
          icon={<Shield />}
        />
      </div>

      {/* ── MAIN OPERATIONAL COMMAND LAYOUT ── */}
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-[280px_minmax(0,1fr)_310px] xl:grid-cols-[300px_minmax(0,1fr)_330px]">
        {/* ── LEFT COLUMN: Incident Stream & Sector Telemetry ── */}
        <div className="flex flex-col gap-2.5 min-h-0">
          {/* Active Incident / High-Risk Alerts Stream */}
          <Panel
            title="Live Tactical Risk Alerts"
            actions={
              <span className="font-mono text-[10px] font-bold text-critical bg-critical-bg/40 border border-critical/40 px-1.5 py-0.2">
                {activeAlerts.length} HOTSPOTS
              </span>
            }
            className="max-h-[280px]"
            bodyClassName="overflow-y-auto scroll-thin divide-y divide-border/60"
          >
            {activeAlerts.length === 0 ? (
              <div className="p-4 text-center text-[11.5px] text-muted-foreground">
                <CheckCircle2 className="size-5 text-normal mx-auto mb-1 opacity-80" />
                No critical traffic alerts at this time.
              </div>
            ) : (
              activeAlerts.map((r) => (
                <div
                  key={r.location}
                  onClick={() => focusLocation(r.location)}
                  className="p-2.5 hover:bg-accent/40 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-[13px] text-foreground uppercase tracking-tight flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-critical animate-ping" />
                      {r.location}
                    </span>
                    <StatusBadge level={r.risk_level} className="text-[9px] py-0 px-1" />
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground tabular">
                    <span>
                      Score: <span className="font-bold text-critical">{r.risk_score.toFixed(1)}</span>
                    </span>
                    <span>Congestion: {r.congestion}/10</span>
                    <span className="text-active font-semibold">{r.police_units} Units</span>
                  </div>

                  <div className="mt-1 text-[10.5px] text-subtle truncate flex items-center justify-between">
                    <span>{r.recommendation}</span>
                    <ChevronRight className="size-3 text-subtle group-hover:text-active group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>
                </div>
              ))
            )}
          </Panel>

          {/* Sector Telemetry List */}
          <TrafficAreaList className="flex-1 min-h-[300px]" />
        </div>

        {/* ── CENTER COLUMN: Geospatial Map Intelligence & Risk Telemetry Bar Chart ── */}
        <div className="flex flex-col gap-2.5 min-h-0">
          {/* Main Geospatial Map Canvas */}
          <div className="h-[380px] lg:h-[430px] xl:h-[450px]">
            <MapCanvas />
          </div>

          {/* Sector Risk Score Telemetry Spectrum Bar Chart */}
          <Panel
            title="Sector Risk Index Distribution"
            actions={
              <span className="text-[10px] font-mono text-muted-foreground">
                ALGORITHMIC ENGINE · 0-100 SCALE
              </span>
            }
            bodyClassName="p-2"
          >
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 12, bottom: 2, left: -20 }}>
                  <XAxis
                    dataKey="name"
                    stroke="#6B7280"
                    fontSize={10.5}
                    tickLine={false}
                    interval={0}
                    tick={{ fill: "#9CA3AF" }}
                  />
                  <YAxis domain={[0, 100]} stroke="#6B7280" fontSize={10} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                      background: "#1E2328",
                      border: "1px solid #33383D",
                      borderRadius: 2,
                      fontSize: 11.5,
                      color: "#F3F4F6",
                    }}
                    formatter={(value: any, name: any, item: any) => [
                      `${Number(value).toFixed(1)} / 100 (${item.payload.level})`,
                      "Risk Score",
                    ]}
                  />
                  <Bar dataKey="score" name="Risk Score" radius={[2, 2, 0, 0]} maxBarSize={38}>
                    {chartData.map((d) => (
                      <Cell key={d.name} fill={hexFor(d.level)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        {/* ── RIGHT COLUMN: Tactical Deployment Matrix, Sector Dossier & System Status ── */}
        <div className="flex flex-col gap-2.5 min-h-0">
          {/* Priority Police Deployment Matrix */}
          <Panel
            title="Police Deployment Directives"
            actions={
              <span className="font-mono text-[10px] font-bold text-active bg-active-bg/60 border border-active/40 px-1.5 py-0.2">
                DECISION SUPPORT
              </span>
            }
            className="max-h-[300px]"
            bodyClassName="overflow-y-auto scroll-thin divide-y divide-border/60 p-1"
          >
            {sortedRisk.map((r) => (
              <div key={r.location} className="p-2 hover:bg-accent/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[12.5px] uppercase tracking-tight text-foreground">
                    {r.location}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[10px] font-bold px-1.5 py-0.2 uppercase border",
                      r.priority === "CRITICAL"
                        ? "bg-critical-bg text-critical border-critical/50"
                        : r.priority === "HIGH"
                          ? "bg-critical-bg/60 text-critical border-critical/40"
                          : r.priority === "MEDIUM"
                            ? "bg-moderate-bg text-moderate border-moderate/40"
                            : "bg-normal-bg text-normal border-normal/40"
                    )}
                  >
                    PRIORITY {r.priority}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-active font-mono font-bold">
                    <Shield className="size-3" />
                    <span>{r.police_units} POLICE UNITS</span>
                  </div>
                  <span className="tabular text-muted-foreground text-[10.5px]">
                    Risk {r.risk_score.toFixed(1)}
                  </span>
                </div>

                <p className="mt-1 text-[10.5px] text-muted-foreground/90 leading-tight">
                  {r.recommendation}
                </p>
              </div>
            ))}
          </Panel>

          {/* Location Detail Dossier */}
          <LocationDetailPanel className="flex-1" />

          {/* Command Center System Health & Operational Telemetry */}
          <div className="border border-border/80 bg-surface p-2.5 text-[11px] space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase border-b border-border/60 pb-1">
              <span className="flex items-center gap-1 font-bold text-foreground">
                <Server className="size-3 text-active" /> SYSTEM HEALTH
              </span>
              <span className="text-normal font-bold flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-normal animate-pulse" /> OPERATIONAL
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[10.5px] tabular">
              <span className="text-subtle">Engine:</span>
              <span className="text-right text-foreground">RAASTA AI v1.0</span>

              <span className="text-subtle">Data Link:</span>
              <span className={cn("text-right font-bold", source === "live" ? "text-normal" : "text-moderate")}>
                {source === "live" ? "FastAPI Live Feed" : "Autonomous Fallback"}
              </span>

              <span className="text-subtle">Sectors Polled:</span>
              <span className="text-right text-foreground">{risk.length} Urban Sectors</span>

              <span className="text-subtle">City Sector:</span>
              <span className="text-right text-foreground">Nagpur District</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
