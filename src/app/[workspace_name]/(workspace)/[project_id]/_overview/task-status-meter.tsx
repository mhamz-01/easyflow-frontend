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
      <div className="flex h-2.5 w-full gap-[3px] overflow-hidden rounded-full bg-white/5">
        {total === 0
          ? null
          : TASK_STATES.map((key) => {
              const count = counts[key];
              if (!count) return null;
              const segment = SEGMENTS.find((s) => s.key === key)!;
              return (
                <div
                  key={key}
                  className="h-full rounded-full"
                  style={{ width: `${(count / total) * 100}%`, backgroundColor: segment.color }}
                  title={`${segment.label}: ${count}`}
                />
              );
            })}
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
        {SEGMENTS.map((segment) => (
          <span key={segment.key} className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
            {segment.label} · {counts[segment.key]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TaskStatusMeter;
