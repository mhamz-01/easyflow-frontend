"use client";

import { useQuery } from "@tanstack/react-query";
import { useProjectStore } from "@/src/store/useProjectStore";
import { useWorkspaceStore } from "@/src/store/workspace";
import WhiteboardsListingLoadingSkeleton from "./loading-skeleton";
import WhiteboardsListingLoadingError from "./error";
import WhiteboardsListingEmptyState from "./empty-state";
import WhiteboardsList from "./whiteboards-list";
import { getAllWhiteboards } from "@/src/lib/api/whiteboards/services";
import { whiteboardKeys } from "@/src/lib/api/whiteboards/keys";
import { DateFilter } from "@/src/components/custom/listing-filters/sort-by-select";


const WhiteboardsListing = ({ isPrivate  , search ,   dateFilter,
  selectedMembers,}: { isPrivate: boolean, search: string , dateFilter: DateFilter , selectedMembers:number[] }) => {
  const project = useProjectStore((s) => s.project);
  const workspace = useWorkspaceStore((s) => s.workspace);

  const { data, isFetched, isLoading, error } = useQuery({
    queryKey: whiteboardKeys.all(workspace?.id ?? 0, project?.id ?? 0), // ✅ safe fallback
    queryFn: () =>
      getAllWhiteboards({ workspaceId: workspace!.id, projectId: project!.id }),
    enabled: !!project?.id && !!workspace?.id, // query won't run if null
    staleTime: 1000 * 60,
  });

  if (isLoading) return <WhiteboardsListingLoadingSkeleton />;

  if (error) return <WhiteboardsListingLoadingError />;

  if (isFetched && (!data?.whiteboards || data.whiteboards.length === 0)) {
    return <WhiteboardsListingEmptyState />;
  }


   // ---------------- Docs List ----------------
   if (isFetched && data?.whiteboards && data.whiteboards.length > 0) {
    const now = new Date();

    const filtered = data.whiteboards.filter((whiteboard) => {
      // ── tab filter ──
      if (whiteboard.isPrivate !== isPrivate) return false;

      // ── search filter ──
      if (
        search.trim() &&
        !whiteboard.whiteboardName.toLowerCase().includes(search.toLowerCase())
      )
        return false;

      // ── date filter ──
      // ── date filter ──
if (dateFilter.preset || dateFilter.range) {
  const created = new Date(whiteboard.createdDate);
  const now = new Date();

  if (dateFilter.preset) {
    const cutoff = new Date();
    if (dateFilter.preset === "today") {
      cutoff.setHours(0, 0, 0, 0);
    } else if (dateFilter.preset === "last-7") {
      cutoff.setDate(now.getDate() - 7);
    } else if (dateFilter.preset === "last-30") {
      cutoff.setDate(now.getDate() - 30);
    } else if (dateFilter.preset === "last-3-months") {
      cutoff.setMonth(now.getMonth() - 3);
    }
    if (created < cutoff) return false;
  }

  if (dateFilter.range) {
    const { from, to } = dateFilter.range;
    if (from && created < from) return false;
    if (to) {
      const endOfDay = new Date(to);
      endOfDay.setHours(23, 59, 59, 999);
      if (created > endOfDay) return false;
    }
  }
}

      // ── member filter ──
      if (selectedMembers.length > 0 && !selectedMembers.includes(whiteboard.createdBy))
        return false;

      return true;
    });

    if (filtered.length === 0) {
      return (
        <p className="text-sm text-muted-foreground text-center mt-12">
          {search.trim()
            ? `No results for "${search}"`
            : `No ${isPrivate ? "private" : "public"} documents found.`}
        </p>
      );
    }

    return <WhiteboardsList whiteboardsListData={filtered} />;
  }

  return null;
};

export default WhiteboardsListing;

