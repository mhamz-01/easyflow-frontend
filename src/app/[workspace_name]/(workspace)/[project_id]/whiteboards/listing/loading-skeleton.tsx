import { Skeleton } from "@/src/components/shadcn/skeleton";

const DocsListingLoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" /> {/* Title */}
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
};

export default DocsListingLoadingSkeleton;
