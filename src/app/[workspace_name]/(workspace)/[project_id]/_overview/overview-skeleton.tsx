import { Skeleton } from "@/src/components/shadcn/skeleton";

const OverviewSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 px-4 pb-10 sm:px-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>

      <Skeleton className="h-16 rounded-2xl" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    </div>
  );
};

export default OverviewSkeleton;
