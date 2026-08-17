import { cn } from "@/lib/utils";

export function Metric({
  label,
  value,
  hint,
  accent,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string | undefined;
  accent?: "normal" | "moderate" | "critical" | "active" | undefined;
  className?: string | undefined;
}) {
  const accentClass =
    accent === "normal"
      ? "text-normal"
      : accent === "moderate"
        ? "text-moderate"
        : accent === "critical"
          ? "text-critical"
          : accent === "active"
            ? "text-active"
            : "text-foreground";
  return (
    <div className={cn("border border-border bg-surface px-3 py-2.5", className)}>
      <div className="label-xs text-muted-foreground">{label}</div>
      <div className={cn("tabular mt-1 text-[30px] leading-none font-medium", accentClass)}>{value}</div>
      {hint ? <div className="mt-1.5 text-[11px] text-subtle">{hint}</div> : null}
    </div>
  );
}
