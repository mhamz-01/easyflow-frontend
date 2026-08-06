"use client";

import { ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/src/components/shadcn/button";
import { AcceptInvitationPayload } from "@/src/types/workspace";
import {
  acceptInvitation,
  deleteInvitation,
} from "@/src/lib/api/workspace/invites/services";
import { toast } from "sonner";
import { Spinner } from "@/src/components/shadcn/spinner";
import { storePendingInviteReturn } from "@/src/lib/pending-invite";
import {
  getApiErrorMessage,
  getApiErrorStatus,
} from "@/src/lib/api/client";
import { shouldRetryTransient, READY_CHECK_RETRY_DELAY } from "@/src/lib/api/retry";

const Card = ({ children }: { children: ReactNode }) => (
  <div className="max-w-md mx-auto mt-20 p-6 rounded-md border shadow-sm space-y-6">
    {children}
  </div>
);

export default function AcceptInvitation() {
  const params = useParams<{ token: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();

  const token = params.token;

  // Decorative only — the redirect target on success comes from the API
  // response, not these params, so a missing/mangled one never blocks the flow.
  const workspaceName = searchParams.get("workspaceName");
  const inviterName = searchParams.get("invitedBy");
  const role = searchParams.get("role");

  const acceptMutation = useMutation({
    mutationFn: (payload: AcceptInvitationPayload) => acceptInvitation(payload),
    // A user who just signed up because of this exact invite will very
    // likely race the Clerk-webhook-driven local account provisioning —
    // retry transient failures instead of surfacing them as a hard error.
    retry: shouldRetryTransient,
    retryDelay: (attempt) => READY_CHECK_RETRY_DELAY(attempt),
    onSuccess: (data) => {
      if (data.success) {
        toast("Invitation accepted", {
          description: data.alreadyMember
            ? "You're already a member of this workspace."
            : "You joined the workspace successfully!",
        });
        router.push(data.workspaceSlug ? `/${data.workspaceSlug}` : "/home");
      } else {
        toast("Failed", { description: data.message });
      }
    },
    onError: (err: unknown) => {
      toast("Error", { description: getApiErrorMessage(err, "Something went wrong") });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: deleteInvitation,
    retry: shouldRetryTransient,
    retryDelay: (attempt) => READY_CHECK_RETRY_DELAY(attempt),
    onSuccess: () => {
      toast("Invitation declined");
      router.push("/");
    },
    onError: (err: unknown) => {
      toast("Error", { description: getApiErrorMessage(err, "Something went wrong") });
    },
  });

  if (!token) {
    return (
      <Card>
        <h1 className="text-xl font-semibold">Invalid invite link</h1>
        <p className="text-sm text-muted-foreground">
          This invite link looks incomplete. Ask whoever invited you to send a
          new one.
        </p>
      </Card>
    );
  }

  if (!authLoaded) {
    return (
      <div className="flex justify-center mt-20">
        <Spinner className="size-6" />
      </div>
    );
  }

  const invitePreview = (
    <p>
      You&apos;ve been invited to join{" "}
      <strong>{workspaceName || "a workspace"}</strong>
      {inviterName ? (
        <>
          {" "}
          by <strong>{inviterName}</strong>
        </>
      ) : null}
      {role ? (
        <>
          {" "}
          as a <strong>{role}</strong>
        </>
      ) : null}
      .
    </p>
  );

  if (!isSignedIn) {
    const currentUrl =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : `/accept-invitation/${token}`;

    const goTo = (path: "sign-up" | "sign-in") => {
      storePendingInviteReturn(currentUrl);
      router.push(`/${path}?redirect_url=${encodeURIComponent(currentUrl)}`);
    };

    return (
      <Card>
        <h1 className="text-xl font-semibold">You&apos;re invited</h1>
        {invitePreview}
        <p className="text-sm text-muted-foreground">
          Sign up or log in to accept this invite.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => goTo("sign-in")}>
            Log in
          </Button>
          <Button variant="primary" onClick={() => goTo("sign-up")}>
            Sign up to accept
          </Button>
        </div>
      </Card>
    );
  }

  // Signed in — surface friendly copy for the known failure modes instead of
  // a raw toast-only error.
  const acceptError = acceptMutation.error;
  const acceptErrorStatus = acceptError ? getApiErrorStatus(acceptError) : undefined;
  if (acceptError && acceptErrorStatus !== undefined) {
    const messages: Record<number, string> = {
      404: "This invite doesn't exist anymore. Ask for a new one.",
      400: "This invite has expired. Ask for a new one.",
      403: getApiErrorMessage(acceptError, "This invite was sent to a different email address."),
      409: "This invite has already been used.",
    };
    const message = messages[acceptErrorStatus];
    if (message) {
      return (
        <Card>
          <h1 className="text-xl font-semibold">Can&apos;t accept this invite</h1>
          <p className="text-sm text-muted-foreground">{message}</p>
        </Card>
      );
    }
  }

  return (
    <Card>
      <h1 className="text-xl font-semibold">Accept Invitation</h1>
      {invitePreview}
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
          isLoading={acceptMutation.isPending}
          onClick={() => acceptMutation.mutate({ token })}
        >
          Accept
        </Button>
      </div>
    </Card>
  );
}
