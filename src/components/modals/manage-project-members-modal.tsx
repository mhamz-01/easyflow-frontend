"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/shadcn/dialog";
import { Button } from "@/src/components/shadcn/button";
import { Spinner } from "@/src/components/shadcn/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/shadcn/select";
import Avatar from "../custom/avatar";
import DropdownSearchInput from "../dropdown-search-input";
import { useWorkspaceMembers } from "@/src/lib/api/workspace/members/hooks";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import { useWorkspaceStore } from "@/src/store/workspace";
import { updateProject } from "@/src/lib/api/project/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useProjectMembers,
  useAddProjectMember,
  useRemoveProjectMember,
} from "@/src/lib/api/project/members/hooks";
import { UserMinus, UserPlus } from "lucide-react";

interface ManageProjectMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  projectName: string;
  projectType: "public" | "private";
}

const ManageProjectMembersModal = ({
  open,
  onOpenChange,
  projectId,
  projectName,
  projectType,
}: ManageProjectMembersModalProps) => {
  const workspace = useWorkspaceStore((s) => s.workspace);
  const workspaceId = workspace?.id;
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: workspaceMembersData, isLoading: workspaceMembersLoading } =
    useWorkspaceMembers(workspaceId);
  const { data: projectMembersData, isLoading: projectMembersLoading } =
    useProjectMembers(projectId);
  const { data: currentUser } = useCurrentUser();

  const addMutation = useAddProjectMember(projectId);
  const removeMutation = useRemoveProjectMember(projectId);

  const typeMutation = useMutation({
    mutationFn: (type: "public" | "private") => updateProject({ projectId, type }),
    onSuccess: () => {
      // Same cache entry the sidebar/overview page reads project.type from.
      queryClient.invalidateQueries({ queryKey: ["projects", workspace?.workspaceSlug] });
    },
    onError: () => toast.error("Failed to update project visibility"),
  });

  const activeMemberIds = useMemo(
    () =>
      new Set(
        (projectMembersData?.members ?? [])
          .filter((m) => m.status === "active")
          .map((m) => m.userId),
      ),
    [projectMembersData],
  );

  // The admin managing membership never needs to see themself in this list —
  // they already have full access to every project regardless of
  // PrivateProjectMembers (admin bypass), so an Add/Remove row for their own
  // account would be meaningless.
  const candidates = useMemo(
    () =>
      (workspaceMembersData?.members ?? []).filter(
        (m) =>
          m.User.id !== currentUser?.id &&
          m.User.username?.toLowerCase().includes(search.toLowerCase()),
      ),
    [workspaceMembersData, search, currentUser],
  );

  const isLoading = workspaceMembersLoading || projectMembersLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Project members</DialogTitle>
          <DialogDescription>
            Choose who can see and work in{" "}
            <span className="font-medium">&quot;{projectName}&quot;</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-2 rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">Visibility</p>
            <p className="text-xs text-muted-foreground">
              {projectType === "private"
                ? "Only added members can see this project."
                : "Everyone in the workspace can see this project."}
            </p>
          </div>
          <Select
            value={projectType}
            onValueChange={(value: "public" | "private") => typeMutation.mutate(value)}
            disabled={typeMutation.isPending}
          >
            <SelectTrigger size="sm" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {projectType !== "private" && (
          <p className="text-xs text-muted-foreground">
            Adding members below won&apos;t restrict access until this project is set to Private.
          </p>
        )}

        <DropdownSearchInput search={search} setSearch={setSearch} setIsOpen={() => {}} />

        <div className="mt-2 max-h-80 space-y-1 overflow-y-auto pr-1">
          {isLoading && (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          )}

          {!isLoading &&
            candidates.map((member) => {
              const isActive = activeMemberIds.has(member.User.id);

              return (
                <div
                  key={member.User.id}
                  className="flex items-center gap-3 rounded-lg p-2"
                >
                  <Avatar
                    src={member.User.imageUrl}
                    alt={member.User.username}
                    width={28}
                    height={28}
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">
                      {member.User.username}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {member.User.email}
                    </span>
                  </div>

                  {isActive ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-destructive hover:text-destructive"
                      disabled={removeMutation.isPending}
                      onClick={() => removeMutation.mutate(member.User.id)}
                    >
                      <UserMinus className="size-3.5" />
                      Remove
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      disabled={addMutation.isPending}
                      onClick={() => addMutation.mutate(member.User.id)}
                    >
                      <UserPlus className="size-3.5" />
                      Add
                    </Button>
                  )}
                </div>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageProjectMembersModal;
