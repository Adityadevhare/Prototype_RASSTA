import { createFileRoute } from "@tanstack/react-router";
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
import { hexFor } from "@/components/common/StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { useRaasta } from "@/lib/raasta/store";
import { deriveSummary } from "@/services/api";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Traffic Analytics — RAASTA Nagpur" },
      {
        name: "description",
        content:
          "Risk distribution, risk score by area and police deployment analytics for Nagpur traffic operations.",
      },
      { property: "og:title", content: "Traffic Analytics — RAASTA Nagpur" },
      {
        property: "og:description",
        content: "Risk distribution and police deployment analytics for Nagpur traffic areas.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const axis = {
  stroke: "#6B7280",
  fontSize: 11,
  tickLine: false,
};

function ChartTooltip() {
  return (
    <Tooltip
      cursor={{ fill: "rgba(255,255,255,0.04)" }}
      contentStyle={{
        background: "#262B30",
        border: "1px solid #33383D",
        borderRadius: 3,
        fontSize: 12,
        color: "#F3F4F6",
      }}
      labelStyle={{ color: "#9CA3AF", fontSize: 11 }}
    />
  );
}

function AnalyticsPage() {
  const { risk, isLoading, isError, refetch } = useRaasta();
  const s = deriveSummary(risk);

  const byLocation = [...risk]
    .sort((a, b) => b.risk_score - a.risk_score)
    .map((r) => ({ name: r.location, risk: r.risk_score, units: r.police_units, level: r.risk_level }));

  const distribution = [
    { name: "Critical", value: s.high_risk_locations, color: hexFor("CRITICAL") },
    { name: "Moderate / High", value: s.medium_risk_locations, color: hexFor("MODERATE") },
    { name: "Low", value: s.low_risk_locations, color: hexFor("NORMAL") },
  ].filter((d) => d.value > 0);

  if (isLoading) {
    return (
      <div className="p-2">
        <Panel title="Analytics">
          <LoadingState label="Loading analytics…" />
        </Panel>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-2">
        <Panel title="Analytics">
          <ErrorState onRetry={refetch} />
        </Panel>
      </div>
    );
  }
  if (risk.length === 0) {
    return (
      <div className="p-2">
        <Panel title="Analytics">
          <EmptyState />
        </Panel>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto scroll-thin p-2">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        <Metric label="Total locations" value={s.total_locations} />
        <Metric label="Critical locations" value={s.high_risk_locations} accent="critical" />
        <Metric label="Moderate locations" value={s.medium_risk_locations} accent="moderate" />
        <Metric label="Low locations" value={s.low_risk_locations} accent="normal" />
        <Metric label="Average risk score" value={s.average_risk_score.toFixed(2)} />
        <Metric label="Total police units" value={s.total_police_units} accent="active" />
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2 xl:grid-cols-3">
        <Panel title="Risk score by location" className="xl:col-span-2" bodyClassName="p-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byLocation} margin={{ top: 8, right: 8, bottom: 4, left: -12 }}>
                <XAxis dataKey="name" {...axis} />
                <YAxis domain={[0, 100]} {...axis} />
                {ChartTooltip()}
                <Bar dataKey="risk" name="Risk score" radius={[2, 2, 0, 0]} maxBarSize={46}>
                  {byLocation.map((d) => (
                    <Cell key={d.name} fill={hexFor(d.level)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Risk distribution" bodyClassName="p-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={2}
                  stroke="#1E2328"
                >
                  {distribution.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                {ChartTooltip()}
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-1 flex flex-col gap-1 px-1 pb-1">
            {distribution.map((d) => (
              <li key={d.name} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <span className="size-2 rounded-full" style={{ background: d.color }} aria-hidden />
                {d.name}
                <span className="tabular ml-auto text-foreground">{d.value}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Police deployment recommendations" className="mt-2" bodyClassName="p-2">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byLocation} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 24 }}>
              <XAxis type="number" allowDecimals={false} {...axis} />
              <YAxis type="category" dataKey="name" width={92} {...axis} />
              {ChartTooltip()}
              <Bar dataKey="units" name="Police units" fill="#3B82F6" radius={[0, 2, 2, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
