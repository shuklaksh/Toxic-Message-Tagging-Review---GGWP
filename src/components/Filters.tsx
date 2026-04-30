import { useMessages } from "../context/MessageContext";
import { Select } from "./ui/Select";
import type { Impact, Status } from "../types";

// ─── Option sets ─────────────────────────────────────────────────────────────

const IMPACT_OPTIONS = [
  { value: "All", label: "All Impacts" },
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Critical", label: "Critical" },
];

const STATUS_OPTIONS = [
  { value: "All", label: "All Statuses" },
  { value: "Untagged", label: "Untagged" },
  { value: "Tagged", label: "Tagged" },
];

const TOXICITY_OPTIONS = [
  { value: "All", label: "All Types" },
  { value: "Harassment", label: "Harassment" },
  { value: "Hate", label: "Hate" },
  { value: "Threats", label: "Threats" },
  { value: "Trolling", label: "Trolling" },
  { value: "Slurs", label: "Slurs" },
  { value: "Abuse", label: "Abuse" },
  { value: "Personal Attack", label: "Personal Attack" },
  { value: "Discrimination", label: "Discrimination" },
  { value: "Spamming", label: "Spamming" },
  { value: "Toxic Behavior", label: "Toxic Behavior" },
  { value: "Bullying", label: "Bullying" },
  { value: "Cheating", label: "Cheating" },
];

// ─── Component ───────────────────────────────────────────────────────────────

interface FiltersProps {
  mode: "queue" | "processed" | "cancelled";
}

export function Filters({ mode }: FiltersProps) {
  const { state, dispatch } = useMessages();
  const { filters } = state;

  const hasActiveFilters =
    filters.impact !== "All" ||
    filters.toxicityType !== "All" ||
    (mode === "queue" && filters.status !== "All");

  function setFilter(patch: Partial<typeof filters>) {
    dispatch({ type: "SET_FILTER", payload: patch });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {/* Impact */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-500 whitespace-nowrap">Impact:</span>
        <Select
          id="filter-impact"
          value={filters.impact}
          onChange={(v) => setFilter({ impact: v as Impact | "All" })}
          options={IMPACT_OPTIONS}
        />
      </div>

      {/* Toxicity Type */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-500 whitespace-nowrap">Type:</span>
        <Select
          id="filter-toxicity"
          value={filters.toxicityType}
          onChange={(v) => setFilter({ toxicityType: v })}
          options={TOXICITY_OPTIONS}
        />
      </div>

      {/* Status — queue only */}
      {mode === "queue" && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 whitespace-nowrap">Status:</span>
          <Select
            id="filter-status"
            value={filters.status}
            onChange={(v) => setFilter({ status: v as Status | "All" })}
            options={STATUS_OPTIONS}
          />
        </div>
      )}

      {/* Clear button */}
      {hasActiveFilters && (
        <button
          id="filter-clear"
          onClick={() => dispatch({ type: "CLEAR_FILTERS" })}
          className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 border border-rose-800 hover:border-rose-600 px-2.5 py-1.5 rounded-lg transition-colors bg-rose-950/40"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-3 h-3"
            aria-hidden="true"
          >
            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
          </svg>
          Clear filters
        </button>
      )}
    </div>
  );
}
