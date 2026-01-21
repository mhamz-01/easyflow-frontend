"use client";

import { Button } from "@/src/components/shadcn/button";
import { createDoc } from "@/src/lib/api/documents/services";
import { useProjectStore } from "@/src/store/useProjectStore";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const DocsListingEmptyState = () => {
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);
  const projectId = useProjectStore((s) => s.project?.id);
  const { userId } = useAuth();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: createDoc,
    onSuccess: (data) => {
      router.push(`docs/${data.createdDoc.id}`);
    },
  });

  const handleCreateDoc = () => {
    if (workspaceId && projectId && userId)
      mutation.mutate({ workspaceId, projectId, createdBy: userId });
  };

  return (
    <div className="p-6 border rounded-md space-y-1">
      <h1 className="text-h1 font-medium">No documents created yet.</h1>
      <p className="text-sm mb-4">
        Create your first document and share it with your team
      </p>
      <Button onClick={handleCreateDoc} variant={"primary"}>
        Create New Doc
      </Button>
    </div>
  );
};

export default DocsListingEmptyState;
