import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  BarChart3,
  Car,
  CheckCircle2,
  PieChart as PieIcon,
  Shield,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Metric } from "@/components/common/Metric";
import { Panel } from "@/components/common/Panel";
import { hexFor, toneFor, toneText } from "@/components/common/StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { useRaasta } from "@/lib/raasta/store";
import { cn } from "@/lib/utils";
import { deriveSummary } from "@/services/api";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Risk & Deployment Analytics — RAASTA Nagpur" },
      {
        name: "description",
        content:
          "Statistical risk distribution, hotspot ranking and police resource deployment analytics for Nagpur traffic operations.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const axis = {
  stroke: "#4B5563",
  fontSize: 11,
  tickLine: false,
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  return (
    <div className="border border-border bg-surface-2 p-2 shadow-lg text-[11.5px] rounded-xs font-sans">
      <div className="font-bold uppercase tracking-wide text-foreground">{data.name}</div>
      <div className="mt-1 space-y-0.5 text-muted-foreground tabular">
        {data.risk !== undefined ? (
          <div>
            Risk Score: <span className="font-bold" style={{ color: hexFor(data.level) }}>{Number(data.risk).toFixed(1)} / 100</span>
          </div>
        ) : null}
        {data.units !== undefined ? (
          <div>
            Police Units: <span className="font-bold text-active">{data.units} Units</span>
          </div>
        ) : null}
        {data.value !== undefined ? (
          <div>
            Sectors: <span className="font-bold text-foreground">{data.value}</span> ({data.pct}%)
          </div>
        ) : null}
        {data.vehicles !== undefined ? (
          <div>
            Traffic Density: <span className="text-foreground">{data.vehicles} veh/hr</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AnalyticsPage() {
  const { risk, isLoading, isError, refetch } = useRaasta();
  const s = deriveSummary(risk);

  const byLocation = [...risk]
    .sort((a, b) => b.risk_score - a.risk_score)
    .map((r) => ({
      name: r.location,
      risk: r.risk_score,
      units: r.police_units,
      level: r.risk_level,
      priority: r.priority,
      vehicles: r.vehicle_count,
      congestion: r.congestion,
    }));

  const total = s.total_locations || 1;
  const distribution = [
    {
      name: "Critical Risk (70+)",
      value: s.critical_risk_locations,
      pct: Math.round((s.critical_risk_locations / total) * 100),
      color: hexFor("CRITICAL"),
      level: "CRITICAL",
    },
    {
      name: "High Risk (55-69)",
      value: s.high_risk_locations,
      pct: Math.round((s.high_risk_locations / total) * 100),
      color: "#F97316",
      level: "HIGH",
    },
    {
      name: "Moderate Risk (40-54)",
      value: s.moderate_risk_locations,
      pct: Math.round((s.moderate_risk_locations / total) * 100),
      color: hexFor("MODERATE"),
      level: "MODERATE",
    },
    {
      name: "Normal Flow (<40)",
      value: s.normal_risk_locations,
      pct: Math.round((s.normal_risk_locations / total) * 100),
      color: hexFor("NORMAL"),
      level: "NORMAL",
    },
  ].filter((d) => d.value > 0);

  if (isLoading) {
    return (
      <div className="p-4">
        <Panel title="Analytics Engine">
          <LoadingState label="Computing statistical risk regressions…" />
        </Panel>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-4">
        <Panel title="Analytics Engine">
          <ErrorState onRetry={refetch} />
        </Panel>
      </div>
    );
  }
  if (risk.length === 0) {
    return (
      <div className="p-4">
        <Panel title="Analytics Engine">
          <EmptyState message="No traffic data available for analytics computation." />
        </Panel>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto scroll-thin p-2.5 space-y-2.5 bg-background">
      {/* ── KPI METRIC CARDS ── */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        <Metric
          label="Total Sectors"
          value={s.total_locations}
          hint="Active telemetry grid"
          icon={<BarChart3 />}
        />
        <Metric
          label="Critical Hotspots"
          value={s.critical_risk_locations}
          accent="critical"
          hint="Priority 1 dispatch required"
          icon={<AlertOctagon />}
        />
        <Metric
          label="High Risk Sectors"
          value={s.high_risk_locations}
          accent="critical"
          hint="Increased patrol density"
          icon={<AlertTriangle />}
        />
        <Metric
          label="Moderate Sectors"
          value={s.moderate_risk_locations}
          accent="moderate"
          hint="Manual signal timing"
          icon={<Car />}
        />
        <Metric
          label="City Risk Avg"
          value={s.average_risk_score.toFixed(1)}
          subtext="/ 100"
          accent={s.average_risk_score >= 60 ? "critical" : s.average_risk_score >= 40 ? "moderate" : "normal"}
          hint="Composite weighted score"
          icon={<Activity />}
        />
        <Metric
          label="Total Police Units"
          value={s.total_police_units}
          subtext="Active"
          accent="active"
          hint="Strategic citywide allocation"
          icon={<Shield />}
        />
      </div>

      {/* ── CHARTS ROW 1: Risk Ranking & Distribution ── */}
      <div className="grid grid-cols-1 gap-2.5 xl:grid-cols-3">
        {/* Risk Score by Sector Ranking */}
        <Panel
          title="Sector Risk Index Spectrum (0-100)"
          actions={
            <span className="font-mono text-[10px] text-muted-foreground border border-border px-1.5 py-0.2 bg-background/50">
              ALGORITHMIC FORMULA
            </span>
          }
          className="xl:col-span-2"
          bodyClassName="p-3"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byLocation} margin={{ top: 10, right: 16, bottom: 4, left: -14 }}>
                <XAxis
                  dataKey="name"
                  {...axis}
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  interval={0}
                />
                <YAxis domain={[0, 100]} {...axis} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="risk" name="Risk Score" radius={[3, 3, 0, 0]} maxBarSize={48}>
                  {byLocation.map((d) => (
                    <Cell key={d.name} fill={hexFor(d.level)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Risk Distribution Donut with Center Total */}
        <Panel
          title="Risk Category Severity Share"
          actions={
            <span className="font-mono text-[10px] text-muted-foreground border border-border px-1.5 py-0.2 bg-background/50">
              TOTAL {s.total_locations}
            </span>
          }
          bodyClassName="p-3 flex flex-col justify-between"
        >
          <div className="relative h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={78}
                  paddingAngle={3}
                  stroke="#1E2328"
                  strokeWidth={2}
                >
                  {distribution.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Donut Center Counter */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[20px] font-bold text-foreground font-mono leading-none">{s.total_locations}</span>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono mt-0.5">Sectors</span>
            </div>
          </div>

          <ul className="mt-2 space-y-1.5 border-t border-border/60 pt-2 text-[11.5px]">
            {distribution.map((d) => (
              <li key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="size-2 rounded-full shrink-0" style={{ background: d.color }} aria-hidden />
                  <span className="truncate">{d.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-foreground font-bold">{d.value}</span>
                  <span className="text-[10px] text-subtle font-normal">({d.pct}%)</span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* ── CHARTS ROW 2: Tactical Police Deployment Allocation ── */}
      <Panel
        title="Tactical Police Resource Deployment Allocation"
        actions={
          <span className="font-mono text-[10px] font-bold text-active bg-active-bg/60 border border-active/40 px-1.5 py-0.2">
            TOTAL {s.total_police_units} ACTIVE UNITS
          </span>
        }
        bodyClassName="p-3"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Horizontal Bar Chart */}
          <div className="lg:col-span-2 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={byLocation}
                layout="vertical"
                margin={{ top: 6, right: 24, bottom: 4, left: 30 }}
              >
                <XAxis type="number" allowDecimals={false} domain={[0, 5]} {...axis} tick={{ fill: "#9CA3AF" }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  {...axis}
                  tick={{ fill: "#F3F4F6", fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar
                  dataKey="units"
                  name="Police Units"
                  fill="#3B82F6"
                  radius={[0, 3, 3, 0]}
                  maxBarSize={22}
                >
                  {byLocation.map((d) => (
                    <Cell
                      key={d.name}
                      fill={d.priority === "CRITICAL" ? "#EF4444" : d.priority === "HIGH" ? "#F97316" : "#3B82F6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tactical Action Priority Matrix Breakdown */}
          <div className="border border-border/80 bg-surface-2/40 p-2.5 space-y-2 overflow-y-auto max-h-56 scroll-thin">
            <div className="label-xs text-muted-foreground font-mono">PRIORITY DISPATCH DIRECTIVES</div>
            {byLocation.map((d) => (
              <div key={d.name} className="flex items-center justify-between p-1.5 bg-background/60 border border-border/40 text-[11px]">
                <div>
                  <span className="font-bold text-foreground uppercase">{d.name}</span>
                  <span className="text-[10px] text-muted-foreground block font-mono">Priority: {d.priority}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-active text-[13px]">{d.units} Units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}
