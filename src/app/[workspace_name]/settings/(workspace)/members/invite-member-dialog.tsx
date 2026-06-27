"use client";

import { Button } from "@/src/components/shadcn/button";
import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/shadcn/dialog";
import { Input } from "@/src/components/shadcn/input";
import { Label } from "@/src/components/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/shadcn/select";
import { sendInvite } from "@/src/lib/api/workspace/invites/services";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

export default function InviteMemberDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const workspace = useWorkspaceStore((s) => s.workspace);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [role, setRole] = useState("member");
  const queryClient = useQueryClient();

  // TanStack Mutation
  const inviteMutation = useMutation({
    mutationFn: async () => {
      if (!workspace?.id) throw new Error("Workspace not found");
      return sendInvite({
        workspaceId: workspace.id,
        email,
        role,
      });
    },
    onSuccess: () => {
      setEmail("");
      setEmailError("");
      setRole("member");
      onOpenChange(false); // close dialog on success
      // Optional: invalidate workspace members query if you have one
      if (workspace?.id) {
        queryClient.invalidateQueries({
          queryKey: ["workspaceInvites", workspace.id],
        });
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data.message ||
          "Failed to send invite. Please try again.",
      );
    },
  });

  const handleSendInvite = () => {
    const result = inviteSchema.safeParse({ email });
    if (!result.success) {
      setEmailError(result.error.issues[0].message);
      return;
    }
    setEmailError("");
    inviteMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              placeholder="user@example.com"
              type="email"
            />
            {emailError && (
              <p className="text-xs text-destructive">{emailError}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSendInvite}
            variant="primary"
            isLoading={inviteMutation.isPending}
            disabled={inviteMutation.isPending} // disable while sending
          >
            Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
