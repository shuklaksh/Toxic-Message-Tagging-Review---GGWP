import { useState, useEffect } from "react";
import type { Message } from "../types";
import { TableRow } from "./TableRow";

const PAGE_SIZE = 10;

interface MessageTableProps {
  messages: Message[];
  emptyMessage?: string;
}

export function MessageTable({
  messages,
  emptyMessage = "No reports found.",
}: MessageTableProps) {
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the dataset changes (e.g., after filtering or tagging)
  useEffect(() => {
    setPage(1);
  }, [messages.length]);

  const totalPages = Math.max(1, Math.ceil(messages.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = messages.slice(start, start + PAGE_SIZE);

  // Build compact page-number list with ellipsis
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

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-12 h-12 text-slate-700"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
          />
        </svg>
        <p className="text-slate-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Table */}
      <div className="rounded-xl border border-slate-800 overflow-x-auto">
        <table className="w-full text-left border-collapse" aria-label="Message queue">
          <thead>
            <tr className="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wide">
              <th className="px-4 py-3 font-medium whitespace-nowrap">ID</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Logged By</th>
              <th className="px-4 py-3 font-medium">Message</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Toxicity Type</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Impact</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {pageRows.map((msg, idx) => (
              <TableRow key={msg.id} message={msg} index={start + idx} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          {/* Info */}
          <span className="text-xs">
            Showing&nbsp;
            <span className="text-white font-medium">{start + 1}–{Math.min(start + PAGE_SIZE, messages.length)}</span>
            &nbsp;of&nbsp;
            <span className="text-white font-medium">{messages.length}</span>
          </span>

          {/* Page controls */}
          <div className="flex items-center gap-1" role="navigation" aria-label="Pagination">
            <button
              id="pagination-prev"
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
                  id={`pagination-page-${p}`}
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
              id="pagination-next"
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
  );
}
