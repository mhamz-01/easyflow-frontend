"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/shadcn/avatar";
import { Badge } from "@/src/components/shadcn/badge";
import { Button } from "@/src/components/shadcn/button";
import { Table, TableCell } from "@/src/components/shadcn/table";
import { Input } from "@/src/components/shadcn/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/shadcn/dropdown-menu";
import { Filter, Search } from "lucide-react";
import { useState } from "react";
import InviteMemberDialog from "./invite-member-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/shadcn/select";
import { formatDate } from "@/src/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWorkspaceMembers } from "@/src/lib/api/workspace/members/services";
import {
  deleteInvitation,
  getPendingWorkspaceInvites,
} from "@/src/lib/api/workspace/invites/services";
import { useWorkspaceStore } from "@/src/store/workspace";
import { DataTableSkeleton } from "./data-table-skeleton";
import { QueryError } from "./query-error";
import DataTableHeader from "./data-table-header";
import DataTableBody from "./data-table-body";
import { WorkspaceInvitesResponse } from "@/src/types/workspace";

export default function WorkspaceMembersPage() {
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);
  const [inviteOpen, setInviteOpen] = useState(false);
  const queryClient = useQueryClient();

  /* ================= MEMBERS (PRIMARY QUERY) ================= */
  const {
    data: membersData,
    isLoading: isMembersLoading,
    isError: isMembersError,
    error: membersError,
    refetch: refetchMembers,
  } = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => getWorkspaceMembers({ workspaceId: workspaceId! }),
    enabled: !!workspaceId,
  });

  /* ================= INVITES (DEPENDENT QUERY) ================= */
  const {
    data: invitesData,
    isLoading: isInvitesLoading,
    isError: isInvitesError,
    refetch: refetchInvites,
  } = useQuery({
    queryKey: ["workspaceInvites", workspaceId],
    queryFn: () => getPendingWorkspaceInvites({ workspaceId: workspaceId! }),
    enabled: !!workspaceId && !!membersData,
  });

  // handle deleting an invitation
  const mutateInvites = useMutation({
    mutationFn: deleteInvitation,
    onSuccess: (data) => {
      // remove deleted invitatino
      queryClient.setQueryData(
        ["workspaceInvites", workspaceId],
        (oldData: WorkspaceInvitesResponse) => {
          const updatedData = oldData.invites.filter(
            (invite) => invite.id !== data.invitationId,
          );
          return updatedData;
        },
      );
    },
  });

  if (isMembersError) {
    return (
      <QueryError
        message={(membersError as Error)?.message}
        onRetry={refetchMembers}
      />
    );
  }

  const members = membersData?.members ?? [];
  const invites = invitesData?.invites ?? [];
  const hasPendingInvites = (invitesData?.invites?.length ?? 0) > 0;
  const hasMembers = (membersData?.members?.length ?? 0) > 0;

  return (
    <div className="space-y-8 mt-5">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Members</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search members..." className="pl-8 w-64" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Owners</DropdownMenuItem>
              <DropdownMenuItem>Admins</DropdownMenuItem>
              <DropdownMenuItem>Members</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="primary" onClick={() => setInviteOpen(true)}>
            Invite members
          </Button>
        </div>
      </div>

      {/* ================= MEMBERS TABLE ================= */}

      {isMembersLoading ? (
        <DataTableSkeleton />
      ) : hasMembers ? (
        <div className="rounded-xl border">
          <Table>
            <DataTableHeader
              columns={[
                { key: "user", label: "User" },
                { key: "email", label: "Email" },
                { key: "role", label: "Role" },
                { key: "joined", label: "Joined on" },
                { key: "actions", label: "Actions", align: "right" },
              ]}
            />
            <DataTableBody
              data={members}
              getRowKey={(member) => member.id}
              renderRow={(member) => (
                <>
                  {/* Full name */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.User.imageUrl} />
                        <AvatarFallback>
                          {member.User.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {member.User.username}
                      </span>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="text-muted-foreground">
                    {member.User.email}
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    {member.role === "owner" ? (
                      <Badge variant="primary">owner</Badge>
                    ) : (
                      <Select defaultValue={member.role}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>

                  {/* Joined date */}
                  <TableCell className="text-muted-foreground">
                    {formatDate(member.User.createdAt)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    {member.role !== "owner" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive p-0"
                      >
                        Remove
                      </Button>
                    )}
                  </TableCell>
                </>
              )}
            />
          </Table>
        </div>
      ) : (
        <div>No members yet</div>
      )}

      {/* ================= INVITES ================= */}
      {isInvitesLoading && <DataTableSkeleton />}

      {isInvitesError && <QueryError onRetry={refetchInvites} />}

      {hasPendingInvites && !isInvitesLoading && !isInvitesError && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Pending invitations</h2>

          <div className="rounded-xl border">
            <Table>
              <DataTableHeader
                columns={[
                  {
                    key: "email",
                    label: "Email",
                  },
                  {
                    key: "role",
                    label: "Role",
                  },
                  {
                    key: "invited-on",
                    label: "Invited On",
                  },
                  {
                    key: "actions",
                    label: "Actions",
                    align: "right",
                  },
                ]}
              />
              <DataTableBody
                data={invites}
                getRowKey={(invite) => invite.id}
                renderRow={(invite) => (
                  <>
                    <TableCell>{invite.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{invite.role}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(invite.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => mutateInvites.mutate({ id: invite.id })}
                        isLoading={mutateInvites.isPending}
                        variant="ghost"
                        size="sm"
                        className="text-destructive p-0"
                      >
                        Revoke
                      </Button>
                    </TableCell>
                  </>
                )}
              />
            </Table>
          </div>
        </div>
      )}

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}
