import { useMessages } from "../context/MessageContext";

export function Header() {
  const { untaggedCount, taggedCount, state } = useMessages();
  const total = state.messages.length;

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 md:px-8 py-4 sticky top-0 z-30">
      <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-white"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.515 12.74 12.74 0 0 1 .635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 0 1-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 0 1 .722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75ZM12 15a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008A.75.75 0 0 0 12.008 15H12Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold text-white leading-tight">
              Toxic Message Tagging & Review System
            </h1>
            <p className="text-xs text-slate-400">Moderation Dashboard</p>
          </div>
        </div>

        {/* Counters */}
        {total > 0 && (
          <div className="flex items-center gap-2 text-xs font-medium flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Total&nbsp;
              <span className="text-white font-semibold">{total}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
              Untagged&nbsp;
              <span className="font-semibold">{untaggedCount}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              Tagged&nbsp;
              <span className="font-semibold">{taggedCount}</span>
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
