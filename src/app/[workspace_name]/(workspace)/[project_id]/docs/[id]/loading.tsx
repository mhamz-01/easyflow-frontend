// Mirrors the inline skeleton page.tsx/editor render during their own
// isLoading state — shown immediately on navigation instead of nothing
// until this route's JS finishes loading.
export default function Loading() {
  return (
    <div className="relative h-screen overflow-hidden">
      <div className="max-h-max rounded-xl bg-muted animate-pulse" />
    </div>
  );
}
