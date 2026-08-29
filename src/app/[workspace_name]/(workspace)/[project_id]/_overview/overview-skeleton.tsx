import { Skeleton } from "@/src/components/shadcn/skeleton";

const OverviewSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 px-4 pb-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Skeleton className="h-7 w-48" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </div>

      <Skeleton className="h-20 rounded-2xl" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    </div>
  );
};

export default OverviewSkeleton;
