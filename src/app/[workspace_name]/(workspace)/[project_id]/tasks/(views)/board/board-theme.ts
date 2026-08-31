export type ColumnTheme = {
  dot: string;
  headerBg: string;
  headerText: string;
  columnBg: string;
  border: string;
  ring: string;
  accent: string;
};

const slate: ColumnTheme = {
  dot: "bg-slate-400",
  headerBg: "bg-slate-500/10",
  headerText: "text-slate-300",
  columnBg: "bg-slate-500/[0.04]",
  border: "border-slate-500/15",
  ring: "ring-slate-400/50",
  accent: "bg-slate-400",
};

const blue: ColumnTheme = {
  dot: "bg-blue-400",
  headerBg: "bg-blue-500/10",
  headerText: "text-blue-300",
  columnBg: "bg-blue-500/[0.04]",
  border: "border-blue-500/15",
  ring: "ring-blue-400/50",
  accent: "bg-blue-400",
};

const amber: ColumnTheme = {
  dot: "bg-amber-400",
  headerBg: "bg-amber-500/10",
  headerText: "text-amber-300",
  columnBg: "bg-amber-500/[0.04]",
  border: "border-amber-500/15",
  ring: "ring-amber-400/50",
  accent: "bg-amber-400",
};

const violet: ColumnTheme = {
  dot: "bg-violet-400",
  headerBg: "bg-violet-500/10",
  headerText: "text-violet-300",
  columnBg: "bg-violet-500/[0.04]",
  border: "border-violet-500/15",
  ring: "ring-violet-400/50",
  accent: "bg-violet-400",
};

const emerald: ColumnTheme = {
  dot: "bg-emerald-400",
  headerBg: "bg-emerald-500/10",
  headerText: "text-emerald-300",
  columnBg: "bg-emerald-500/[0.04]",
  border: "border-emerald-500/15",
  ring: "ring-emerald-400/50",
  accent: "bg-emerald-400",
};

const rose: ColumnTheme = {
  dot: "bg-rose-400",
  headerBg: "bg-rose-500/10",
  headerText: "text-rose-300",
  columnBg: "bg-rose-500/[0.04]",
  border: "border-rose-500/15",
  ring: "ring-rose-400/50",
  accent: "bg-rose-400",
};

const orange: ColumnTheme = {
  dot: "bg-orange-400",
  headerBg: "bg-orange-500/10",
  headerText: "text-orange-300",
  columnBg: "bg-orange-500/[0.04]",
  border: "border-orange-500/15",
  ring: "ring-orange-400/50",
  accent: "bg-orange-400",
};

const sky: ColumnTheme = {
  dot: "bg-sky-400",
  headerBg: "bg-sky-500/10",
  headerText: "text-sky-300",
  columnBg: "bg-sky-500/[0.04]",
  border: "border-sky-500/15",
  ring: "ring-sky-400/50",
  accent: "bg-sky-400",
};

const fuchsia: ColumnTheme = {
  dot: "bg-fuchsia-400",
  headerBg: "bg-fuchsia-500/10",
  headerText: "text-fuchsia-300",
  columnBg: "bg-fuchsia-500/[0.04]",
  border: "border-fuchsia-500/15",
  ring: "ring-fuchsia-400/50",
  accent: "bg-fuchsia-400",
};

const teal: ColumnTheme = {
  dot: "bg-teal-400",
  headerBg: "bg-teal-500/10",
  headerText: "text-teal-300",
  columnBg: "bg-teal-500/[0.04]",
  border: "border-teal-500/15",
  ring: "ring-teal-400/50",
  accent: "bg-teal-400",
};

// Kanban ("state"/"none" grouping) columns — semantic: each status keeps a
// consistent, meaningful color everywhere it shows up in the app.
const STATE_COLUMN_THEME: Record<string, ColumnTheme> = {
  backlog: slate,
  todo: blue,
  "in progress": amber,
  "in review": violet,
  done: emerald,
};

// Priority-grouped columns — severity scale from calm to urgent.
const PRIORITY_COLUMN_THEME: Record<string, ColumnTheme> = {
  low: blue,
  medium: amber,
  high: orange,
  urgent: rose,
};

// Groupings with no inherent meaning (assignee, etc.) cycle a playful,
// still-legible palette by column position instead.
const FALLBACK_PALETTE: ColumnTheme[] = [
  violet,
  sky,
  rose,
  emerald,
  amber,
  fuchsia,
  teal,
  blue,
];

export function getColumnTheme(
  groupBy: string,
  key: string,
  index: number,
): ColumnTheme {
  const normalizedKey = key.toLowerCase();

  if (groupBy === "priority") {
    return PRIORITY_COLUMN_THEME[normalizedKey] ?? FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
  }

  if (groupBy === "none" || groupBy === "state") {
    return STATE_COLUMN_THEME[normalizedKey] ?? FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
  }

  if (normalizedKey === "unassigned") return slate;

  return FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
}
