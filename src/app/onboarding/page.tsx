"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/src/components/shadcn/form";
import { Input } from "@/src/components/shadcn/input";
import { Button } from "@/src/components/shadcn/button";
import {
  checkUserWorkspace,
  createWorkspace,
} from "@/src/lib/api/workspace/services";
import { getApiErrorStatus } from "@/src/lib/api/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Spinner } from "@/src/components/shadcn/spinner";
import GlobalLoader from "@/src/components/custom/global-loader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const workspaceSchema = z.object({
  workspaceName: z
    .string()
    .min(2, "Workspace name must be at least 2 characters"),
});

type WorkspaceSchema = z.infer<typeof workspaceSchema>;

// Right after OAuth sign-up, Clerk's session exists on the client before
// our backend has necessarily finished mirroring the user via webhook (see
// clerkWebHook), and the session cookie itself can lag a beat behind the
// redirect. So 404 ("account not provisioned yet"), 401 (cookie not yet
// readable) and network/5xx hiccups are all worth retrying with backoff —
// but capped, so a genuine failure surfaces instead of spinning forever.
const READY_CHECK_MAX_RETRIES = 8; // ~ up to ~30s of backoff below
const READY_CHECK_RETRY_DELAY = (attempt: number) =>
  Math.min(1000 * 2 ** attempt, 5000);

const isTransientStatus = (status: number | undefined) =>
  status === undefined || status === 401 || status === 404 || status >= 500;

const PROVISIONING_MESSAGES = [
  "Setting up your account…",
  "Almost there…",
  "Still working on it — hang tight…",
  "This is taking longer than usual…",
];

const Onboarding = () => {
  // hooks
  const router = useRouter();

  // react hook form
  const form = useForm<WorkspaceSchema>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      workspaceName: "",
    },
  });

  // useMutation for creating workspace
  const { mutate, isPending } = useMutation({
    mutationFn: createWorkspace,
    onSuccess: (data) => {
      if (!data.success) {
        form.setError("workspaceName", { message: data.message });
        return;
      }
      localStorage.setItem("workspaceSlug", data.workspace.workspaceSlug);
      router.push(`/${data.workspace.workspaceSlug}`);
    },
    onError: (error) => {
      toast.error("Couldn't create your workspace", {
        description: error.message,
      });
    },
  });

  // Check if the user already has a workspace. A 404 means the backend
  // hasn't finished provisioning the account yet, so we keep retrying —
  // any other error (network, 500, etc.) fails fast instead of spinning.
  const {
    data: workspaceCheck,
    isError,
    error,
    failureCount,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["checkUserWorkspace"],
    queryFn: checkUserWorkspace,
    retry: (attempts, err) =>
      isTransientStatus(getApiErrorStatus(err)) &&
      attempts < READY_CHECK_MAX_RETRIES,
    retryDelay: (attempt) => READY_CHECK_RETRY_DELAY(attempt),
  });

  // redirect if workspace exists
  useEffect(() => {
    if (workspaceCheck?.hasWorkspace) {
      router.replace(`/${workspaceCheck.workspaceSlug}`);
    }
  }, [workspaceCheck, router]);

  const onSubmit = async (values: WorkspaceSchema) => {
    mutate(values.workspaceName);
  };

  // Account provisioning failed (or never finished within the retry
  // budget) — show a real error with a retry action instead of leaving the
  // loader spinning forever with no feedback.
  if (isError) {
    const stillProvisioning = isTransientStatus(getApiErrorStatus(error));
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background px-6">
        <div className="w-full max-w-md rounded-xl border border-destructive/40 p-6 text-center space-y-3">
          <h1 className="text-lg font-semibold">
            {stillProvisioning
              ? "Setting up your account is taking longer than expected"
              : "We couldn't reach EasyFlow"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {stillProvisioning
              ? "This can happen right after signing up. Try again in a moment — if it keeps happening, please contact support."
              : error?.message ||
                "Something went wrong while checking your account. Please try again."}
          </p>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            {isRefetching ? <Spinner className="size-4" /> : "Try again"}
          </Button>
        </div>
      </div>
    );
  }

  // only show the UI if user don't have a workspace yet!
  if (workspaceCheck && !workspaceCheck.hasWorkspace) {
    return (
      <div className="w-full max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Welcome to EasyFlow 👋
        </h1>
        <p className="text-center mb-8">
          Let’s set up your workspace to get things running smoothly.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Workspace Name */}
            <FormField
              control={form.control}
              name="workspaceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your workspace name"
                      {...field}
                      className="focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-primary-blue text-white hover:bg-primary-blue cursor-pointer"
            >
              {isPending ? <Spinner /> : "Continue"}
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  // otherwise show him the loading state, narrating progress once we've
  // been waiting past the first attempt so it reads as "working" rather
  // than a stuck spinner
  const messageIndex = Math.min(failureCount, PROVISIONING_MESSAGES.length - 1);
  return (
    <GlobalLoader
      message={failureCount > 0 ? PROVISIONING_MESSAGES[messageIndex] : undefined}
    />
  );
};

export default Onboarding;
