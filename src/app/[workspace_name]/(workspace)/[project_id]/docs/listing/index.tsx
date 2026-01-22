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
import { useEffect } from "react";

const DocsListing = () => {
  // --------------- Defining States ------------------ //
  const project = useProjectStore((s) => s.project);
  const workspace = useWorkspaceStore((s) => s.workspace);

  // ----------- Fetching Docs from backend -------------- //
  const { data, isFetched, isLoading, error } = useQuery({
    queryKey: docsKeys.all(workspace!.id, project!.id),
    queryFn: () =>
      getAllDocs({ projectId: project!.id, workspaceId: workspace!.id }),
    enabled: !!project?.id && !!workspace?.id,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    console.log("docs list", data);
  }, [data]);
  // ---------------- UI Rendering ----------------- //

  // ---------------- Loading State ----------------
  if (isLoading) {
    return <DocsListingLoadingSkeleton />;
  }

  // // ---------------- Error State ----------------
  if (error) {
    return <DocsListingLoadingError />;
  }

  // // ---------------- Empty State ----------------
  if (isFetched && (!data?.docs || data.docs.length === 0)) {
    return <DocsListingEmptyState />;
  }

  // ---------------- Docs List ----------------
  if (isFetched && data?.docs.length && data?.docs.length > 0) {
    return <DocsList docsListData={data.docs} />;
  }

  return null;
};

export default DocsListing;
