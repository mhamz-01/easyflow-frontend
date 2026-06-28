"use client";

import { getSingleWhiteboard, updateWhiteboard } from "@/src/lib/api/whiteboards/services";
import { getAllDocs } from "@/src/lib/api/documents/services";
import { taskService } from "@/src/lib/api/tasks/service";
import { EasyflowWhiteboard } from "@mhamz.01/easyflow-whiteboard";
import type { TaskNodeData, DocumentNodeData } from "@mhamz.01/easyflow-whiteboard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import '@mhamz.01/easyflow-whiteboard/dist/styles.css';
import { useParams } from "next/navigation";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useProjectStore } from "@/src/store/useProjectStore";

export default function WhiteboardEditor({ id }: { id: string }) {
  const { workspace_name, project_id } = useParams<{ workspace_name: string; project_id: string }>();
  const workspace = useWorkspaceStore((s) => s.workspace);
  const project = useProjectStore((s) => s.project);
  const queryClient = useQueryClient(); // ✅

  // ── Fetch whiteboard ──────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["whiteboard", id],
    queryFn: () => getSingleWhiteboard(Number(id)),
    staleTime: 0,         // ✅ always refetch
    refetchOnMount: true, // ✅ refetch every time component mounts
  });

  // ── Fetch docs ────────────────────────────────────────────────────
  const { data: docsData } = useQuery({
    queryKey: ["docs", workspace?.id, project?.id],
    queryFn: () =>
      getAllDocs({ workspaceId: workspace!.id, projectId: project!.id }),
    enabled: !!workspace?.id && !!project?.id,
    staleTime: 1000 * 60,
  });

  // ── Fetch tasks ───────────────────────────────────────────────────
  const { data: tasksData } = useQuery({
    queryKey: ["tasks", "project", project?.id],
    queryFn: () => taskService.getTasksByProject(project!.id),
    enabled: !!project?.id,
    staleTime: 1000 * 60,
  });

  // ── Mutation ──────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: updateWhiteboard,
    onSuccess: () => {
      // ✅ bust cache so next mount always fetches fresh
      queryClient.invalidateQueries({ queryKey: ["whiteboard", id] });
      console.log("✅ Whiteboard saved");
    },
    onError: (err) => {
      console.error("❌ Whiteboard save failed:", err);
    },
  });

  // ── Transform docs → DocumentNodeData ────────────────────────────
  const availableDocuments: DocumentNodeData[] =
    docsData?.docs.map((doc) => ({
      id: String(doc.id),
      type: "document" as const,
      title: doc.documentName,
      project: project?.projectName ?? "",
      breadcrumb: [project?.projectName ?? ""],
      preview: doc.preview,
      updatedAt: doc.createdDate
        ? new Date(doc.createdDate).toLocaleDateString()
        : "",
      x: 0,
      y: 0,
    })) ?? [];

  // ── Transform tasks → TaskNodeData ───────────────────────────────
  const availableTasks: TaskNodeData[] =
    tasksData?.tasks.map((task) => ({
      id: String(task.id),
      type: "task" as const,
      title: task.name,
      status: (task.state === "in progress"
        ? "in-progress"
        : task.state) as TaskNodeData["status"],
      assignee: task.assignees?.[0]?.username ?? "",
      project: project?.projectName ?? "",
      priority: task.priority as TaskNodeData["priority"],
      dueDate: task.dueDate
        ? new Date(task.dueDate).toLocaleDateString()
        : "",
      x: 0,
      y: 0,
    })) ?? [];

  if (isLoading) {
    return <div className="max-h-max rounded-xl bg-muted animate-pulse" />;
  }

  return (
    <div className="w-screen h-screen">
      <EasyflowWhiteboard
        initialData={data?.whiteboard.content ?? {
          canvas: "",
          tasks: [],
          documents: [],
        }}
        onSave={(payload) => {
          mutation.mutate({
            id: Number(id),
            columnName: "content",
            value: payload,
          });
        }}
        saveDebounceMs={2000}
        availableDocuments={availableDocuments}
        availableTasks={availableTasks}
        createNewTaskHref={`/${workspace_name}/${project_id}/tasks`}
        createNewDocumentHref={`/${workspace_name}/${project_id}/docs`}
      />
    </div>
  );
}