import { Skeleton } from "@/src/components/shadcn/skeleton";

export function DataTableSkeleton() {
  return (
    <div className="rounded-xl border p-4 space-y-4 mt-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32 ml-auto" />
        </div>
      ))}
    </div>
  );
}
