import { useState, useEffect, useCallback } from "react";
import { useMessages } from "../context/MessageContext";
import { useSuggestedImpact } from "../hooks/useSuggestedImpact";
import { TOXICITY_OPTIONS, type Impact } from "../types";
import { IMPACT_BG, IMPACT_DOT } from "../utils/helpers";

const IMPACTS: Impact[] = ["Low", "Medium", "High", "Critical"];

export function TaggingModal() {
  const { selectedMessage, dispatch } = useMessages();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [customType, setCustomType] = useState("");
  const [impact, setImpact] = useState<Impact | "">("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<{ types?: string; impact?: string }>({});

  const suggested = useSuggestedImpact(selectedMessage?.message ?? "");

  // Pre-fill from existing tag (Edit mode) or apply suggestion (Tag mode)
  useEffect(() => {
    if (!selectedMessage) return;
    if (selectedMessage.status === "Tagged") {
      setSelectedTypes(selectedMessage.toxicityType ?? []);
      setImpact(selectedMessage.impact ?? "");
      setComment(selectedMessage.comment ?? "");
    } else {
      setSelectedTypes([]);
      setCustomType("");
      setImpact(suggested ?? "");
      setComment("");
    }
    setErrors({});
  }, [selectedMessage, suggested]);

  // ── Keyboard dismiss ────────────────────────────────────────────────────────
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch({ type: "CLOSE_MODAL" });
    },
    [dispatch]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (selectedMessage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedMessage]);

  if (!selectedMessage) return null;

  // Narrow to a non-null local so inner functions don't trigger TS18047
  const message = selectedMessage;
  const isEditMode = message.status === "Tagged";
  const hasCustom = selectedTypes.includes("Custom");

  // ── Toxicity toggle ─────────────────────────────────────────────────────────
  function toggleType(type: string) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setErrors((e) => ({ ...e, types: undefined }));
  }

  // ── Final toxicity list (swap "Custom" for the typed value) ─────────────────
  function resolvedTypes(): string[] {
    return selectedTypes.map((t) =>
      t === "Custom" && customType.trim() ? customType.trim() : t
    );
  }

  // ── Validate & submit ───────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: typeof errors = {};
    const types = resolvedTypes();

    if (types.length === 0) newErrors.types = "Select at least one toxicity type.";
    if (hasCustom && !customType.trim()) newErrors.types = "Enter a custom toxicity label.";
    if (!impact) newErrors.impact = "Select an impact level.";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    dispatch({
      type: "TAG_MESSAGE",
      payload: {
        id: message.id,
        toxicityType: types,
        impact: impact as Impact,
        comment: comment.trim() || undefined,
      },
    });
  }

  function handleCancel() {
    dispatch({ type: "CLOSE_MODAL" });
  }

  // ── Derived ─────────────────────────────────────────────────────────────────
  const canSubmit =
    resolvedTypes().length > 0 &&
    !(hasCustom && !customType.trim()) &&
    impact !== "";

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) handleCancel(); }}
    >
      {/* Card — flex column, never taller than 90vh */}
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <h2 id="modal-title" className="text-base font-semibold text-white">
              {isEditMode ? "Edit Tag" : "Tag Message"}
            </h2>
            <span className="text-xs text-slate-500 font-mono">#{message.id}</span>
          </div>
          <button
            id="modal-close"
            onClick={handleCancel}
            aria-label="Close modal"
            className="text-slate-500 hover:text-white transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Body — scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex flex-col gap-4 px-6 py-4 overflow-y-auto flex-1">

          {/* ── Read-only: Message ── */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
              Message
            </label>
            <div className="rounded-lg bg-slate-800/60 border border-slate-700 px-4 py-2 text-sm text-slate-200 leading-relaxed max-h-20 overflow-y-auto">
              {message.message}
            </div>
          </div>

          {/* ── Read-only: Logged By ── */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
              Logged By
            </label>
            <div className="rounded-lg bg-slate-800/60 border border-slate-700 px-4 py-2 text-sm text-slate-300 font-mono">
              {message.loggedBy}
            </div>
          </div>

          {/* ── Toxicity Type ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Toxicity Type <span className="text-rose-400">*</span>
              </label>
              {selectedTypes.length > 0 && (
                <span className="text-xs text-slate-500">
                  {selectedTypes.length} selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TOXICITY_OPTIONS.map((opt) => {
                const checked = selectedTypes.includes(opt);
                return (
                  <label
                    key={opt}
                    className={[
                      "flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm select-none",
                      checked
                        ? "bg-rose-900/40 border-rose-600 text-rose-200"
                        : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleType(opt)}
                      id={`toxicity-${opt}`}
                    />
                    <span
                      className={[
                        "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                        checked ? "bg-rose-500 border-rose-500" : "border-slate-600",
                      ].join(" ")}
                    >
                      {checked && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth={2} className="w-2.5 h-2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                        </svg>
                      )}
                    </span>
                    {opt}
                  </label>
                );
              })}
            </div>

            {/* Custom input */}
            {hasCustom && (
              <div className="mt-2">
                <input
                  id="custom-toxicity-input"
                  type="text"
                  placeholder="Describe custom toxicity type…"
                  value={customType}
                  onChange={(e) => {
                    setCustomType(e.target.value);
                    setErrors((er) => ({ ...er, types: undefined }));
                  }}
                  className="w-full rounded-lg bg-slate-800 border border-slate-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors"
                />
              </div>
            )}

            {errors.types && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <span>⚠</span> {errors.types}
              </p>
            )}
          </div>

          {/* ── Impact ── */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Impact <span className="text-rose-400">*</span>
              </label>
              {suggested && impact === suggested && (
                <span className="text-[11px] bg-sky-900/50 text-sky-300 border border-sky-700 px-2 py-0.5 rounded-full">
                  ✦ Suggested
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {IMPACTS.map((lvl) => {
                const selected = impact === lvl;
                return (
                  <label
                    key={lvl}
                    className={[
                      "flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all text-sm font-medium select-none",
                      selected
                        ? IMPACT_BG[lvl]
                        : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="impact"
                      value={lvl}
                      checked={selected}
                      onChange={() => {
                        setImpact(lvl);
                        setErrors((er) => ({ ...er, impact: undefined }));
                      }}
                      className="sr-only"
                      id={`impact-${lvl}`}
                    />
                    <span className={["w-2 h-2 rounded-full shrink-0", selected ? IMPACT_DOT[lvl] : "bg-slate-600"].join(" ")} />
                    {lvl}
                  </label>
                );
              })}
            </div>

            {errors.impact && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <span>⚠</span> {errors.impact}
              </p>
            )}
          </div>

          {/* ── Comment (optional) ── */}
          <div>
            <label
              htmlFor="modal-comment"
              className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide"
            >
              Comment&nbsp;
              <span className="text-slate-600 normal-case font-normal">(optional)</span>
            </label>
            <textarea
              id="modal-comment"
              rows={2}
              placeholder="Add internal notes for the moderation team…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors resize-none"
            />
          </div>

          </div>{/* end scrollable body */}

          {/* Footer — sticky, always visible */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800 shrink-0 bg-slate-900">
            <button
              type="button"
              id="modal-cancel"
              onClick={handleCancel}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="modal-submit"
              disabled={!canSubmit}
              className={[
                "px-5 py-2 rounded-lg text-sm font-semibold transition-all border",
                canSubmit
                  ? "bg-rose-600 hover:bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-900/40"
                  : "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed",
              ].join(" ")}
            >
              {isEditMode ? "Save Changes" : "Submit Tag"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
