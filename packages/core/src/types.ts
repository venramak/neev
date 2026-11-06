/** The person's own data. None of these types ever cross the device boundary except via `StructPayload`. */
export type Ring = "few" | "circle" | "village" | "carried";
export type Warmth = "come" | "answer" | "knot" | "nocall" | "gone";
export type Recency = "d" | "w" | "m" | "y";
export type Chair = "settle" | "sharpen" | "carry" | "belong" | "aim";
export type ReasonId = "share" | "ask" | "memory" | "news" | "occasion" | "plan" | "thanks" | "mend" | "hello";
export type Lang = "en" | "hi";

export interface RingMove { at: string; from: Ring; to: Ring }

export interface Person {
  id: string;
  name: string;
  aliases: string[];
  group: boolean;
  warmth?: Warmth;
  recency?: Recency;
  ringOverride?: Ring;
  chairs: Chair[];
  /** "Whose 2:40 call would you pick up?" */
  holdFor: boolean;
  /** Set by the person: never suggest acts or messages for them. */
  noSuggest: boolean;
  /** Private: the person feels smaller around them. Never shown to anyone, never suggested. */
  smaller: boolean;
  ringLog: RingMove[];
}

export type Outcome = "glad" | "ordinary" | "waiting" | "private";

export interface Reach {
  personId: string;
  at: number;
  reason: ReasonId;
  via: "message" | "act";
  outcome?: Outcome;
  asked: number;
}
