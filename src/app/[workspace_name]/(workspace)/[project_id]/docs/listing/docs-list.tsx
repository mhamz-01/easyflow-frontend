"use client";
import Image from "next/image";
import docsIcon from "@/public/icons/docs.svg";
import { Info, Pin, MoreVertical, Edit, Trash } from "lucide-react";
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
import { deleteDoc } from "@/src/lib/api/documents/services";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useProjectStore } from "@/src/store/useProjectStore";
import { docsListResponse, Doc } from "@/src/types/documents";
import { useState } from "react";

const DocsList = ({ docsListData }: { docsListData: Doc[] }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);
  const projectId = useProjectStore((s) => s.project?.id);

  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteDocMutation = useMutation({
    // Accept workspaceId + projectId in variables so onSuccess always has fresh values
    mutationFn: ({ id }: { id: number; workspaceId: number; projectId: number }) =>
      deleteDoc({ id }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["docs", variables.workspaceId, variables.projectId],
        (oldData: Partial<docsListResponse>) => ({
          ...oldData,
          docs: oldData.docs?.filter((doc) => doc.id !== Number(data.id)),
        }),
      );
      toast.success("Document deleted!");
      setIsDeleteModalOpen(false);
      setSelectedDocId(null);
    },
  });

  return (
    <div className="space-y-4">
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ul className="space-y-2">
          {docsListData.map((doc: Doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between rounded-md border px-4 py-3"
            >
              {/* LEFT: doc icon + name */}
              <div
                onClick={() => router.push(`docs/${String(doc.id)}`)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Image src={docsIcon} alt="docs icon" width={18} height={18} />
                <span className="font-medium capitalize">{doc.documentName}</span>
              </div>

              {/* RIGHT: creator + separator + actions */}
              <div className="flex items-center gap-3">
                <Avatar width={24} height={24} />
                <span className="h-5 w-px bg-border" />

                <button className="p-1 hover:bg-muted rounded">
                  <Info className="h-4 w-4" />
                </button>
                <button className="p-1 hover:bg-muted rounded">
                  <Pin className="h-4 w-4" />
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-muted rounded">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => router.push(`docs/${doc.id}`)}>
                      <Edit />
                      Edit
                    </DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-red-600 dark:hover:text-red-600"
                        onClick={() => {
                          setSelectedDocId(doc.id);
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
          body="Delete this Document"
          loader={deleteDocMutation.isPending}
          onContinue={() => {
            if (selectedDocId !== null && workspaceId && projectId) {
              deleteDocMutation.mutate({
                id: selectedDocId,
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

export default DocsList;