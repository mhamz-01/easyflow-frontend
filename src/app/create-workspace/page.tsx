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

const page = () => {
  // hooks
  const router = useRouter();
  const form = useForm<WorkspaceSchema>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      workspaceName: "",
    },
  });

  // useMutation for creating workspace
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: createWorkspace,
    onSuccess: (data) => {
      router.push(data.workspace.workspaceSlug);
    },
  });

  const onSubmit = async (values: WorkspaceSchema) => {
    mutate(values.workspaceName);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-semibold text-center mb-2">
        Add a New Workspace
      </h1>
      <p className="text-center mb-8">
        Create a new workspace to organize your projects and collaborate
        seamlessly.
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
            {isPending && !isSuccess ? <Spinner /> : "Create Workspace"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default page;
