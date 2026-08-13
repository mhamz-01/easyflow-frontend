import DocsListingLoadingSkeleton from "./listing/loading-skeleton";

// DocsHeader lives in layout.tsx and stays mounted across navigation
// within /docs/* — this only needs to cover the gap in `children` before
// the listing page's own JS/query is ready. Same skeleton component the
// listing renders during its own isLoading state, so there's no visual
// jump once the real page takes over. No "use client" needed — it's a
// static skeleton, so it can render straight from the server with no
// extra JS on the wire.
export default function Loading() {
  return (
    <section className="px-4">
      <DocsListingLoadingSkeleton />
    </section>
  );
}
