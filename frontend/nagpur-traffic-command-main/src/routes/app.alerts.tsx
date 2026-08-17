import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { Panel } from "@/components/common/Panel";
import { StatusBadge, toneFor, toneText } from "@/components/common/StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { useRaasta } from "@/lib/raasta/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/alerts")({
  head: () => ({
    meta: [
      { title: "Traffic Alerts — RAASTA Nagpur" },
      {
        name: "description",
        content:
          "Risk-ranked traffic alerts for Nagpur areas with recommended police units and operational guidance.",
      },
      { property: "og:title", content: "Traffic Alerts — RAASTA Nagpur" },
      {
        property: "og:description",
        content: "Risk-ranked traffic alerts with recommended police deployment for Nagpur.",
      },
    ],
  }),
  component: AlertsPage,
});

function AlertsPage() {
  const { risk, isLoading, isError, refetch, focusLocation, source } = useRaasta();
  const navigate = useNavigate();

  const alerts = [...risk]
    .filter((r) => r.risk_level !== "NORMAL")
    .sort((a, b) => b.risk_score - a.risk_score);

  const open = (name: string) => {
    focusLocation(name);
    void navigate({ to: "/app/map" });
  };

  return (
    <div className="h-full min-h-0 overflow-y-auto scroll-thin p-2">
      <Panel
        title="Traffic risk alerts"
        actions={
          <span className="text-[11px] text-subtle">
            {source === "live" ? "Backend data" : "Sample data"} · {alerts.length} active
          </span>
        }
      >
        {isLoading ? (
          <LoadingState label="Loading alerts…" />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : alerts.length === 0 ? (
          <EmptyState message="No active traffic alerts." />
        ) : (
          <ul className="divide-y divide-border">
            {alerts.map((r) => (
              <li key={r.location}>
                <button
                  type="button"
                  onClick={() => open(r.location)}
                  className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors duration-150 hover:bg-accent/60"
                >
                  <StatusBadge level={r.risk_level} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-semibold">{r.location}</div>
                    <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                      Risk score{" "}
                      <span className={cn("tabular font-semibold", toneText[toneFor(r.risk_level)])}>
                        {r.risk_score.toFixed(1)}
                      </span>{" "}
                      · {r.police_units} police unit{r.police_units === 1 ? "" : "s"} recommended
                    </div>
                    <div className="mt-0.5 truncate text-[12px] text-subtle">{r.recommendation}</div>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <div className="tabular text-[11px] text-muted-foreground">Updated {r.time}</div>
                    <div className="label-xs mt-0.5 text-subtle">Priority {r.priority}</div>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-subtle" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <p className="mt-2 px-1 text-[11px] text-subtle">
        Alerts are generated from the latest risk assessment per area. Select an alert to focus that area on
        the map.
      </p>
    </div>
  );
}
