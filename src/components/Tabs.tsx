import { useMessages } from "../context/MessageContext";
import type { TabKey } from "../types";

interface Tab {
  key: TabKey;
  label: string;
  count: number;
  countColor: string;
}

export function Tabs() {
  const { state, dispatch, untaggedCount, taggedCount } = useMessages();

  const tabs: Tab[] = [
    {
      key: "queue",
      label: "Queue",
      count: untaggedCount,
      countColor:
        untaggedCount > 0
          ? "bg-amber-500 text-amber-950"
          : "bg-slate-700 text-slate-300",
    },
    {
      key: "processed",
      label: "Processed",
      count: taggedCount,
      countColor: "bg-emerald-600 text-white",
    },
  ];

  return (
    <nav
      className="bg-slate-900 border-b border-slate-800 px-4 md:px-8"
      aria-label="Main navigation"
    >
      <div className="max-w-screen-2xl mx-auto flex gap-1">
        {tabs.map((tab) => {
          const isActive = state.activeTab === tab.key;
          return (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              role="tab"
              aria-selected={isActive}
              onClick={() => dispatch({ type: "SET_TAB", payload: tab.key })}
              className={[
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-t",
                isActive
                  ? "border-rose-500 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600",
              ].join(" ")}
            >
              {tab.label}
              <span
                className={[
                  "inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-semibold",
                  tab.countColor,
                ].join(" ")}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
