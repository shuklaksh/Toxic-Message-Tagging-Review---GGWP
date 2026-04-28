// ─── Core Message Types ──────────────────────────────────────────────────────

export type Impact = "Low" | "Medium" | "High" | "Critical";
export type Status = "Untagged" | "Tagged";

export const TOXICITY_OPTIONS = [
  "Harassment",
  "Hate",
  "Threats",
  "Trolling",
  "Slurs",
  "Abuse",
  "Personal Attack",
  "Discrimination",
  "Spamming",
  "Toxic Behavior",
  "Bullying",
  "Cheating",
  "Custom",
] as const;

export type ToxicityOption = (typeof TOXICITY_OPTIONS)[number];

/** Shape coming from the raw JSON file */
export interface RawMessage {
  id: number;
  loggedBy: string;
  message: string;
}

/** Extended runtime shape held in global state */
export interface Message extends RawMessage {
  toxicityType?: string[];
  impact?: Impact;
  comment?: string;
  status: Status;
  updatedBy?: string;
  updatedAt?: string;
}

// ─── Tagging Payload ─────────────────────────────────────────────────────────

export interface TagPayload {
  toxicityType: string[];
  impact: Impact;
  comment?: string;
}

// ─── Tab Types ───────────────────────────────────────────────────────────────

export type TabKey = "queue" | "processed";

// ─── Filter Types ────────────────────────────────────────────────────────────

export interface Filters {
  impact: Impact | "All";
  toxicityType: string | "All";
  status: Status | "All";
}
