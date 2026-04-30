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
  toast: { text: string; id: number } | null; // auto-dismiss toast
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
  toast: null,
};

// ─── Actions ─────────────────────────────────────────────────────────────────

type MessageAction =
  | { type: "INIT_MESSAGES"; payload: Message[] }
  | { type: "TAG_MESSAGE"; payload: { id: number } & TagPayload }
  | { type: "SET_TAB"; payload: TabKey }
  | { type: "SET_FILTER"; payload: Partial<Filters> }
  | { type: "CLEAR_FILTERS" }
  | { type: "OPEN_MODAL"; payload: number }
  | { type: "CLOSE_MODAL" }
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
  // Derived / convenience selectors
  queueMessages: Message[];
  processedMessages: Message[];
  selectedMessage: Message | null;
  untaggedCount: number;
  taggedCount: number;
}

const MessageContext = createContext<MessageContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function MessageProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(messageReducer, initialState);

  // Seed messages once on mount
  useEffect(() => {
    const seeded: Message[] = (rawMessages as { id: number; loggedBy: string; message: string }[]).map(
      (raw) => ({
        ...raw,
        status: "Untagged",
      })
    );
    dispatch({ type: "INIT_MESSAGES", payload: seeded });
  }, []);

  // ── Derived selectors ────────────────────────────────────────────────────

  const { messages, filters, selectedMessageId } = state;

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

  // Queue: sort untagged first, then tagged; then apply filters
  const queueMessages = applyFilters(
    [...messages].sort((a, b) => {
      if (a.status === "Untagged" && b.status === "Tagged") return -1;
      if (a.status === "Tagged" && b.status === "Untagged") return 1;
      return a.id - b.id;
    })
  );

  // Processed: only tagged messages, apply filters
  const processedMessages = applyFilters(
    messages.filter((m) => m.status === "Tagged")
  );

  const selectedMessage =
    selectedMessageId !== null
      ? (messages.find((m) => m.id === selectedMessageId) ?? null)
      : null;

  const untaggedCount = messages.filter((m) => m.status === "Untagged").length;
  const taggedCount = messages.filter((m) => m.status === "Tagged").length;

  const value: MessageContextValue = {
    state,
    dispatch,
    queueMessages,
    processedMessages,
    selectedMessage,
    untaggedCount,
    taggedCount,
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
