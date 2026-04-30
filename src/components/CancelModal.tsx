import { useState, useEffect, useCallback } from "react";
import { useMessages } from "../context/MessageContext";

export function CancelModal() {
  const { cancelMessage, dispatch } = useMessages();
  const [reason, setReason] = useState("");

  // Reset on open
  useEffect(() => {
    if (cancelMessage) setReason("");
  }, [cancelMessage]);

  // Escape to close
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch({ type: "CLOSE_CANCEL_MODAL" });
    },
    [dispatch]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  // Lock body scroll
  useEffect(() => {
    if (cancelMessage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [cancelMessage]);

  if (!cancelMessage) return null;

  const msg = cancelMessage;

  function handleConfirm() {
    dispatch({
      type: "CANCEL_MESSAGE",
      payload: { id: msg.id, reason: reason.trim() || undefined },
    });
  }

  function handleClose() {
    dispatch({ type: "CLOSE_CANCEL_MODAL" });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <h2 id="cancel-modal-title" className="text-base font-semibold text-white">
              Cancel Report
            </h2>
            <span className="text-xs text-slate-500 font-mono">#{msg.id}</span>
          </div>
          <button
            id="cancel-modal-close"
            onClick={handleClose}
            aria-label="Close modal"
            className="text-slate-500 hover:text-white transition-colors rounded p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Message preview */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
              Message
            </label>
            <div className="rounded-lg bg-slate-800/60 border border-slate-700 px-4 py-3 text-sm text-slate-200 leading-relaxed max-h-24 overflow-y-auto">
              {msg.message}
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-orange-950/40 border border-orange-800 text-orange-300 text-xs leading-relaxed">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
            <span>This report will be marked as invalid and removed from the queue.</span>
          </div>

          {/* Reason */}
          <div>
            <label
              htmlFor="cancel-reason"
              className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide"
            >
              Reason&nbsp;<span className="text-slate-600 normal-case font-normal">(optional)</span>
            </label>
            <textarea
              id="cancel-reason"
              rows={2}
              placeholder="Why is this report invalid? e.g. duplicate, false positive, not actionable…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1 border-t border-slate-800">
            <button
              type="button"
              id="cancel-modal-nevermind"
              onClick={handleClose}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            >
              Go Back
            </button>
            <button
              type="button"
              id="cancel-modal-confirm"
              onClick={handleConfirm}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-orange-600 hover:bg-orange-500 text-white border border-orange-600 shadow-lg shadow-orange-900/40 transition-all"
            >
              Mark Invalid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
