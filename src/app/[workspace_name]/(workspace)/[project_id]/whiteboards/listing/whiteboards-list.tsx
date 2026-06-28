"use client";
import Image from "next/image";
import whiteboardIcon from "@/public/icons/whiteboard.svg";
import { MoreVertical, Edit, Trash, Loader2 } from "lucide-react";
import Avatar from "@/src/components/custom/avatar";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/shadcn/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@/src/components/shadcn/alert-dialog";
import AlertDialogContentModal from "@/src/components/modals/alert-dialog-content";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWhiteboard } from "@/src/lib/api/whiteboards/services";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useProjectStore } from "@/src/store/useProjectStore";
import { Whiteboard, whiteboardsListResponse } from "@/src/types/whiteboard";
import { useState } from "react";

const WhiteboardsList = ({ whiteboardsListData }: { whiteboardsListData: Whiteboard[] }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);
  const projectId = useProjectStore((s) => s.project?.id);

  const [navigatingId, setNavigatingId] = useState<number | null>(null);
  const [selectedWhiteboardId, setSelectedWhiteboardId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleNavigate = (id: number) => {
    setNavigatingId(id);
    router.push(`whiteboards/${String(id)}`);
  };

  const deleteWhiteboardMutation = useMutation({
    // Accept workspaceId + projectId in variables so onSuccess always has fresh values
    mutationFn: ({ id }: { id: number; workspaceId: number; projectId: number }) =>
      deleteWhiteboard({ id }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["whiteboards", variables.workspaceId, variables.projectId],
        (oldData: Partial<whiteboardsListResponse>) => ({
          ...oldData,
          whiteboards: oldData.whiteboards?.filter(
            (whiteboard) => whiteboard.id !== Number(data.id),
          ),
        }),
      );
      toast.success("Whiteboard deleted!");
      setIsDeleteModalOpen(false);
      setSelectedWhiteboardId(null);
    },
  });

  return (
    <div className="space-y-4">
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ul className="space-y-2">
          {whiteboardsListData.map((whiteboard: Whiteboard) => (
            <li
              key={whiteboard.id}
              className={`flex items-center justify-between rounded-md border px-4 py-3 transition-opacity ${navigatingId === whiteboard.id ? "opacity-60" : ""}`}
            >
              {/* LEFT: whiteboard icon + name */}
              <div
                onClick={() => handleNavigate(whiteboard.id)}
                className="flex items-center gap-3 cursor-pointer"
              >
                {navigatingId === whiteboard.id ? (
                  <Loader2 className="h-[18px] w-[18px] animate-spin text-muted-foreground shrink-0" />
                ) : (
                  <Image src={whiteboardIcon} alt="whiteboard icon" width={18} height={18} />
                )}
                <span className="font-medium capitalize">{whiteboard.whiteboardName}</span>
              </div>

              {/* RIGHT: creator + separator + actions */}
              <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
  <div
    title={whiteboard.creator?.username}
    className="relative z-10 rounded-full border-2 border-background"
  >
    <Avatar src={whiteboard.creator?.imageUrl} width={24} height={24} />
  </div>
  {whiteboard.assignees?.map((assignee) => (
    <div
      key={assignee.id}
      title={assignee.username}
      className="rounded-full border-2 border-background"
    >
      <Avatar src={assignee.imageUrl} width={24} height={24} />
    </div>
  ))}
</div>
                <span className="h-5 w-px bg-border" />

                {/* <button className="p-1 hover:bg-muted rounded">
                  <Info className="h-4 w-4" />
                </button>
                <button className="p-1 hover:bg-muted rounded">
                  <Pin className="h-4 w-4" />
                </button> */}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-muted rounded">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleNavigate(whiteboard.id)}>
                      <Edit />
                      Edit
                    </DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-red-600 dark:hover:text-red-600"
                        onClick={() => {
                          setSelectedWhiteboardId(whiteboard.id);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash color="red" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          ))}
        </ul>

        <AlertDialogContentModal
          body="Delete this Whiteboard"
          loader={deleteWhiteboardMutation.isPending}
          onContinue={() => {
            if (selectedWhiteboardId !== null && workspaceId && projectId) {
              deleteWhiteboardMutation.mutate({
                id: selectedWhiteboardId,
                workspaceId,  // passed at call time, guaranteed fresh
                projectId,
              });
            }
          }}
        />
      </AlertDialog>
    </div>
  );
};

export default WhiteboardsList;