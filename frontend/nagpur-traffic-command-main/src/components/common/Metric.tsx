import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Metric({
  label,
  value,
  hint,
  subtext,
  icon,
  accent,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string | undefined;
  subtext?: string | undefined;
  icon?: ReactNode | undefined;
  accent?: "normal" | "moderate" | "critical" | "active" | undefined;
  className?: string | undefined;
}) {
  const accentText =
    accent === "normal"
      ? "text-normal"
      : accent === "moderate"
        ? "text-moderate"
        : accent === "critical"
          ? "text-critical"
          : accent === "active"
            ? "text-active"
            : "text-foreground";

  const accentBorder =
    accent === "normal"
      ? "border-l-normal"
      : accent === "moderate"
        ? "border-l-moderate"
        : accent === "critical"
          ? "border-l-critical"
          : accent === "active"
            ? "border-l-active"
            : "border-l-border";

  const accentBg =
    accent === "critical"
      ? "bg-gradient-to-br from-critical/10 via-surface to-surface"
      : accent === "moderate"
        ? "bg-gradient-to-br from-moderate/10 via-surface to-surface"
        : accent === "normal"
          ? "bg-gradient-to-br from-normal/10 via-surface to-surface"
          : accent === "active"
            ? "bg-gradient-to-br from-active/10 via-surface to-surface"
            : "bg-surface";

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between border border-border px-3 py-2.5 border-l-2 shadow-xs transition-all duration-150 hover:border-border-strong",
        accentBorder,
        accentBg,
        className
      )}
    >
      <div className="flex items-center justify-between gap-1.5">
        <span className="label-xs tracking-wider text-muted-foreground">{label}</span>
        {icon ? <span className={cn("size-3.5 opacity-70", accentText)}>{icon}</span> : null}
      </div>

      <div className="mt-1 flex items-baseline gap-2">
        <span className={cn("tabular text-[26px] xl:text-[28px] leading-none font-semibold tracking-tight", accentText)}>
          {value}
        </span>
        {subtext ? <span className="text-[11px] text-muted-foreground font-medium">{subtext}</span> : null}
      </div>

      {hint ? (
        <div className="mt-1 flex items-center gap-1 text-[10.5px] text-subtle truncate">
          <span>{hint}</span>
        </div>
      ) : null}
    </div>
  );
}
