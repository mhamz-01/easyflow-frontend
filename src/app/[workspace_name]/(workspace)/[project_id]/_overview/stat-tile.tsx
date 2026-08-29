import { Skeleton } from "@/src/components/shadcn/skeleton";

const toneClass: Record<"default" | "good" | "warning", string> = {
  default: "text-foreground",
  good: "text-primary-green",
  warning: "text-[#FF6B4A]",
};

const StatTile = ({
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
}) => {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-white/[0.06] bg-[#1C1C1C] px-4 py-3.5">
      <span className="text-xs text-gray-400">{label}</span>
      {isLoading ? (
        <Skeleton className="h-7 w-14" />
      ) : (
        <span className={`text-2xl font-semibold tracking-tight ${toneClass[tone]}`}>
          {value}
        </span>
      )}
      {sub && !isLoading && <span className="text-[11px] text-gray-500">{sub}</span>}
    </div>
  );
};

export default StatTile;
