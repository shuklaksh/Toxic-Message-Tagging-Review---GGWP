import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  type KeyboardEvent,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  /** Unique id for the trigger button (optional — auto-generated if omitted) */
  id?: string;
  /** Currently selected value */
  value: string;
  /** Called with the new value when the user picks an option */
  onChange: (value: string) => void;
  /** Array of option objects or plain strings */
  options: (SelectOption | string)[];
  /** Placeholder shown when value is empty */
  placeholder?: string;
  /** Extra classes applied to the trigger button */
  className?: string;
  /** Disable the control */
  disabled?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalise(opt: SelectOption | string): SelectOption {
  return typeof opt === "string" ? { value: opt, label: opt } : opt;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Select({
  id: idProp,
  value,
  onChange,
  options,
  placeholder = "Select…",
  className = "",
  disabled = false,
}: SelectProps) {
  const autoId = useId();
  const triggerId = idProp ?? autoId;
  const listboxId = `${triggerId}-listbox`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropUp, setDropUp] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalised = options.map(normalise);
  const selected = normalised.find((o) => o.value === value) ?? null;

  // ── Positioning ───────────────────────────────────────────────────────────

  function recalcPosition() {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setDropUp(spaceBelow < 220);
  }

  // ── Open / Close ──────────────────────────────────────────────────────────

  function openMenu() {
    recalcPosition();
    setOpen(true);
    const idx = normalised.findIndex((o) => o.value === value);
    setActiveIndex(idx >= 0 ? idx : 0);
  }

  function closeMenu(returnFocus = true) {
    setOpen(false);
    setActiveIndex(-1);
    if (returnFocus) triggerRef.current?.focus();
  }

  function toggleMenu() {
    if (disabled) return;
    open ? closeMenu() : openMenu();
  }

  // ── Outside click ─────────────────────────────────────────────────────────

  const handleOutside = useCallback(
    (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeMenu(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open]
  );

  useEffect(() => {
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open, handleOutside]);

  // ── Scroll active option into view ────────────────────────────────────────

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const li = listboxRef.current?.children[activeIndex] as HTMLElement | undefined;
    li?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  // ── Keyboard: trigger button ──────────────────────────────────────────────

  function handleTriggerKey(e: KeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        e.preventDefault();
        openMenu();
        break;
      case "ArrowUp":
        e.preventDefault();
        recalcPosition();
        setOpen(true);
        setActiveIndex(normalised.length - 1);
        break;
      case "Escape":
        closeMenu();
        break;
    }
  }

  // ── Keyboard: list ────────────────────────────────────────────────────────

  function handleListKey(e: KeyboardEvent<HTMLUListElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, normalised.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0) {
          onChange(normalised[activeIndex].value);
          closeMenu();
        }
        break;
      case "Escape":
      case "Tab":
        closeMenu();
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(normalised.length - 1);
        break;
      default: {
        // Type-ahead: jump to first option starting with the pressed letter
        const ch = e.key.toLowerCase();
        const idx = normalised.findIndex((o) => o.label.toLowerCase().startsWith(ch));
        if (idx >= 0) setActiveIndex(idx);
      }
    }
  }

  // ── Select option ─────────────────────────────────────────────────────────

  function pick(opt: SelectOption) {
    onChange(opt.value);
    closeMenu();
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={toggleMenu}
        onKeyDown={handleTriggerKey}
        className={[
          "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium",
          "bg-slate-800 border-slate-700 text-slate-200",
          "hover:bg-slate-700 hover:border-slate-600",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:border-rose-500",
          "transition-colors duration-150 select-none whitespace-nowrap",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          open ? "border-rose-500 ring-1 ring-rose-500" : "",
        ].join(" ")}
      >
        <span className={selected ? "text-slate-100" : "text-slate-500"}>
          {selected ? selected.label : placeholder}
        </span>

        {/* Chevron */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className={[
            "w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0",
            open ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-label="Options"
          tabIndex={-1}
          onKeyDown={handleListKey}
          className={[
            "absolute z-50 min-w-full w-max max-w-[240px] max-h-56 overflow-y-auto",
            "bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/60",
            "py-1 focus:outline-none",
            "animate-dropdown-in",
            dropUp ? "bottom-full mb-1" : "top-full mt-1",
          ].join(" ")}
        >
          {normalised.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isActive = idx === activeIndex;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => pick(opt)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={[
                  "flex items-center justify-between gap-3 px-3 py-2 text-xs cursor-pointer transition-colors duration-75",
                  isActive
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800",
                  isSelected ? "font-semibold" : "",
                ].join(" ")}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-3.5 h-3.5 text-rose-400 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
