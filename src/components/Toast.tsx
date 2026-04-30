import { useEffect, useRef } from "react";
import { useMessages } from "../context/MessageContext";

export function Toast() {
  const { state, dispatch } = useMessages();
  const { toast } = state;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!toast) return;

    // Auto-dismiss after 3 s
    timerRef.current = setTimeout(() => {
      dispatch({ type: "CLEAR_TOAST" });
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast?.id, dispatch]); // re-run on each new toast (keyed by id)

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-900 border border-emerald-700 text-emerald-200 text-sm font-medium shadow-2xl shadow-black/40 animate-slide-in"
    >
      {/* Icon */}
      <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-3.5 h-3.5 text-emerald-200"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
            clipRule="evenodd"
          />
        </svg>
      </span>

      {toast.text}

      {/* Dismiss button */}
      <button
        id="toast-dismiss"
        onClick={() => dispatch({ type: "CLEAR_TOAST" })}
        aria-label="Dismiss notification"
        className="ml-2 text-emerald-400 hover:text-emerald-200 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    </div>
  );
}
