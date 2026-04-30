# Toxic Message Tagging & Review System

A production-quality moderation dashboard built with **React + TypeScript + Vite + TailwindCSS v4**.

## Features

- 📋 **Message Queue** — 100 pre-loaded moderation reports, untagged first
- 🏷️ **Tagging Modal** — multi-select toxicity types, impact levels, optional comment
- ✦ **Suggested Impact** — keyword-matching auto-suggests severity (Critical → Low)
- ✅ **Processed Reports** — reviewed messages with full audit trail (who, when, what)
- 🔍 **Filters** — filter by Impact, Toxicity Type, and Status
- 🔔 **Toast Notifications** — auto-dismiss success feedback on tag/edit
- ♿ **Accessible** — `aria-*` roles, keyboard navigation, Escape to close modal

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript (strict) |
| Styling | TailwindCSS v4 + vanilla CSS |
| State | React Context + `useReducer` |
| Fonts | Inter (Google Fonts) |

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production bundle
```

## Project Structure

```
src/
├── components/
│   ├── Header.tsx         # Branding + live counters
│   ├── Tabs.tsx           # Queue / Processed tab switcher
│   ├── QueueView.tsx      # Message queue page
│   ├── ProcessedView.tsx  # Processed reports page
│   ├── MessageTable.tsx   # Paginated table (queue mode)
│   ├── TableRow.tsx       # Single queue row
│   ├── TaggingModal.tsx   # Tag / Edit modal
│   ├── Filters.tsx        # Impact / Type / Status filters
│   └── Toast.tsx          # Auto-dismiss notification
├── context/
│   └── MessageContext.tsx # Global state (Context + useReducer)
├── hooks/
│   └── useSuggestedImpact.ts
├── data/
│   └── messages.json      # 100 sample moderation reports
├── types/
│   └── index.ts
└── utils/
    └── helpers.ts         # Colour maps, truncate, formatTimestamp
```
