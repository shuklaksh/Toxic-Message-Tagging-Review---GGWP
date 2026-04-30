import { useState, useEffect } from "react";
import { useMessages } from "../context/MessageContext";
import { formatTimestamp } from "../utils/helpers";
import type { Message } from "../types";

const PAGE_SIZE = 10;

function CancelledRow({ message, index }: { message: Message; index: number }) {
  return (
    <tr
      className={[
        "transition-colors duration-100",
        index % 2 === 0
          ? "bg-slate-900/40 hover:bg-slate-800/60"
          : "bg-slate-900/20 hover:bg-slate-800/60",
      ].join(" ")}
    >
      {/* ID */}
      <td className="px-4 py-3 text-xs text-slate-500 font-mono whitespace-nowrap">
        #{message.id}
      </td>

      {/* Message */}
      <td className="px-4 py-3 text-sm text-slate-400 max-w-xs">
        <span title={message.message} className="leading-snug line-clamp-2 line-through decoration-slate-600">
          {message.message}
        </span>
      </td>

      {/* Logged By */}
      <td className="px-4 py-3 text-xs text-slate-500 font-mono whitespace-nowrap">
        {message.loggedBy}
      </td>

      {/* Reason — highlighted, always visible */}
      <td className="px-4 py-3 max-w-[18rem]">
        {message.cancellationReason ? (
          <span
            className="inline-block px-2.5 py-1 rounded-lg text-xs leading-snug font-medium bg-orange-950/60 text-orange-200 border border-orange-800"
            title={message.cancellationReason}
          >
            {message.cancellationReason}
          </span>
        ) : (
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs leading-snug italic bg-slate-800 text-slate-500 border border-slate-700">
            Invalid report
          </span>
        )}
      </td>

      {/* Cancelled By */}
      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
        {message.updatedBy ?? "--"}
      </td>

      {/* Timestamp */}
      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
        {message.updatedAt ? formatTimestamp(message.updatedAt) : "--"}
      </td>
    </tr>
  );
}

export function CancelledView() {
  const { cancelledMessages } = useMessages();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [cancelledMessages.length]);

  const totalPages = Math.max(1, Math.ceil(cancelledMessages.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = cancelledMessages.slice(start, start + PAGE_SIZE);

  if (cancelledMessages.length === 0) {
    return (
      <section aria-label="Cancelled Reports">
        <h2 className="text-base font-semibold text-slate-200 mb-4">
          Cancelled Reports
        </h2>
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-slate-600" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <div>
            <p className="text-slate-300 font-medium text-sm">No cancelled reports</p>
            <p className="text-slate-600 text-xs mt-1">Invalid reports that you dismiss will appear here.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Cancelled Reports">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-200">
          Cancelled Reports
        </h2>
        <span className="text-xs text-slate-500">
          {cancelledMessages.length} report{cancelledMessages.length !== 1 ? "s" : ""} cancelled
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-slate-800 overflow-x-auto">
          <table className="w-full text-left border-collapse" aria-label="Cancelled reports">
            <thead>
              <tr className="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 font-medium whitespace-nowrap">ID</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Logged By</th>
                <th className="px-4 py-3 font-medium">Reason</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Cancelled By</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {pageRows.map((msg, idx) => (
                <CancelledRow key={msg.id} message={msg} index={start + idx} />
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
            <span className="text-xs">
              Showing&nbsp;
              <span className="text-white font-medium">{start + 1}–{Math.min(start + PAGE_SIZE, cancelledMessages.length)}</span>
              &nbsp;of&nbsp;
              <span className="text-white font-medium">{cancelledMessages.length}</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-2.5 py-1.5 rounded border border-slate-700 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-medium"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="px-2.5 py-1.5 rounded border border-slate-700 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-medium"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
