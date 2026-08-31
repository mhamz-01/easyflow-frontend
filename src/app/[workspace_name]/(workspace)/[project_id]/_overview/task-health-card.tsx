import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Gauge, ListChecks, Timer } from "lucide-react";
import { Skeleton } from "@/src/components/shadcn/skeleton";
import { TaskAnalytics } from "./task-analytics";
import TaskStatusMeter from "./task-status-meter";

type Tone = "default" | "good" | "warning" | "info";

const toneText: Record<Tone, string> = {
  default: "text-foreground",
  good: "text-primary-green",
  warning: "text-[#FF6B4A]",
  info: "text-primary-blue",
};

const toneIconWrap: Record<Tone, string> = {
  default: "bg-white/5 text-gray-300",
  good: "bg-primary-green/10 text-primary-green",
  warning: "bg-[#FF6B4A]/10 text-[#FF6B4A]",
  info: "bg-primary-blue/10 text-primary-blue",
};

const StatCard = ({
  icon,
  label,
  value,
  sub,
  tone = "default",
  isLoading,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: string;
  tone?: Tone;
  isLoading?: boolean;
}) => (
  <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
    <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${toneIconWrap[tone]}`}>
      {icon}
    </span>
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="text-xs text-gray-400">{label}</span>
      {isLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        <span className={`text-lg font-semibold leading-tight tracking-tight ${toneText[tone]}`}>
          {value}
        </span>
      )}
      {sub && !isLoading && <span className="truncate text-[11px] text-gray-500">{sub}</span>}
    </div>
  </div>
);

const TaskHealthCard = ({
  basePath,
  analytics,
  isLoading,
}: {
  basePath?: string;
  analytics: TaskAnalytics;
  isLoading: boolean;
}) => {
  const hasTasks = !isLoading && analytics.total > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1C1C1C]">
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5">
            <Gauge className="size-4" />
          </span>
          <h2 className="text-sm font-semibold">Task health</h2>
        </div>
        {basePath && (
          <Link
            href={`${basePath}/tasks`}
            className="flex shrink-0 items-center gap-1 text-xs text-gray-400 transition-colors hover:text-primary-blue"
          >
            View all
            <ArrowRight className="size-3" />
          </Link>
        )}
      </div>

      <div className="px-4 py-4">
        {!isLoading && analytics.total === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1.5 py-6 text-center">
            <ListChecks className="size-6 text-gray-600" />
            <p className="text-sm font-medium text-gray-400">No tasks yet</p>
            <p className="text-xs text-gray-600">Create a task to start tracking this project&apos;s health.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard
                icon={<ListChecks className="size-4" />}
                label="Total tasks"
                value={analytics.total}
                isLoading={isLoading}
              />
              <StatCard
                icon={<CheckCircle2 className="size-4" />}
                label="Completed"
                value={`${analytics.completionRate}%`}
                sub={`${analytics.counts.done} of ${analytics.total} done`}
                tone={analytics.completionRate === 100 ? "good" : "default"}
                isLoading={isLoading}
              />
              <StatCard
                icon={<Timer className="size-4" />}
                label="In progress"
                value={analytics.counts["in progress"]}
                tone={analytics.counts["in progress"] > 0 ? "info" : "default"}
                isLoading={isLoading}
              />
              <StatCard
                icon={<AlertTriangle className="size-4" />}
                label="Overdue"
                value={analytics.overdueCount}
                tone={analytics.overdueCount > 0 ? "warning" : "good"}
                isLoading={isLoading}
              />
            </div>

            {hasTasks && (
              <div className="mt-4 border-t border-white/[0.06] pt-4">
                <TaskStatusMeter counts={analytics.counts} total={analytics.total} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskHealthCard;
