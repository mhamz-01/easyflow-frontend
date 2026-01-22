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
import { useUIStore } from "@/src/store/useUIStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoc } from "@/src/lib/api/documents/services";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useProjectStore } from "@/src/store/useProjectStore";
import { docsListResponse } from "@/src/types/documents";
interface Doc {
  id: number;
  documentName: string;
}

const DocsList = ({ docsListData }: { docsListData: Doc[] }) => {
  const router = useRouter();
  const { modals, openModal, closeModal } = useUIStore();
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);
  const projectId = useProjectStore((s) => s.project?.id);
  const deleteDocMutation = useMutation({
    mutationFn: deleteDoc,
    onSuccess: (data) => {
      // remove data from the current list
      console.log("workspace id roject is", workspaceId, projectId);
      queryClient.setQueryData(
        ["docs", workspaceId, projectId],
        (oldData: Partial<docsListResponse>) => {
          console.log("fetched data", data);
          console.log("old data", oldData);
          const updatedData = oldData.docs?.filter(
            (doc) => doc.id !== Number(data.id),
          );
          console.log("updated data", updatedData);
          return {
            ...oldData,
            docs: updatedData,
          };
        },
      );
      // show toast message
      toast.success("Document deleted!");

      //close alert dialog
      closeModal("isDeleteDocModalOpen");
    },
  });
  return (
    <div className="space-y-4">
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
              {/* creator avatar */}
              <Avatar width={24} height={24} />

              {/* separator */}
              <span className="h-5 w-px bg-border" />

              {/* actions */}
              <button className="p-1 hover:bg-muted rounded">
                <Info className="h-4 w-4" />
              </button>

              <button className="p-1 hover:bg-muted rounded">
                <Pin className="h-4 w-4" />
              </button>
              <AlertDialog
                open={modals.isDeleteDocModalOpen}
                onOpenChange={(isOpen) => {
                  if (isOpen) {
                    openModal("isDeleteDocModalOpen");
                  } else {
                    closeModal("isDeleteDocModalOpen");
                  }
                }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-muted rounded">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => router.push(`docs/${doc.id}`)}
                    >
                      <Edit />
                      Edit
                    </DropdownMenuItem>
                    <AlertDialogTrigger
                      asChild
                      onClick={() => openModal("isDeleteDocModalOpen")}
                    >
                      <DropdownMenuItem className="text-red-600 dark:hover:text-red-600">
                        <Trash color="red" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContentModal
                  body="Delete this Document"
                  loader={false}
                  onContinue={() => deleteDocMutation.mutate({ id: doc.id })}
                />
              </AlertDialog>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocsList;
