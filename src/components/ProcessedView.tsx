import { useState, useEffect } from "react";
import { useMessages } from "../context/MessageContext";
import { IMPACT_BG, IMPACT_DOT, formatTimestamp } from "../utils/helpers";
import type { Message } from "../types";
import { Filters } from "./Filters";

const PAGE_SIZE = 10;

// ─── Single processed row ─────────────────────────────────────────────────────

function ProcessedRow({ message, index }: { message: Message; index: number }) {
  const { dispatch } = useMessages();

  return (
    <tr
      className={[
        "group transition-colors duration-100",
        index % 2 === 0
          ? "bg-slate-900/40 hover:bg-slate-800/60"
          : "bg-slate-900/20 hover:bg-slate-800/60",
      ].join(" ")}
    >
      {/* Message */}
      <td className="px-4 py-3 text-sm text-slate-200 max-w-xs">
        <span title={message.message} className="leading-snug line-clamp-2">
          {message.message}
        </span>
      </td>

      {/* Logged By */}
      <td className="px-4 py-3 text-xs text-slate-400 font-mono whitespace-nowrap">
        {message.loggedBy}
      </td>

      {/* Toxicity Type */}
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {(message.toxicityType ?? []).slice(0, 3).map((t) => (
            <span
              key={t}
              className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-700 text-slate-200"
            >
              {t}
            </span>
          ))}
          {(message.toxicityType ?? []).length > 3 && (
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-700 text-slate-400">
              +{(message.toxicityType ?? []).length - 3}
            </span>
          )}
        </div>
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
            <span className={["w-1.5 h-1.5 rounded-full", IMPACT_DOT[message.impact]].join(" ")} />
            {message.impact}
          </span>
        ) : (
          <span className="text-slate-600 text-sm">--</span>
        )}
      </td>

      {/* Comment */}
      <td className="px-4 py-3 text-sm text-slate-400 max-w-[14rem]">
        {message.comment ? (
          <span title={message.comment} className="line-clamp-2 leading-snug">
            {message.comment}
          </span>
        ) : (
          <span className="text-slate-700 italic text-xs">No comment</span>
        )}
      </td>

      {/* Updated By */}
      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
        {message.updatedBy ?? "--"}
      </td>

      {/* Timestamp */}
      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
        {message.updatedAt ? formatTimestamp(message.updatedAt) : "--"}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <button
            id={`processed-edit-${message.id}`}
            onClick={() => dispatch({ type: "OPEN_MODAL", payload: message.id })}
            className="px-3 py-1.5 rounded text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            Edit
          </button>
          <button
            id={`processed-invalid-${message.id}`}
            onClick={() => dispatch({ type: "OPEN_CANCEL_MODAL", payload: message.id })}
            className="px-3 py-1.5 rounded text-xs font-semibold bg-slate-800 hover:bg-orange-900/60 text-slate-400 hover:text-orange-300 border border-slate-700 hover:border-orange-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            Mark Invalid
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Processed View ───────────────────────────────────────────────────────────

export function ProcessedView() {
  const { processedMessages } = useMessages();
  const [page, setPage] = useState(1);

  // Reset page when dataset changes
  useEffect(() => {
    setPage(1);
  }, [processedMessages.length]);

  const totalPages = Math.max(1, Math.ceil(processedMessages.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = processedMessages.slice(start, start + PAGE_SIZE);

  function pageNumbers(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (safePage > 3) pages.push("…");
    for (let p = Math.max(2, safePage - 1); p <= Math.min(totalPages - 1, safePage + 1); p++) {
      pages.push(p);
    }
    if (safePage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  }

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (processedMessages.length === 0) {
    return (
      <section aria-label="Processed Reports">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-200">
            Processed Reports
          </h2>
        </div>
        <Filters mode="processed" />
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-8 h-8 text-slate-600"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <div>
            <p className="text-slate-300 font-medium text-sm">No messages have been reviewed yet</p>
            <p className="text-slate-600 text-xs mt-1">
              Head to the Queue tab to start tagging messages.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ── Table ────────────────────────────────────────────────────────────────────
  return (
    <section aria-label="Processed Reports">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-200">
          Processed Reports
        </h2>
        <span className="text-xs text-slate-500">
          {processedMessages.length} message{processedMessages.length !== 1 ? "s" : ""} reviewed
        </span>
      </div>
      <Filters mode="processed" />

      <div className="flex flex-col gap-4">
        {/* Table */}
        <div className="rounded-xl border border-slate-800 overflow-x-auto">
          <table
            className="w-full text-left border-collapse"
            aria-label="Processed reports"
          >
            <thead>
              <tr className="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Logged By</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Toxicity Type</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Impact</th>
                <th className="px-4 py-3 font-medium">Comment</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Updated By</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Timestamp</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {pageRows.map((msg, idx) => (
                <ProcessedRow key={msg.id} message={msg} index={start + idx} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
            <span className="text-xs">
              Showing&nbsp;
              <span className="text-white font-medium">
                {start + 1}–{Math.min(start + PAGE_SIZE, processedMessages.length)}
              </span>
              &nbsp;of&nbsp;
              <span className="text-white font-medium">{processedMessages.length}</span>
            </span>

            <div className="flex items-center gap-1" role="navigation" aria-label="Pagination">
              <button
                id="processed-pagination-prev"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-2.5 py-1.5 rounded border border-slate-700 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-medium"
              >
                ← Prev
              </button>

              {pageNumbers().map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-slate-600 text-xs select-none">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    id={`processed-pagination-page-${p}`}
                    onClick={() => setPage(p)}
                    aria-current={p === safePage ? "page" : undefined}
                    className={[
                      "w-8 h-8 rounded border text-xs font-medium transition-colors",
                      p === safePage
                        ? "bg-rose-600 border-rose-600 text-white"
                        : "border-slate-700 hover:bg-slate-800 text-slate-300",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                id="processed-pagination-next"
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
