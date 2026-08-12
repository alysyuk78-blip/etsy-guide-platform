export type Block =
  | { t: "lead"; text: string }
  | { t: "p"; text: string }
  | { t: "h3"; text: string }
  | { t: "h4"; text: string }
  | { t: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { t: "list"; items: string[]; ordered?: boolean }
  | { t: "note"; text: string; title?: string }
  | { t: "warn"; text: string; title?: string }
  | { t: "prompt"; title?: string; text: string }
  | { t: "quote"; text: string; source?: string }
  | { t: "figure"; id: string; caption: string }
  | { t: "checklist"; id: string; title: string; items: string[] }
  | { t: "divider" };

export interface SectionDef {
  id: string;
  group: string;
  nav: string;
  title: string;
  subtitle?: string;
  blocks: Block[];
}

export interface StageDef {
  num: number;
  slug: string;
  title: string;
  timing: string;
  cost: string;
  meta: { goal: string; time: string; result: string; risk: string };
  plain?: string;
  blocks: Block[];
}
