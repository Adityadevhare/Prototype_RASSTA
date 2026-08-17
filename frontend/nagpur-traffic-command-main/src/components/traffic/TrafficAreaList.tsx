import { StatusDot, toneFor, toneText } from "@/components/common/StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { Panel } from "@/components/common/Panel";
import { useRaasta } from "@/lib/raasta/store";
import { cn } from "@/lib/utils";

export function TrafficAreaList({ className }: { className?: string }) {
  const { risk, isLoading, isError, selected, select, focusLocation, refetch } = useRaasta();

  const sorted = [...risk].sort((a, b) => b.risk_score - a.risk_score);

  return (
    <Panel
      title="Traffic areas"
      className={className}
      actions={<span className="tabular text-[11px] text-subtle">{risk.length}</span>}
      bodyClassName="overflow-y-auto scroll-thin"
    >
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : sorted.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="divide-y divide-border">
          {sorted.map((r) => {
            const active = selected?.location === r.location;
            return (
              <li key={r.location}>
                <button
                  type="button"
                  onClick={() => (active ? focusLocation(r.location) : select(r.location))}
                  aria-current={active}
                  className={cn(
                    "w-full border-l-2 px-3 py-2.5 text-left transition-colors duration-150 hover:bg-accent/60",
                    active ? "border-active bg-active-bg/40" : "border-transparent",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[15px] leading-tight font-semibold">
                      {r.location.toUpperCase()}
                    </span>
                    <span className={cn("tabular text-[15px] font-semibold", toneText[toneFor(r.risk_level)])}>
                      {r.risk_score.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "label-xs flex items-center gap-1.5",
                        toneText[toneFor(r.risk_level)],
                      )}
                    >
                      <StatusDot level={r.risk_level} />
                      {r.risk_level}
                    </span>
                    <span className="tabular text-[11px] text-muted-foreground">
                      {r.vehicle_count} vehicles · {r.police_units} units
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
