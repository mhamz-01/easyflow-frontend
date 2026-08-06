import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/dialog";
import { Button } from "../../shadcn/button";
import { Mails } from "lucide-react";
import { Skeleton } from "../../shadcn/skeleton";
import {
  usePendingInvitations,
  PendingInvitationsList,
} from "@/src/components/workspace/pending-invitations-panel";

const WorkspaceInvitationButton = () => {
  const { invites, isLoading, isError, acceptMutation, rejectMutation } =
    usePendingInvitations();

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
        {isLoading && (
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
        {isError && !isLoading && (
          <p className="text-sm text-destructive">
            Failed to load invitations.
          </p>
        )}

        {/* 📭 Empty state */}
        {!isLoading && !isError && invites.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You don’t have any pending invitations.
          </p>
        )}

        {/* 📩 Invitations list */}
        {!isLoading && !isError && invites.length > 0 && (
          <PendingInvitationsList
            invites={invites}
            isBusy={acceptMutation.isPending || rejectMutation.isPending}
            onAccept={(invite) => acceptMutation.mutate({ token: invite.token })}
            onReject={(invite) => rejectMutation.mutate({ id: invite.id })}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkspaceInvitationButton;
