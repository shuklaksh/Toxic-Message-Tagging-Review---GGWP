import { useMemo } from "react";
import type { Impact } from "../types";

// ─── Keyword → Impact mapping (ordered Critical → Low, first match wins) ──────

const RULES: Array<{ keywords: string[]; impact: Impact }> = [
  {
    impact: "Critical",
    keywords: [
      "kill", "die", "dead", "murder", "shoot", "bomb", "swat", "ddos",
      "virus", "threat", "weapon", "knife", "gun", "death", "suicide",
      "i will find", "watch your back", "pay for this", "make you pay",
    ],
  },
  {
    impact: "High",
    keywords: [
      "hate", "slur", "racist", "racism", "racial", "ethnic", "discrimination",
      "sexist", "homophob", "transphob", "gay", "disabled", "religion",
      "address", "ip", "doxx", "dox", "personal", "school", "linkedin",
      "harm", "hurt", "attack",
    ],
  },
  {
    impact: "Medium",
    keywords: [
      "stupid", "idiot", "moron", "loser", "trash", "garbage", "worthless",
      "pathetic", "terrible", "useless", "disgusting", "failure", "awful",
      "bully", "abuse", "harassment", "harass", "insult",
    ],
  },
  {
    impact: "Low",
    keywords: [
      "spam", "bot", "advertisement", "selling", "buying", "hack", "cheat",
      "smurf", "boost", "griefing", "troll", "annoy", "flood",
    ],
  },
];

export function useSuggestedImpact(message: string): Impact | null {
  return useMemo(() => {
    if (!message) return null;
    const lower = message.toLowerCase();
    for (const rule of RULES) {
      if (rule.keywords.some((kw) => lower.includes(kw))) {
        return rule.impact;
      }
    }
    return null;
  }, [message]);
}
