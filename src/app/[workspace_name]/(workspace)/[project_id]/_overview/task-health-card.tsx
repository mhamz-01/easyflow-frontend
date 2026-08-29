import { Skeleton } from "@/src/components/shadcn/skeleton";
import { TaskAnalytics } from "./task-analytics";
import TaskStatusMeter from "./task-status-meter";

const toneClass: Record<"default" | "good" | "warning", string> = {
  default: "text-foreground",
  good: "text-primary-green",
  warning: "text-[#FF6B4A]",
};

const StatInline = ({
  label,
  value,
  sub,
  tone = "default",
  isLoading,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  tone?: "default" | "good" | "warning";
  isLoading?: boolean;
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-gray-400">{label}</span>
    {isLoading ? (
      <Skeleton className="h-6 w-10" />
    ) : (
      <span className={`text-xl font-semibold tracking-tight ${toneClass[tone]}`}>{value}</span>
    )}
    {sub && !isLoading && <span className="text-[11px] text-gray-500">{sub}</span>}
  </div>
);

const TaskHealthCard = ({
  analytics,
  isLoading,
}: {
  analytics: TaskAnalytics;
  isLoading: boolean;
}) => {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#1C1C1C] px-4 py-3.5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <StatInline label="Total tasks" value={analytics.total} isLoading={isLoading} />
        <div className="hidden h-8 w-px bg-white/[0.06] sm:block" />
        <StatInline
          label="Completed"
          value={`${analytics.completionRate}%`}
          sub={`${analytics.counts.done} of ${analytics.total} done`}
          tone={analytics.completionRate === 100 && analytics.total > 0 ? "good" : "default"}
          isLoading={isLoading}
        />
        <div className="hidden h-8 w-px bg-white/[0.06] sm:block" />
        <StatInline
          label="Overdue"
          value={analytics.overdueCount}
          tone={analytics.overdueCount > 0 ? "warning" : "good"}
          isLoading={isLoading}
        />
      </div>

      {!isLoading && analytics.total > 0 && (
        <div className="mt-3.5 border-t border-white/[0.06] pt-3.5">
          <TaskStatusMeter counts={analytics.counts} total={analytics.total} />
        </div>
      )}
    </div>
  );
};

export default TaskHealthCard;
