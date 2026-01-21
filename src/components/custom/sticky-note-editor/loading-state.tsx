import { Skeleton } from "@/src/components/shadcn/skeleton";

const StickyNotesLoadingState = () => {
  return (
    <div className="flex gap-5 mt-5">
      {[1, 2, 3].map((skeleton) => (
        <Skeleton key={skeleton} className="w-[280px] h-[350px]" />
      ))}
    </div>
  );
};

export default StickyNotesLoadingState;
