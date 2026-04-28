"use client";

import { getSingleWhiteboard, updateWhiteboard } from "@/src/lib/api/whiteboards/services";
import { EasyflowWhiteboard } from "@mhamz.01/easyflow-whiteboard";
import { useMutation, useQuery } from "@tanstack/react-query";
import '@mhamz.01/easyflow-whiteboard/dist/styles.css'; 


const mocktasks = [
  {
    id: "task-1",
    title: "Design landasdasdasdding page mockups",
    status: "in-progress" as const,
    assignee: "Sarah Chen",
    project: "Website Redesign",
    priority: "high" as const,
    dueDate: "Feb 15",
  },
  {
    id: "task-2",
    title: "Implement user authentication",
    status: "todo" as const,
    assignee: "John Doe",
    project: "Backend API",
    priority: "high" as const,
    dueDate: "Feb 18",
  },
  {
    id: "task-3",
    title: "Write API documentation",
    status: "done" as const,
    assignee: "Mike Wilson",
    project: "Documentation",
    priority: "medium" as const ,
    dueDate: "Feb 10",
  },
  {
    id: "task-4",
    title: "Setup CI/CD pipeline",
    status: "todo" as const,
    assignee: "Alex Turner",
    project: "DevOps",
    priority: "low" as const,
    dueDate: "Feb 20",
  },
  {
    id: "task-5",
    title: "Database schema optimization",
    status: "todo" as const,
    assignee: "Emma Davis",
    project: "Backend API",
    priority: "medium" as const,
    dueDate: "Feb 22",
  },
  {
    id: "task-6",
    title: "Mobile responsive testing",
    status: "in-progress" as const,
    assignee: "Sarah Chen",
    project: "Website Redesign",
    priority: "high" as const,
    dueDate: "Feb 16",
  },
];


const MOCK_DB_DOCUMENTS = [
  {
    id: "db-doc-101",
    title: "Project Alpha Strategy",
    project: "EasyFlow Core",
    breadcrumb: ["Strategic", "Planning"],
    preview: "High-level overview of the 2026 roadmap and market positioning.",
    updatedAt: "Just now",
  },
  {
    id: "db-doc-102",
    title: "User Interview Insights",
    project: "Research",
    breadcrumb: ["Q1", "Feedback"],
    preview: "Analysis of 20 user sessions focusing on the node-syncing experience.",
    updatedAt: "15 mins ago",
  },
  {
    id: "db-doc-103",
    title: "Technical Architecture",
    project: "Engineering",
    breadcrumb: ["Docs", "System"],
    preview: "Deep dive into the Fabric.js and React overlay synchronization logic.",
    updatedAt: "2 hours ago",
  }
];


export default function WhiteboardEditor({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["whiteboard", id],
    queryFn: () => getSingleWhiteboard(Number(id)),
  });

  const mutation = useMutation({
    mutationFn: updateWhiteboard,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  if (isLoading) {
    return <div className="max-h-max rounded-xl bg-muted animate-pulse" />;
  }

  return (
    <div className="w-screen h-screen ">
      <EasyflowWhiteboard
        initialData={data?.whiteboard.content ?? { canvas: "", tasks: [], documents: [] }}
        onSave={(payload) => {
          mutation.mutate({
            id: Number(id),
            columnName: "content",
            value: payload,
          });
        }}
        saveDebounceMs={2000}
        // availableTasks={data?.whiteboard.availableTasks ?? []}
        // availableDocuments={data?.whiteboard.availableDocuments ?? []}
        availableDocuments={MOCK_DB_DOCUMENTS}
        availableTasks={mocktasks}
      />
    </div>
  );
}