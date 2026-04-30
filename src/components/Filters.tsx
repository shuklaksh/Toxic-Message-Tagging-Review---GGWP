import { useMessages } from "../context/MessageContext";
import type { Impact, Status } from "../types";

const IMPACT_OPTIONS: (Impact | "All")[] = ["All", "Low", "Medium", "High", "Critical"];
const STATUS_OPTIONS: (Status | "All")[] = ["All", "Untagged", "Tagged"];

const TOXICITY_OPTIONS_FILTER = [
  "All",
  "Harassment",
  "Hate",
  "Threats",
  "Trolling",
  "Slurs",
  "Abuse",
  "Personal Attack",
  "Discrimination",
  "Spamming",
  "Toxic Behavior",
  "Bullying",
  "Cheating",
];

interface FiltersProps {
  mode: "queue" | "processed";
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
      {/* Impact filter */}
      <div className="flex items-center gap-1.5">
        <label htmlFor="filter-impact" className="text-xs text-slate-500 whitespace-nowrap">
          Impact:
        </label>
        <select
          id="filter-impact"
          value={filters.impact}
          onChange={(e) => setFilter({ impact: e.target.value as typeof filters.impact })}
          className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 px-2.5 py-1.5 focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
        >
          {IMPACT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "All" ? "All Impacts" : opt}
            </option>
          ))}
        </select>
      </div>

      {/* Toxicity Type filter */}
      <div className="flex items-center gap-1.5">
        <label htmlFor="filter-toxicity" className="text-xs text-slate-500 whitespace-nowrap">
          Type:
        </label>
        <select
          id="filter-toxicity"
          value={filters.toxicityType}
          onChange={(e) => setFilter({ toxicityType: e.target.value })}
          className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 px-2.5 py-1.5 focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
        >
          {TOXICITY_OPTIONS_FILTER.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "All" ? "All Types" : opt}
            </option>
          ))}
        </select>
      </div>

      {/* Status filter (queue only) */}
      {mode === "queue" && (
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-status" className="text-xs text-slate-500 whitespace-nowrap">
            Status:
          </label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(e) => setFilter({ status: e.target.value as typeof filters.status })}
            className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 px-2.5 py-1.5 focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "All" ? "All Statuses" : opt}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Clear button */}
      {hasActiveFilters && (
        <button
          id="filter-clear"
          onClick={() => dispatch({ type: "CLEAR_FILTERS" })}
          className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 border border-rose-800 hover:border-rose-600 px-2.5 py-1.5 rounded-lg transition-colors bg-rose-950/40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3" aria-hidden="true">
            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
          </svg>
          Clear filters
        </button>
      )}
    </div>
  );
}
