import type { Impact } from "../types";

// ─── Impact colour maps ───────────────────────────────────────────────────────

export const IMPACT_BG: Record<Impact, string> = {
  Low: "bg-emerald-900/60 text-emerald-300 border border-emerald-700",
  Medium: "bg-yellow-900/60 text-yellow-300 border border-yellow-700",
  High: "bg-orange-900/60 text-orange-300 border border-orange-700",
  Critical: "bg-red-900/60 text-red-300 border border-red-700",
};

export const IMPACT_DOT: Record<Impact, string> = {
  Low: "bg-emerald-400",
  Medium: "bg-yellow-400",
  High: "bg-orange-400",
  Critical: "bg-red-500",
};

// ─── Text helpers ─────────────────────────────────────────────────────────────

export function truncate(text: string, max = 80): string {
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function formatTimestamp(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
