"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/shadcn/dialog";
import { Button } from "@/src/components/shadcn/button";
import { Checkbox } from "@/src/components/shadcn/checkbox";
import { Label } from "@/src/components/shadcn/label";
import { Spinner } from "../shadcn/spinner";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkspaceMembers } from "@/src/lib/api/workspace/members/services";
import { assignDoc } from "@/src/lib/api/documents/services";
import { useState } from "react";
import { toast } from "sonner";
import Avatar from "../custom/avatar";

interface ShareDocModalProps {
  docId: number;
  documentName: string;
  existingAssignees: number[];
  onClose: () => void;
}

const ShareDocModal = ({
  docId,
  documentName,
  existingAssignees,
  onClose,
}: ShareDocModalProps) => {
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: membersData, isLoading } = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => getWorkspaceMembers({ workspaceId: workspaceId! }),
    enabled: !!workspaceId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => assignDoc({ docId, memberIds: selectedIds }),
    onSuccess: () => {
      toast.success("Document shared successfully");
      queryClient.invalidateQueries({ queryKey: ["docs"] });
      onClose();
    },
    onError: () => toast.error("Failed to share document"),
  });

  const handleToggle = (memberId: number) => {
    setSelectedIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const isAlreadyAssigned = (id: number) => existingAssignees.includes(id);

  return (
    // ✅ controlled width — max-w-sm on mobile, md on larger screens
    <DialogContent className="w-full max-w-sm sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Share Document</DialogTitle>
        <DialogDescription>
          Assign workspace members to{" "}
          <span className="font-medium">"{documentName}"</span>. They'll
          receive an email notification.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 space-y-1 max-h-64 overflow-y-auto pr-1">
        {isLoading && (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        )}
        {membersData?.members.map((member) => {
          const already = isAlreadyAssigned(member.User.id);
          return (
            <div
              key={member.User.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                already
                  ? "opacity-50"
                  : "hover:bg-muted cursor-pointer"
              }`}
              onClick={() => !already && handleToggle(member.User.id)}
            >
              <Checkbox
                checked={already || selectedIds.includes(member.User.id)}
                disabled={already}
                onCheckedChange={() =>
                  !already && handleToggle(member.User.id)
                }
              />
              <Avatar width={28} height={28} />
              <div className="flex flex-col min-w-0">
                <Label className="cursor-pointer font-medium truncate">
                  {member.User.username}
                </Label>
                <span className="text-xs text-muted-foreground truncate">
                  {member.User.email}
                </span>
              </div>
              {already && (
                <span className="ml-auto text-xs text-muted-foreground shrink-0">
                  Already assigned
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          disabled={isPending || selectedIds.length === 0}
          onClick={() => mutate()}
        >
          {isPending ? (
            <Spinner />
          ) : (
            `Share with ${selectedIds.length || ""} member${
              selectedIds.length !== 1 ? "s" : ""
            }`
          )}
        </Button>
      </div>
    </DialogContent>
  );
};

export default ShareDocModal;