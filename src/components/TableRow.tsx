import type { Message } from "../types";
import { useMessages } from "../context/MessageContext";
import { IMPACT_BG, IMPACT_DOT, truncate } from "../utils/helpers";

interface TableRowProps {
  message: Message;
  index: number; // for zebra striping
}

export function TableRow({ message, index }: TableRowProps) {
  const { dispatch } = useMessages();
  const isUntagged = message.status === "Untagged";

  function handleAction() {
    dispatch({ type: "OPEN_MODAL", payload: message.id });
  }

  return (
    <tr
      className={[
        "group transition-colors duration-100",
        isUntagged
          ? "bg-amber-950/20 hover:bg-amber-950/40"
          : index % 2 === 0
          ? "bg-slate-900/40 hover:bg-slate-800/60"
          : "bg-slate-900/20 hover:bg-slate-800/60",
      ].join(" ")}
    >
      {/* ID */}
      <td className="px-4 py-3 text-xs text-slate-500 font-mono whitespace-nowrap">
        #{message.id}
      </td>

      {/* Logged By */}
      <td className="px-4 py-3 text-xs text-slate-300 whitespace-nowrap">
        {message.loggedBy}
      </td>

      {/* Message */}
      <td className="px-4 py-3 text-sm text-slate-200 max-w-xs">
        <span title={message.message} className="leading-snug">
          {truncate(message.message, 90)}
        </span>
      </td>

      {/* Toxicity Type */}
      <td className="px-4 py-3">
        {message.toxicityType && message.toxicityType.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {message.toxicityType.slice(0, 2).map((t) => (
              <span
                key={t}
                className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-700 text-slate-200"
              >
                {t}
              </span>
            ))}
            {message.toxicityType.length > 2 && (
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-700 text-slate-400">
                +{message.toxicityType.length - 2}
              </span>
            )}
          </div>
        ) : (
          <span className="text-slate-600 text-sm">--</span>
        )}
      </td>

      {/* Impact */}
      <td className="px-4 py-3 whitespace-nowrap">
        {message.impact ? (
          <span
            className={[
              "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold",
              IMPACT_BG[message.impact],
            ].join(" ")}
          >
            <span
              className={["w-1.5 h-1.5 rounded-full", IMPACT_DOT[message.impact]].join(" ")}
            />
            {message.impact}
          </span>
        ) : (
          <span className="text-slate-600 text-sm">--</span>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span
          className={[
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold",
            isUntagged
              ? "bg-amber-900/60 text-amber-300 border border-amber-700"
              : "bg-emerald-900/60 text-emerald-300 border border-emerald-700",
          ].join(" ")}
        >
          <span
            className={[
              "w-1.5 h-1.5 rounded-full",
              isUntagged ? "bg-amber-400" : "bg-emerald-400",
            ].join(" ")}
          />
          {message.status}
        </span>
      </td>

      {/* Action */}
      <td className="px-4 py-3 whitespace-nowrap">
        <button
          id={`action-msg-${message.id}`}
          onClick={handleAction}
          className={[
            "px-3 py-1.5 rounded text-xs font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900",
            isUntagged
              ? "bg-rose-600 hover:bg-rose-500 text-white focus-visible:ring-rose-500"
              : "bg-slate-700 hover:bg-slate-600 text-slate-200 focus-visible:ring-slate-500",
          ].join(" ")}
        >
          {isUntagged ? "Tag" : "Edit"}
        </button>
      </td>
    </tr>
  );
}
