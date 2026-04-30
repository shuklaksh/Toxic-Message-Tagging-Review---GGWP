# Toxic Message Tagging & Review System

> A production-quality moderation dashboard for reviewing, tagging, and managing toxic messages.

🔗 **Live Demo:** [https://toxic-message-tagging-review-ggwp.vercel.app/](https://toxic-message-tagging-review-ggwp.vercel.app/)

---

## Features

### 📋 Message Queue
- 100 pre-loaded moderation reports (mix of Untagged and pre-tagged)
- Messages displayed in natural ID order — no forced sorting
- Color-coded status badges (amber for Untagged, emerald for Tagged)
- 10 messages per page with ellipsis pagination

### 🏷️ Tag / Edit Modal
- Multi-select toxicity type checkboxes (13 categories + Custom input)
- Impact level radio cards: Low / Medium / High / Critical
- **Auto-suggested impact** via keyword matching (e.g. "threat" → Critical)
- Optional moderator comment
- Edit mode pre-fills all existing values
- **Sticky footer** — Save Changes / Submit Tag button always visible without scrolling
- Keyboard support: `Escape` to dismiss, full form accessibility

### ✅ Processed Reports Tab
- All tagged messages with full audit trail
- Columns: Message, Logged By, Toxicity Type, Impact, Comment, Updated By, Timestamp
- **Edit** button to re-open the tagging modal
- **Mark Invalid** button to cancel a processed report

### 🚫 Mark Invalid / Cancelled Reports
- Mark any processed report as invalid directly from the Processed tab
- Optional cancellation reason (stored separately from the tag comment)
- Cancelled tab appears dynamically once any report is marked invalid
- Cancelled reports show: strikethrough message, reason pill (orange if custom, grey if default), who cancelled, timestamp

### 🔍 Filters
- Filter by: Impact · Toxicity Type · Status (queue only)
- "Clear filters" button appears only when a filter is active
- Filters reset automatically on tab switch

### 🔔 Toast Notifications
- Auto-dismisses in 3 seconds after Tag / Edit / Mark Invalid actions
- Distinct messages: "Message tagged successfully!" · "Tag updated successfully!" · "Report marked as invalid."
- Manual dismiss button

### 📊 Live Counters
- Header: Total · Untagged · Tagged · Cancelled (appears when > 0)
- Tab badges: Queue (untagged count) · Processed · Cancelled

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript (strict mode) |
| Styling | TailwindCSS v4 + vanilla CSS |
| State | React Context + `useReducer` |
| Fonts | Inter (Google Fonts) |
| Deployment | Vercel |

---

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/shuklaksh/Toxic-Message-Tagging-Review---GGWP.git
cd Toxic-Message-Tagging-Review---GGWP
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

App will be available at **http://localhost:5173**

### 4. Build for production

```bash
npm run build
```

Output goes to the `dist/` folder.

---

## Project Structure

```
src/
├── components/
│   ├── ui/
│   │   └── Select.tsx          ← Reusable custom dropdown (keyboard nav, auto-flip)
│   ├── Header.tsx              ← Branding + live counters (Total / Untagged / Tagged / Cancelled)
│   ├── Tabs.tsx                ← Queue / Processed / Cancelled tab switcher
│   ├── Filters.tsx             ← Impact / Type / Status filter bar
│   ├── QueueView.tsx           ← Message queue page
│   ├── ProcessedView.tsx       ← Processed reports page (Edit + Mark Invalid)
│   ├── CancelledView.tsx       ← Cancelled reports page (reason, who, when)
│   ├── MessageTable.tsx        ← Paginated queue table
│   ├── TableRow.tsx            ← Single queue row with status / impact badges
│   ├── TaggingModal.tsx        ← Tag / Edit modal (sticky footer, suggested impact)
│   ├── CancelModal.tsx         ← Mark Invalid confirmation modal
│   └── Toast.tsx               ← Auto-dismiss notification
├── context/
│   └── MessageContext.tsx      ← Global state — Context + useReducer (10 actions)
├── hooks/
│   └── useSuggestedImpact.ts   ← Keyword → Impact suggestion hook
├── data/
│   └── messages.json           ← 100 moderation reports (85 untagged, 15 pre-tagged)
├── types/
│   └── index.ts                ← Message, Impact, Status, TagPayload, Filters, TabKey
└── utils/
    └── helpers.ts              ← IMPACT_BG, IMPACT_DOT, truncate, formatTimestamp
```

---

## State Management

```
MessageState
  ├── messages[]            ← All 100 messages (source of truth)
  ├── activeTab             ← "queue" | "processed" | "cancelled"
  ├── filters               ← { impact, toxicityType, status }
  ├── selectedMessageId     ← Controls TaggingModal open/close
  ├── cancelMessageId       ← Controls CancelModal open/close
  └── toast                 ← { text, id } | null

Actions (10 total):
  INIT_MESSAGES · TAG_MESSAGE · CANCEL_MESSAGE
  SET_TAB · SET_FILTER · CLEAR_FILTERS
  OPEN_MODAL · CLOSE_MODAL
  OPEN_CANCEL_MODAL · CLOSE_CANCEL_MODAL · CLEAR_TOAST

Derived selectors (computed in provider):
  ├── queueMessages         ← Non-cancelled, sorted by ID, filtered
  ├── processedMessages     ← Tagged only, filtered
  ├── cancelledMessages     ← Cancelled only, filtered
  ├── selectedMessage       ← Message object for TaggingModal
  ├── cancelMessage         ← Message object for CancelModal
  ├── untaggedCount
  ├── taggedCount
  └── cancelledCount
```
