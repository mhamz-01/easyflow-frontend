import { TaskStateKey, TASK_STATES } from "./task-analytics";

const SEGMENTS: { key: TaskStateKey; label: string; color: string }[] = [
  { key: "todo", label: "Todo", color: "#6E6E6E" },
  { key: "in progress", label: "In progress", color: "#0D8EFF" },
  { key: "done", label: "Done", color: "#51FF00" },
];

const TaskStatusMeter = ({
  counts,
  total,
}: {
  counts: Record<TaskStateKey, number>;
  total: number;
}) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">Status breakdown</span>
        <span className="text-[11px] text-gray-500">{total} total</span>
      </div>

      <div className="mt-2 flex h-2.5 w-full gap-[3px] overflow-hidden rounded-full bg-white/5">
        {total === 0
          ? null
          : TASK_STATES.map((key) => {
              const count = counts[key];
              if (!count) return null;
              const segment = SEGMENTS.find((s) => s.key === key)!;
              const pct = Math.round((count / total) * 100);
              return (
                <div
                  key={key}
                  className="h-full rounded-full transition-[width]"
                  style={{ width: `${pct}%`, backgroundColor: segment.color }}
                  title={`${segment.label}: ${count} (${pct}%)`}
                />
              );
            })}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {SEGMENTS.map((segment) => {
          const count = counts[segment.key];
          const pct = total ? Math.round((count / total) * 100) : 0;
          return (
            <span key={segment.key} className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
              {segment.label}
              <span className="text-gray-500">
                · {count} ({pct}%)
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TaskStatusMeter;
