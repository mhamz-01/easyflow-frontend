"use client";

import { useQuery } from "@tanstack/react-query";
import { docsKeys } from "@/src/lib/api/documents/keys";
import { getAllDocs } from "@/src/lib/api/documents/services";
import { useProjectStore } from "@/src/store/useProjectStore";
import { useWorkspaceStore } from "@/src/store/workspace";

import DocsListingLoadingSkeleton from "./loading-skeleton";
import DocsListingLoadingError from "./error";
import DocsListingEmptyState from "./empty-state";
import DocsList from "./docs-list";
import { DateFilter } from "@/src/components/custom/listing-filters/sort-by-select";

const DocsListing = ({ isPrivate  , search ,   dateFilter,
  selectedMembers,}: { isPrivate: boolean, search: string , dateFilter: DateFilter , selectedMembers:number[] }) => {
  // --------------- Defining States ------------------ //
  const project = useProjectStore((s) => s.project);
  const workspace = useWorkspaceStore((s) => s.workspace);
  

  // ----------- Fetching Docs from backend -------------- //
  const { data, isFetched, isLoading, error } = useQuery({
    queryKey: docsKeys.all(workspace?.id ?? 0, project?.id ?? 0), // ✅ safe fallback
    queryFn: () =>
      getAllDocs({ workspaceId: workspace!.id, projectId: project!.id }),
    enabled: !!project?.id && !!workspace?.id, // query won't run if null
    staleTime: 1000 * 60,
  });

  // ---------------- Loading State ----------------
  if (isLoading) {
    return <DocsListingLoadingSkeleton />;
  }

  // ---------------- Error State ----------------
  if (error) {
    return <DocsListingLoadingError />;
  }

  // ---------------- Empty State ----------------
  if (isFetched && (!data?.docs || data.docs.length === 0)) {
    return <DocsListingEmptyState />;
  }

  // ---------------- Docs List ----------------
  if (isFetched && data?.docs && data.docs.length > 0) {
    const now = new Date();

    const filtered = data.docs.filter((doc) => {
      // ── tab filter ──
      if (doc.isPrivate !== isPrivate) return false;

      // ── search filter ──
      if (
        search.trim() &&
        !doc.documentName.toLowerCase().includes(search.toLowerCase())
      )
        return false;

      // ── date filter ──
      // ── date filter ──
if (dateFilter.preset || dateFilter.range) {
  const created = new Date(doc.createdDate);
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
      if (selectedMembers.length > 0 && !selectedMembers.includes(doc.createdBy))
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

    return <DocsList docsListData={filtered} />;
  }

  return null;
};

export default DocsListing;

