"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { workspaceKeys } from "@/src/lib/api/workspace/keys";
import {
  deleteWorkspace,
  getSingleWorkspace,
  updateWorkspaceName,
} from "@/src/lib/api/workspace/services";
import { useWorkspaceStore } from "@/src/store/workspace";
import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import { Skeleton } from "@/src/components/shadcn/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/shadcn/card";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/shadcn/alert-dialog";
import { Spinner } from "@/src/components/shadcn/spinner";
import { useRouter } from "next/navigation";

const GeneralSettings = () => {
  const router = useRouter();
  const { workspace, setWorkspace } = useWorkspaceStore();
  const queryClient = useQueryClient();

  // Fetch workspace
  const { data, isLoading } = useQuery({
    queryKey: workspaceKeys.detail(workspace?.workspaceSlug!),
    queryFn: () => getSingleWorkspace(workspace?.workspaceSlug ?? ""),
    enabled: Boolean(workspace?.workspaceSlug),
  });

  const [isEditing, setIsEditing] = useState(false); // state for toggling edit mode
  const [workspaceName, setWorkspaceName] = useState(""); // state for storing input value

  // Mutation to update workspace
  const updateMutation = useMutation({
    mutationFn: (newName: string) =>
      updateWorkspaceName(workspace?.workspaceSlug!, newName),
    // to the following after successfull update
    onSuccess: (updated) => {
      // destructure values
      const {
        workspaceSlug: newWorkspaceSlug,
        workspaceName: newWorkspaceName,
      } = updated.data;
      // set editing to false
      setIsEditing(false);

      // set workspaceName to the new workspaceName
      setWorkspaceName(newWorkspaceName);
      // show a toast to the user
      toast.success("Workspace name updated successfully");

      // assign workspace data to workspace object in global state
      setWorkspace(updated.data);

      // set the new workspaceSlug in localStorage
      localStorage.setItem("workspaceSlug", newWorkspaceSlug);

      // change URL to the new workspaceSlug
      router.replace(`/${newWorkspaceSlug}/settings/general?tab=workspace`);
      queryClient.setQueryData(workspaceKeys.detail(newWorkspaceSlug!), {
        data: updated,
      });
    },
    // if updation is not successfull show error  to the user
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    },
  });

  // delete workspace logic
  const deleteMutation = useMutation({
    // call 'deleteWorkspace' function
    mutationFn: () => deleteWorkspace(workspace?.workspaceSlug!),
    // after successfull deletion of workspace do the following
    onSuccess: () => {
      // show toast to the user
      toast.success("Workspace deleted successfully");

      // remove workspaceSlug from local Storage
      localStorage.removeItem("workspaceSlug");

      // push user back to the home gate (routes to another workspace, or onboarding)
      router.push("/home");
    },
    // if deletion is not successfull show error to the user
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const handleSaveChanges = () => {
    // remove whitespace from begining and end
    if (workspaceName.trim() !== "") {
      // if workspaneName is not empty string then run mutation function
      updateMutation.mutate(workspaceName.trim());
    }
  };

  // Implement delete logic
  const handleDelete = () => {
    deleteMutation.mutate();
  };

  // while loading, show loading skeleton
  if (isLoading) {
    return (
      <Card className="mt-5">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <span>{data?.workspace?.workspaceName || workspaceName}</span>
              <button
                onClick={() => {
                  // set isEditing to true
                  setIsEditing(true);
                  // set workspaceName
                  setWorkspaceName(data?.workspace?.workspaceName);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="max-w-sm"
            />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {isEditing && (
          <Button
            onClick={handleSaveChanges}
            variant="primary"
            className="w-fit"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        )}

        <div className="pt-6 border-t">
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Workspace
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your workapce.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  {deleteMutation.isPending ? <Spinner /> : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
