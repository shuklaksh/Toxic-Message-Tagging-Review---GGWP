import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { Message, TagPayload, TabKey, Filters } from "../types";
import rawMessages from "../data/messages.json";

// ─── State Shape ─────────────────────────────────────────────────────────────

interface MessageState {
  messages: Message[];
  activeTab: TabKey;
  filters: Filters;
  selectedMessageId: number | null;
  cancelMessageId: number | null; // which message has the cancel confirm open
  toast: { text: string; id: number } | null;
}

const initialFilters: Filters = {
  impact: "All",
  toxicityType: "All",
  status: "All",
};

const initialState: MessageState = {
  messages: [],
  activeTab: "queue",
  filters: initialFilters,
  selectedMessageId: null,
  cancelMessageId: null,
  toast: null,
};

// ─── Actions ─────────────────────────────────────────────────────────────────

type MessageAction =
  | { type: "INIT_MESSAGES"; payload: Message[] }
  | { type: "TAG_MESSAGE"; payload: { id: number } & TagPayload }
  | { type: "CANCEL_MESSAGE"; payload: { id: number; reason?: string } }
  | { type: "SET_TAB"; payload: TabKey }
  | { type: "SET_FILTER"; payload: Partial<Filters> }
  | { type: "CLEAR_FILTERS" }
  | { type: "OPEN_MODAL"; payload: number }
  | { type: "CLOSE_MODAL" }
  | { type: "OPEN_CANCEL_MODAL"; payload: number }
  | { type: "CLOSE_CANCEL_MODAL" }
  | { type: "CLEAR_TOAST" };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function messageReducer(
  state: MessageState,
  action: MessageAction
): MessageState {
  switch (action.type) {
    case "INIT_MESSAGES":
      return { ...state, messages: action.payload };

    case "TAG_MESSAGE": {
      const { id, toxicityType, impact, comment } = action.payload;
      const now = new Date().toISOString();
      const wasUntagged = state.messages.find((m) => m.id === id)?.status === "Untagged";
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === id
            ? {
                ...msg,
                toxicityType,
                impact,
                comment,
                status: "Tagged",
                updatedBy: "Moderator",
                updatedAt: now,
              }
            : msg
        ),
        selectedMessageId: null,
        toast: {
          text: wasUntagged ? "Message tagged successfully!" : "Tag updated successfully!",
          id: Date.now(),
        },
      };
    }

    case "CANCEL_MESSAGE": {
      const { id, reason } = action.payload;
      const now = new Date().toISOString();
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === id
            ? {
                ...msg,
                status: "Cancelled" as const,
                cancellationReason: reason,   // undefined if blank → view shows "Invalid report"
                updatedBy: "Moderator",
                updatedAt: now,
                toxicityType: undefined,
                impact: undefined,
                comment: undefined,
              }
            : msg
        ),
        cancelMessageId: null,
        toast: {
          text: "Report marked as invalid.",
          id: Date.now(),
        },
      };
    }

    case "SET_TAB":
      return {
        ...state,
        activeTab: action.payload,
        filters: initialFilters, // reset filters on tab change
      };

    case "SET_FILTER":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case "CLEAR_FILTERS":
      return { ...state, filters: initialFilters };

    case "OPEN_MODAL":
      return { ...state, selectedMessageId: action.payload };

    case "CLOSE_MODAL":
      return { ...state, selectedMessageId: null };

    case "OPEN_CANCEL_MODAL":
      return { ...state, cancelMessageId: action.payload };

    case "CLOSE_CANCEL_MODAL":
      return { ...state, cancelMessageId: null };

    case "CLEAR_TOAST":
      return { ...state, toast: null };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface MessageContextValue {
  state: MessageState;
  dispatch: React.Dispatch<MessageAction>;
  queueMessages: Message[];
  processedMessages: Message[];
  cancelledMessages: Message[];
  selectedMessage: Message | null;
  cancelMessage: Message | null;
  untaggedCount: number;
  taggedCount: number;
  cancelledCount: number;
}

const MessageContext = createContext<MessageContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function MessageProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(messageReducer, initialState);

  // Seed messages once on mount — preserve any pre-tagged entries from JSON
  useEffect(() => {
    type SeedRow = {
      id: number; loggedBy: string; message: string;
      status?: string; toxicityType?: string[]; impact?: string;
      comment?: string; updatedBy?: string; updatedAt?: string;
    };
    const seeded: Message[] = (rawMessages as SeedRow[]).map((raw) => ({
      id: raw.id,
      loggedBy: raw.loggedBy,
      message: raw.message,
      status: (raw.status as Message["status"]) ?? "Untagged",
      toxicityType: raw.toxicityType,
      impact: raw.impact as Message["impact"] | undefined,
      comment: raw.comment,
      updatedBy: raw.updatedBy,
      updatedAt: raw.updatedAt,
    }));
    dispatch({ type: "INIT_MESSAGES", payload: seeded });
  }, []);

  // ── Derived selectors ────────────────────────────────────────────────────

  const { messages, filters, selectedMessageId, cancelMessageId } = state;

  const applyFilters = (msgs: Message[]): Message[] => {
    return msgs.filter((m) => {
      if (filters.impact !== "All" && m.impact !== filters.impact) return false;
      if (
        filters.toxicityType !== "All" &&
        !m.toxicityType?.includes(filters.toxicityType)
      )
        return false;
      if (filters.status !== "All" && m.status !== filters.status) return false;
      return true;
    });
  };

  // Queue: show non-cancelled messages in ID order
  const queueMessages = applyFilters(
    [...messages].filter((m) => m.status !== "Cancelled").sort((a, b) => a.id - b.id)
  );

  // Processed: only tagged messages
  const processedMessages = applyFilters(
    messages.filter((m) => m.status === "Tagged")
  );

  // Cancelled: only cancelled messages
  const cancelledMessages = applyFilters(
    messages.filter((m) => m.status === "Cancelled")
  );

  const selectedMessage =
    selectedMessageId !== null
      ? (messages.find((m) => m.id === selectedMessageId) ?? null)
      : null;

  const cancelMessage =
    cancelMessageId !== null
      ? (messages.find((m) => m.id === cancelMessageId) ?? null)
      : null;

  const untaggedCount = messages.filter((m) => m.status === "Untagged").length;
  const taggedCount = messages.filter((m) => m.status === "Tagged").length;
  const cancelledCount = messages.filter((m) => m.status === "Cancelled").length;

  const value: MessageContextValue = {
    state,
    dispatch,
    queueMessages,
    processedMessages,
    cancelledMessages,
    selectedMessage,
    cancelMessage,
    untaggedCount,
    taggedCount,
    cancelledCount,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useMessages(): MessageContextValue {
  const ctx = useContext(MessageContext);
  if (!ctx) {
    throw new Error("useMessages must be used within a <MessageProvider>");
  }
  return ctx;
}
