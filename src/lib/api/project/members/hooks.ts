import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import {
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
  leaveProject,
} from "./services";
import { subscribeToProjectMembership } from "@/src/lib/realtime/projectMembershipChannelRegistry";
import { ProjectMember } from "@/src/types/project";

export const projectMembersKeys = {
  all: (projectId: number) => ["project", projectId, "members"] as const,
};

export const useProjectMembers = (projectId?: number) => {
  return useQuery({
    queryKey: projectMembersKeys.all(projectId ?? 0),
    queryFn: () => getProjectMembers(projectId!),
    enabled: !!projectId,
  });
};

// Cheap client-side lookup so any list of tasks/docs/whiteboards can badge a
// user's avatar without the backend annotating every row of every resource —
// one membership list, joined wherever a user is rendered.
export const useProjectMemberStatusMap = (projectId?: number) => {
  const { data } = useProjectMembers(projectId);
  return new Map((data?.members ?? []).map((m) => [m.userId, m.status]));
};

export const useAddProjectMember = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => addProjectMember({ projectId, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectMembersKeys.all(projectId) });
    },
    onError: () => toast.error("Failed to add member"),
  });
};

export const useRemoveProjectMember = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => removeProjectMember({ projectId, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectMembersKeys.all(projectId) });
    },
    onError: () => toast.error("Failed to remove member"),
  });
};

export const useLeaveProject = (projectId: number) => {
  return useMutation({
    mutationFn: () => leaveProject({ projectId }),
    onError: () => toast.error("Failed to leave project"),
  });
};

// Keeps every open tab's membership list/badges live, and — for the affected
// user themself — flags `isRemoved` so the caller can show a clear "you're
// no longer in this project" state (and redirect on its own schedule)
// instead of leaving them on a page that will just start 404ing on every
// action. Returning state here (rather than taking an onSelfRemoved
// callback) also avoids a resubscribe-on-every-render bug: an inline
// callback passed by the caller gets a new identity each render, which used
// to tear down and recreate the realtime subscription constantly.
export const useProjectMembershipRealtime = (
  workspaceId: number | null | undefined,
  projectId: number | null | undefined,
) => {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const [isRemoved, setIsRemoved] = useState(false);

  // A navigation to a different project must reset this — otherwise a user
  // removed from project A and then routed to project B would still see
  // "removed" there.
  useEffect(() => {
    setIsRemoved(false);
  }, [projectId]);

  useEffect(() => {
    if (!workspaceId || !projectId || !currentUser) return;

    const unsubscribe = subscribeToProjectMembership(workspaceId, projectId, (payload) => {
      queryClient.setQueryData(
        projectMembersKeys.all(projectId),
        (data?: { success: boolean; members: ProjectMember[] }) => {
          if (!data) return data;
          return {
            ...data,
            members: data.members.map((m) =>
              m.userId === payload.userId ? { ...m, status: payload.status } : m,
            ),
          };
        },
      );

      if (payload.userId === currentUser.id) {
        setIsRemoved(payload.status === "removed");
      }
    });

    return unsubscribe;
  }, [workspaceId, projectId, queryClient, currentUser]);

  return { isRemoved };
};
