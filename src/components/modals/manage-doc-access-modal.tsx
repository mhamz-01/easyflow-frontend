"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/shadcn/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/shadcn/select";
import { Spinner } from "../shadcn/spinner";
import Avatar from "../custom/avatar";
import { useWorkspaceMembers, ADMIN_ROLES } from "@/src/lib/api/workspace/members/hooks";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDocAccessList,
  grantDocAccess,
  revokeDocAccess,
  setDefaultAccess,
} from "@/src/lib/api/documents/services";
import { docsKeys } from "@/src/lib/api/documents/keys";
import { singleDocResponse } from "@/src/types/documents";
import { toast } from "sonner";

// "default" isn't a real accessLevel on the backend — selecting it just
// means "no per-user override", i.e. revoke any existing grant so the
// document's own defaultAccess applies.
type SelectableLevel = "default" | "view" | "edit" | "none";

interface ManageDocAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  docId: number;
  documentName: string;
  defaultAccess: "view" | "edit";
  canEditDefaultAccess: boolean;
  // The doc's creator always gets edit access to their own doc, same as
  // admin/owner — the backend ignores any override/default for them, so
  // their row is shown as locked rather than offering a select that would
  // silently do nothing.
  createdBy: number;
}

const ManageDocAccessModal = ({
  open,
  onOpenChange,
  docId,
  documentName,
  defaultAccess,
  canEditDefaultAccess,
  createdBy,
}: ManageDocAccessModalProps) => {
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);
  const queryClient = useQueryClient();

  const { data: membersData, isLoading: membersLoading } =
    useWorkspaceMembers(workspaceId);

  const { data: accessData, isLoading: accessLoading } = useQuery({
    queryKey: docsKeys.access(docId),
    queryFn: () => getDocAccessList(docId),
    enabled: open && !!docId,
  });

  const grantMutation = useMutation({
    mutationFn: grantDocAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: docsKeys.access(docId) });
    },
    onError: () => toast.error("Failed to update access"),
  });

  const revokeMutation = useMutation({
    mutationFn: revokeDocAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: docsKeys.access(docId) });
    },
    onError: () => toast.error("Failed to update access"),
  });

  const defaultAccessMutation = useMutation({
    mutationFn: setDefaultAccess,
    onSuccess: (data) => {
      queryClient.setQueryData(docsKeys.single(docId), (old?: singleDocResponse) =>
        old ? { ...old, document: { ...old.document, defaultAccess: data.document.defaultAccess } } : old,
      );
      toast.success("Default access updated");
    },
    onError: () => toast.error("Failed to update default access"),
  });

  const grantsByUserId = new Map(
    (accessData?.grants ?? []).map((grant) => [grant.userId, grant]),
  );

  const handleLevelChange = (userId: number, level: SelectableLevel) => {
    if (level === "default") {
      revokeMutation.mutate({ docId, userId });
    } else {
      grantMutation.mutate({ docId, userId, accessLevel: level });
    }
  };

  const isLoading = membersLoading || accessLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Access</DialogTitle>
          <DialogDescription>
            Control who can view or edit{" "}
            <span className="font-medium">&quot;{documentName}&quot;</span>.
          </DialogDescription>
        </DialogHeader>

        {canEditDefaultAccess && (
          <div className="flex items-center justify-between gap-2 rounded-lg border p-3 mt-2">
            <div>
              <p className="text-sm font-medium">Default access</p>
              <p className="text-xs text-muted-foreground">
                Applies to members without an individual override.
              </p>
            </div>
            <Select
              value={defaultAccess}
              onValueChange={(value: "view" | "edit") =>
                defaultAccessMutation.mutate({ docId, defaultAccess: value })
              }
              disabled={defaultAccessMutation.isPending}
            >
              <SelectTrigger size="sm" className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="edit">Open for all</SelectItem>
                <SelectItem value="view">View only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="mt-4 space-y-1 max-h-72 overflow-y-auto pr-1">
          {isLoading && (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          )}
          {membersData?.members.map((member) => {
            const isAdminOrOwner = ADMIN_ROLES.includes(member.role);
            const isCreator = member.User.id === createdBy;
            const grant = grantsByUserId.get(member.User.id);
            const value: SelectableLevel = grant?.accessLevel ?? "default";

            return (
              <div
                key={member.User.id}
                className="flex items-center gap-3 p-2 rounded-lg"
              >
                <Avatar width={28} height={28} />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium truncate">
                    {member.User.username}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {member.User.email}
                  </span>
                </div>
                {isAdminOrOwner ? (
                  <span className="text-xs text-muted-foreground shrink-0">
                    Admin — always edit
                  </span>
                ) : (
                  <Select
                    value={value}
                    onValueChange={(v: SelectableLevel) =>
                      handleLevelChange(member.User.id, v)
                    }
                    disabled={grantMutation.isPending || revokeMutation.isPending}
                  >
                    <SelectTrigger size="sm" className="w-36 shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {/* For the creator, "no override" resolves to edit (their own
                          doc), not the document default — label reflects that. */}
                      <SelectItem value="default">
                        {isCreator ? "Default (edit — creator)" : "Default"}
                      </SelectItem>
                      <SelectItem value="view">View</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                      <SelectItem value="none">No access</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageDocAccessModal;
