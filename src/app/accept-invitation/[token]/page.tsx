"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/components/shadcn/button";
import { AcceptInvitationPayload } from "@/src/types/workspace";
import {
  acceptInvitation,
  deleteInvitation,
} from "@/src/lib/api/workspace/invites/services";
import { toast } from "sonner";
import { Spinner } from "@/src/components/shadcn/spinner";
import { useWorkspaceStore } from "@/src/store/workspace";

export default function AcceptInvitation() {
  const params = useParams<{ token: string }>();
  const workspace = useWorkspaceStore((s) => s.workspace);
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const token = params.token;

  const workspaceName = searchParams.get("workspaceName");
  const inviterName = searchParams.get("invitedBy");
  const role = searchParams.get("role");

  const mutation = useMutation({
    mutationFn: (payload: AcceptInvitationPayload) => acceptInvitation(payload),
    onSuccess: (data) => {
      if (data.success) {
        toast("Invitation Accepted", {
          description: "You joined the workspace successfully!",
        });
        router.push(`/${data.workspaceId}`);
      } else {
        toast("Failed", {
          description: data.message,
        });
      }
    },
    onError: (err: any) => {
      toast("Error", {
        description: err.message || "Something went wrong",
      });
    },
  });

  // ❌ Reject
  const rejectMutation = useMutation({
    mutationFn: deleteInvitation,
    onSuccess: () => {
      router.push(`/${workspace?.workspaceSlug}`);
    },
  });

  // Guard: URL incomplete
  if (!token || !workspaceName || !inviterName || !role) {
    return (
      <div className="flex justify-center text-center p-4">
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 rounded-md border shadow-sm space-y-6">
      <h1 className="text-xl font-semibold">Accept Invitation</h1>

      <p>
        You have been invited to join <strong>{workspaceName}</strong> by{" "}
        <strong>{inviterName}</strong> as a <strong>{role}</strong>.
      </p>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          isLoading={rejectMutation.isPending}
          onClick={() => rejectMutation.mutate({ token })}
        >
          Decline
        </Button>

        <Button
          variant="primary"
          isLoading={mutation.isPending}
          onClick={() => mutation.mutate({ token })}
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
