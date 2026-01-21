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
import { useMutation, useQuery } from "@tanstack/react-query";
import { Spinner } from "@/src/components/shadcn/spinner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const workspaceSchema = z.object({
  workspaceName: z
    .string()
    .min(2, "Workspace name must be at least 2 characters"),
});

type WorkspaceSchema = z.infer<typeof workspaceSchema>;

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
      router.push(data.workspace.workspaceSlug);
      localStorage.setItem("workspaceSlug", data.workspace.workspaceSlug);
      if (!data.success) {
        form.setError("workspaceName", { message: data.message });
      }
    },
  });

  // Check if the user already has a workspace
  const { data: workspaceCheck } = useQuery({
    queryKey: ["checkUserWorkspace"],
    queryFn: checkUserWorkspace,
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

  // otherwise show him the loading state
  return (
    <div className="w-full flex justify-center items-center h-screen">
      <Spinner />
    </div>
  );
};

export default Onboarding;
