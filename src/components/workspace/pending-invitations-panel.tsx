"use client";

import { Mails, Check, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  acceptInvitation,
  deleteInvitation,
  getUserWorkspaceInvitesByEmail,
} from "@/src/lib/api/workspace/invites/services";
import { Skeleton } from "../shadcn/skeleton";
import { Button } from "../shadcn/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { WorkspaceInvite } from "@/src/types/workspace";
import { getApiErrorMessage } from "@/src/lib/api/client";

// Shared data + mutations behind the "what invites does this account have"
// UI — used both inside the workspace dropdown dialog (for users who already
// have a workspace) and as an inline banner on /onboarding (the only place a
// brand-new invitee, with zero workspaces, can ever see their invite).
export const usePendingInvitations = (
  onAccepted?: (workspaceSlug?: string) => void,
) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["workspaceInvites", "by-email", email],
    queryFn: () => getUserWorkspaceInvitesByEmail({ email: email! }),
    enabled: !!email,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["workspaceInvites"] });

  const acceptMutation = useMutation({
    mutationFn: acceptInvitation,
    onSuccess: (data) => {
      invalidate();
      onAccepted?.(data.workspaceSlug);
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to accept invite. Please try again."));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: deleteInvitation,
    onSuccess: () => invalidate(),
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to decline invite. Please try again."));
    },
  });

  return {
    invites: data?.invitations ?? [],
    isLoading,
    isError,
    acceptMutation,
    rejectMutation,
  };
};

export const PendingInvitationsList = ({
  invites,
  onAccept,
  onReject,
  isBusy,
}: {
  invites: WorkspaceInvite[];
  onAccept: (invite: WorkspaceInvite) => void;
  onReject: (invite: WorkspaceInvite) => void;
  isBusy: boolean;
}) => (
  <div className="space-y-3">
    {invites.map((invite) => (
      <div
        key={invite.id}
        className="rounded-lg border p-3 flex items-start justify-between"
      >
        <div className="space-y-1">
          <p className="font-medium">{invite.Workspace.workspaceName}</p>
          <p className="text-xs text-muted-foreground">Role: {invite.role}</p>
          <p className="text-xs text-muted-foreground">
            Invited by {invite.User.username}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            disabled={isBusy}
            onClick={() => onAccept(invite)}
          >
            <Check className="h-4 w-4 text-green-600" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            disabled={isBusy}
            onClick={() => onReject(invite)}
          >
            <X className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </div>
    ))}
  </div>
);

// Inline banner presentation for /onboarding: only renders once invites are
// known to exist, so it stays invisible (no layout shift) for users with no
// pending invites.
const PendingInvitationsPanel = ({
  onAccepted,
}: {
  onAccepted?: (workspaceSlug?: string) => void;
}) => {
  const { invites, isLoading, acceptMutation, rejectMutation } =
    usePendingInvitations(onAccepted);

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto mb-6 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    );
  }

  if (invites.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mb-6 p-4 rounded-2xl border space-y-3">
      <div className="flex items-center gap-2">
        <Mails className="h-4 w-4" />
        <h2 className="font-medium">
          You have {invites.length === 1 ? "a pending invite" : "pending invites"}
        </h2>
      </div>
      <PendingInvitationsList
        invites={invites}
        isBusy={acceptMutation.isPending || rejectMutation.isPending}
        onAccept={(invite) => acceptMutation.mutate({ token: invite.token })}
        onReject={(invite) => rejectMutation.mutate({ id: invite.id })}
      />
    </div>
  );
};

export default PendingInvitationsPanel;
