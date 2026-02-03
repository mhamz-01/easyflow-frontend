import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/dialog";
import { Button } from "../../shadcn/button";
import { Mails, Check, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  acceptInvitation,
  deleteInvitation,
  getUserWorkspaceInvitesByEmail,
} from "@/src/lib/api/workspace/invites/services";
import { useWorkspaceStore } from "@/src/store/workspace";
import { Skeleton } from "../../shadcn/skeleton";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const WorkspaceInvitationButton = () => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);
  const { user } = useUser();
  // 📥 Fetch invitations
  const {
    data: invitesData,
    isLoading: isInvitesLoading,
    isError: isInvitesError,
  } = useQuery({
    queryKey: ["workspaceInvites", workspaceId],
    queryFn: () =>
      getUserWorkspaceInvitesByEmail({
        email: user?.primaryEmailAddress?.emailAddress!,
      }),
    enabled: !!user?.primaryEmailAddress?.emailAddress,
  });

  // ✅ Accept
  const acceptMutation = useMutation({
    mutationFn: acceptInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaceInvites", workspaceId],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data.message ||
          "Failed to send invite. Please try again.",
      );
    },
  });

  // ❌ Reject
  const rejectMutation = useMutation({
    mutationFn: deleteInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaceInvites", workspaceId],
      });
    },
  });

  const invites = invitesData?.invitations ?? [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Mails className="h-4 w-4" />
          Workspace Invitations
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Workspace Invitations</DialogTitle>
        </DialogHeader>

        {/* 🔄 Loading skeleton */}
        {isInvitesLoading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-lg border p-3 flex justify-between"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-28" />
                </div>

                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ❌ Error state */}
        {isInvitesError && !isInvitesLoading && (
          <p className="text-sm text-destructive">
            Failed to load invitations.
          </p>
        )}

        {/* 📭 Empty state */}
        {!isInvitesLoading && !isInvitesError && invites?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You don’t have any pending invitations.
          </p>
        )}

        {/* 📩 Invitations list */}
        {!isInvitesLoading && !isInvitesError && (
          <div className="space-y-3">
            {invites?.map((invite) => (
              <div
                key={invite.id}
                className="rounded-lg border p-3 flex items-start justify-between"
              >
                <div className="space-y-1">
                  <p className="font-medium">
                    {invite.Workspace.workspaceName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Role: {invite.role}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Invited by {invite.User.username}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={
                      acceptMutation.isPending || rejectMutation.isPending
                    }
                    onClick={() =>
                      acceptMutation.mutate({ token: invite.token })
                    }
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={
                      acceptMutation.isPending || rejectMutation.isPending
                    }
                    onClick={() => rejectMutation.mutate({ id: invite.id })}
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkspaceInvitationButton;
