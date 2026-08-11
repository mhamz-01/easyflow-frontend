import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { getWorkspaceMembers } from "./services";

export const useWorkspaceMembers = (workspaceId?: number) => {
  return useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => getWorkspaceMembers({ workspaceId: workspaceId! }),
    enabled: !!workspaceId,
  });
};

// Admin/owner roles get unconditional edit access on public documents —
// mirrors the backend's ADMIN_ROLES check in documentAccess.service.js.
export const ADMIN_ROLES = ["owner", "admin"];

// Derives the signed-in user's WorkspaceMembers.role from the members list
// by matching Clerk's userId against each member's User.clerkId.
export const useCurrentWorkspaceRole = (workspaceId?: number) => {
  const { userId } = useAuth();
  const { data, isLoading } = useWorkspaceMembers(workspaceId);

  const role = data?.members.find((m) => m.User.clerkId === userId)?.role;

  return {
    role,
    isAdminOrOwner: !!role && ADMIN_ROLES.includes(role),
    isLoading,
  };
};
