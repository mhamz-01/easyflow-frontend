import { DialogDescription, DialogTitle } from "@/src/components/shadcn/dialog";
import { Separator } from "@/src/components/shadcn/separator";

const TaskDetailsDrawerSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title */}
      <DialogTitle className="h-6 w-2/3 bg-muted rounded" />
      <div />

      {/* Description */}
      <DialogDescription className="space-y-2">
        <span className="h-4 w-full bg-muted rounded" />
        <span className="h-4 w-5/6 bg-muted rounded" />
      </DialogDescription>

      {/* Buttons */}
      <div className="flex gap-2 flex-wrap">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 w-28 bg-muted rounded" />
        ))}
      </div>

      <Separator className="bg-muted" />

      {/* Checklist */}
      <div className="space-y-3">
        <div className="h-4 w-32 bg-muted rounded" />

        {[...Array(2)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-24 bg-muted rounded" />
            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-4 w-4 bg-muted rounded" />
                <div className="h-4 w-40 bg-muted rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <Separator className="bg-muted" />

      {/* Attachments */}
      <div className="space-y-3">
        <div className="h-4 w-32 bg-muted rounded" />

        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="flex justify-between bg-muted px-3 py-2 rounded-lg"
          >
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-4 w-4 bg-muted rounded" />
          </div>
        ))}
      </div>

      <Separator className="bg-muted" />

      {/* Links */}
      <div className="space-y-3">
        <div className="h-4 w-32 bg-muted rounded" />

        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-8 w-full bg-muted rounded" />
        ))}
      </div>

      {/* Meta Card */}
      <div className="bg-muted border border-border rounded-2xl p-6 space-y-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-4 w-20 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDetailsDrawerSkeleton;
