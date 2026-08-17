import { cn } from "@/lib/utils";
import type { Priority, RiskLevel } from "@/lib/raasta/types";

type Tone = "normal" | "moderate" | "critical" | "active";

export function toneFor(level: RiskLevel | Priority | string): Tone {
  switch (level?.toUpperCase()) {
    case "CRITICAL":
    case "HIGH":
      return "critical";
    case "MODERATE":
    case "MEDIUM":
      return "moderate";
    case "NORMAL":
    case "LOW":
      return "normal";
    default:
      return "active";
  }
}

const toneText: Record<Tone, string> = {
  normal: "text-normal",
  moderate: "text-moderate",
  critical: "text-critical",
  active: "text-active",
};

const toneBg: Record<Tone, string> = {
  normal: "bg-normal-bg border-normal/40",
  moderate: "bg-moderate-bg border-moderate/40",
  critical: "bg-critical-bg border-critical/40",
  active: "bg-active-bg border-active/40",
};

const toneDot: Record<Tone, string> = {
  normal: "bg-normal",
  moderate: "bg-moderate",
  critical: "bg-critical",
  active: "bg-active",
};

export function StatusBadge({
  level,
  className,
}: {
  level: RiskLevel | Priority | string;
  className?: string | undefined;
}) {
  const tone = toneFor(level);
  return (
    <span
      className={cn(
        "label-xs inline-flex items-center gap-1.5 border px-1.5 py-0.5",
        toneBg[tone],
        toneText[tone],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", toneDot[tone])} aria-hidden />
      {level}
    </span>
  );
}

export function StatusDot({ level, className }: { level: string; className?: string | undefined }) {
  return <span className={cn("size-2 rounded-full", toneDot[toneFor(level)], className)} aria-hidden />;
}

export { toneText, toneDot };

export const LEVEL_HEX: Record<Tone, string> = {
  normal: "#10B981",
  moderate: "#F59E0B",
  critical: "#EF4444",
  active: "#3B82F6",
};

export function hexFor(level: string) {
  return LEVEL_HEX[toneFor(level)];
}
