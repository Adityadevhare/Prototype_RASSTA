import { Radio, Shield } from "lucide-react";
import { useRaasta } from "@/lib/raasta/store";
import { API_BASE_URL } from "@/services/api";

export function StatusBar() {
  const { risk, source, selected, userLocation } = useRaasta();
  const critical = risk.filter((r) => r.risk_level === "CRITICAL").length;
  const high = risk.filter((r) => r.risk_level === "HIGH").length;
  const totalUnits = risk.reduce((sum, r) => sum + r.police_units, 0);

  return (
    <footer className="flex h-7 shrink-0 items-center justify-between overflow-hidden border-t border-border bg-surface px-3 text-[11px] font-mono text-muted-foreground select-none">
      {/* Left Telemetry Cluster */}
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="text-foreground font-semibold flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-normal" />
          NAGPUR HQ
        </span>

        <span className="text-subtle/70">|</span>

        <span className="tabular hidden sm:inline text-subtle">
          LOC: {userLocation.latitude.toFixed(4)}°N, {userLocation.longitude.toFixed(4)}°E
        </span>

        <span className="text-subtle/70 hidden sm:inline">|</span>

        <span>
          SECTORS: <strong className="text-foreground">{risk.length}</strong>
        </span>

        <span className="text-subtle/70">|</span>

        <span className="flex items-center gap-1 text-critical font-bold">
          CRITICAL: {critical}
        </span>

        <span className="text-subtle/70 hidden md:inline">|</span>

        <span className="hidden md:flex items-center gap-1 text-active font-semibold">
          <Shield className="size-2.5" />
          UNITS: {totalUnits}
        </span>

        {selected ? (
          <>
            <span className="text-subtle/70">|</span>
            <span className="text-active font-bold truncate">
              FOCUS: {selected.location.toUpperCase()}
            </span>
          </>
        ) : null}
      </div>

      {/* Right Server Link Cluster */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="flex items-center gap-1 text-[10.5px]">
          <Radio className={source === "live" ? "size-2.5 text-normal animate-pulse" : "size-2.5 text-moderate"} />
          <span className={source === "live" ? "text-normal font-semibold" : "text-moderate font-semibold"}>
            {source === "live" ? `CONNECTED (${API_BASE_URL})` : "AUTONOMOUS LOCAL"}
          </span>
        </span>
      </div>
    </footer>
  );
}
