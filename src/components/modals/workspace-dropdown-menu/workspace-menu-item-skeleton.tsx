import { Skeleton } from "../../shadcn/skeleton";

const WorkspaceMenuItemSkeleton = () => {
  return (
    <div className="flex items-center space-x-4 p-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  );
};

export default WorkspaceMenuItemSkeleton;
