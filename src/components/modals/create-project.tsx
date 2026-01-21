"use client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/shadcn/dialog";
import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import { Label } from "@/src/components/shadcn/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { createProject } from "@/src/lib/api/project/services";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../shadcn/spinner";
import { useUIStore } from "@/src/store/useUIStore";
import { useEffect } from "react";

// Zod schema
const createProjectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
});

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

const CreateProjectModal: React.FC = () => {
  // states
  const { workspace } = useWorkspaceStore();
  const { closeModal, modals } = useUIStore();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    resetField,
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", workspace?.workspaceSlug],
      });
      closeModal("isCreateProjectModalOpen");
      resetField("name");
    },
  });

  const onSubmit = async (data: CreateProjectFormValues) => {
    if (workspace?.id && workspace.admin) {
      // Pass a single object
      mutate({
        projectName: data.name,
        workspaceId: workspace.id,
        admin: workspace.admin,
      });
    }
  };

  // clear input when model closes
  useEffect(() => {
    resetField("name");
  }, [modals]);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create Project</DialogTitle>
        <DialogDescription>
          Enter a project name below to create a new project.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div className="flex flex-col">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            className="mt-3"
            placeholder="Enter project name"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <DialogClose>
            <Button
              type="button"
              variant="outline"
              size={"sm"}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isSubmitting}
            size={"sm"}
            variant={"primary"}
          >
            {isPending ? <Spinner /> : "Create Project"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default CreateProjectModal;
