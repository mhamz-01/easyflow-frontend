import { Button } from "@/src/components/shadcn/button";

export function QueryError({
  message,
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-destructive/40 p-6 text-center space-y-3">
      <p className="text-sm text-destructive">
        {message ?? "Something went wrong"}
      </p>
      <Button variant="outline" onClick={onRetry}>
        Refresh
      </Button>
    </div>
  );
}
