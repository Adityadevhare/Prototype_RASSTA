import { createFileRoute } from "@tanstack/react-router";

import { Metric } from "@/components/common/Metric";
import { Panel } from "@/components/common/Panel";
import { StatusBadge } from "@/components/common/StatusBadge";
import { MapCanvas } from "@/components/map/MapCanvas";
import { LocationDetailPanel } from "@/components/traffic/LocationDetailPanel";
import { TrafficAreaList } from "@/components/traffic/TrafficAreaList";
import { deriveSummary } from "@/services/api";
import { useRaasta } from "@/lib/raasta/store";

export const Route = createFileRoute("/app/overview")({
  head: () => ({
    meta: [
      { title: "Overview — RAASTA Nagpur Traffic Operations" },
      {
        name: "description",
        content:
          "Current traffic and risk overview for Nagpur: critical areas, average risk score and recommended police units.",
      },
      { property: "og:title", content: "Overview — RAASTA Nagpur Traffic Operations" },
      {
        property: "og:description",
        content: "Critical areas, risk scores and deployment recommendations for Nagpur traffic.",
      },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  const { risk, selected, isLoading } = useRaasta();
  const s = deriveSummary(risk);
  const highest = [...risk].sort((a, b) => b.risk_score - a.risk_score)[0];

  return (
    <div className="h-full min-h-0 overflow-y-auto scroll-thin p-2">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6">
        <Metric label="Areas monitored" value={s.total_locations} />
        <Metric label="Critical" value={s.high_risk_locations} accent="critical" />
        <Metric label="Moderate" value={s.medium_risk_locations} accent="moderate" />
        <Metric label="Low" value={s.low_risk_locations} accent="normal" />
        <Metric label="Avg risk score" value={s.average_risk_score.toFixed(2)} />
        <Metric label="Police units" value={s.total_police_units} accent="active" />
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-[300px_minmax(0,1fr)_300px]">
        <TrafficAreaList className="max-h-[460px]" />
        <div className="min-h-[380px] lg:min-h-[460px]">
          <MapCanvas />
        </div>
        <div className="flex flex-col gap-2">
          <Panel title="Highest risk" bodyClassName="p-3">
            {isLoading || !highest ? (
              <p className="text-[12.5px] text-muted-foreground">Loading risk ranking…</p>
            ) : (
              <>
                <div className="text-[16px] font-semibold">{highest.location.toUpperCase()}</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="tabular text-[28px] leading-none font-semibold text-critical">
                    {highest.risk_score.toFixed(1)}
                  </span>
                  <StatusBadge level={highest.risk_level} />
                </div>
                <p className="mt-2 text-[12px] text-muted-foreground">
                  Prioritise monitoring and deployment at this location during evening peak.
                </p>
              </>
            )}
          </Panel>
          <LocationDetailPanel className={selected ? "" : "hidden lg:block"} />
        </div>
      </div>
    </div>
  );
}
