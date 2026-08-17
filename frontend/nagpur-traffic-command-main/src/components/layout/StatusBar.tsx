import { useRaasta } from "@/lib/raasta/store";
import { API_BASE_URL } from "@/services/api";

export function StatusBar() {
  const { risk, source, selected, userLocation } = useRaasta();
  const critical = risk.filter((r) => r.risk_level === "CRITICAL").length;
  const high = risk.filter((r) => r.risk_level === "HIGH").length;

  return (
    <footer className="flex h-7 shrink-0 flex-wrap items-center gap-x-4 gap-y-0.5 overflow-hidden border-t border-border bg-surface px-3 text-[11px] text-muted-foreground">
      <span className="text-foreground">Nagpur, Maharashtra</span>
      <span className="tabular">
        {userLocation.latitude.toFixed(4)}° N, {userLocation.longitude.toFixed(4)}° E
      </span>
      <span>
        Areas monitored: <span className="tabular text-foreground">{risk.length}</span>
      </span>
      <span className="text-critical">Critical {critical}</span>
      <span className="text-critical/80">High {high}</span>
      {selected ? <span className="text-active">Selected: {selected.location}</span> : null}
      <span className="ml-auto hidden truncate sm:block">
        {source === "live" ? `Backend ${API_BASE_URL}` : "Backend unreachable — sample dataset"}
      </span>
    </footer>
  );
}
