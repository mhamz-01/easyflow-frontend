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

const dummyData = [
  {
    id: 1,
    name: "easyflow user stories",
  },
  {
    id: 2,
    name: "Database schema",
  },
  {
    id: 3,
    name: "Easyflow Project Outlines",
  },
  {
    id: 4,
    name: "Todo list",
  },
];
const WhiteboardsListing = () => {
  // --------------- Defining States ------------------ //
  const project = useProjectStore((s) => s.project);
  const workspace = useWorkspaceStore((s) => s.workspace);

  // ----------- Fetching Docs from backend -------------- //
  const { data, isFetched, isLoading, error } = useQuery({
    queryKey:
      project?.id && workspace?.id
        ? whiteboardKeys.all(project.id, workspace.id)
        : ["whiteboards"],
    queryFn: () =>
      getAllWhiteboards({ projectId: project!.id, workspaceId: workspace!.id }),
    enabled: !!project?.id && !!workspace?.id,
    staleTime: 1000 * 60,
  });

  /**
   * 
  // ---------------- UI Rendering ----------------- //

  // ---------------- Loading State ----------------
  if (isLoading) {
    return <WhiteboardsListingLoadingSkeleton />;
  }

  // // ---------------- Error State ----------------
  if (error) {
    return <WhiteboardsListingLoadingError />;
  }

  // // ---------------- Empty State ----------------
  if (isFetched && (!data?.docs || data.docs.length === 0)) {
    return <WhiteboardsListingEmptyState />;
  }

  // ---------------- Docs List ----------------
  if (isFetched && data?.docs?.length > 0) {
    return <WhiteboardsList data={dummyData} />;
  }

  return null;
   */
  return <WhiteboardsList data={dummyData} />;
};

export default WhiteboardsListing;
