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

const WhiteboardsListing = () => {
  const project = useProjectStore((s) => s.project);
  const workspace = useWorkspaceStore((s) => s.workspace);

  const { data, isFetched, isLoading, error } = useQuery({
    queryKey: project?.id && workspace?.id
      ? whiteboardKeys.all(project.id, workspace.id)
      : ["whiteboards"],
    queryFn: () =>
      getAllWhiteboards({ projectId: project!.id, workspaceId: workspace!.id }),
    enabled: !!project?.id && !!workspace?.id,
    staleTime: 1000 * 60,
  });

  if (isLoading) return <WhiteboardsListingLoadingSkeleton />;

  if (error) return <WhiteboardsListingLoadingError />;

  if (isFetched && (!data?.whiteboards || data.whiteboards.length === 0)) {
    return <WhiteboardsListingEmptyState />;
  }

  if (isFetched && data?.whiteboards && data.whiteboards.length > 0) {
    return <WhiteboardsList data={data.whiteboards} />;
  }

  return null;
};

export default WhiteboardsListing;