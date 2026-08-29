"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useNotificationsRealtime } from "@/src/hooks/use-notifications";
import TaskPreviewModal from "@/src/app/[workspace_name]/(workspace)/chat/_components/preview-modals/task-preview-modal";
import type { AppNotification } from "@/src/types/notifications";

type PreviewTarget = { taskId: number; projectId: number; title: string };

// Mounted once, workspace-wide (see (workspace)/layout.tsx) — this is what
// makes "someone assigns you a task while you're logged in" show an instant
// popup no matter which page you're currently on. The bell dropdown itself
// (notification-bell.tsx) only lives on the Home page; this listener is
// what's actually always-on. It renders nothing of its own beyond the
// toast and (on demand) the shared task preview dialog.
export function NotificationRealtimeListener() {
  const workspace = useWorkspaceStore((s) => s.workspace);
  const [previewTarget, setPreviewTarget] = useState<PreviewTarget | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useNotificationsRealtime(workspace?.id, (notification: AppNotification) => {
    const canPreview = notification.taskId != null && notification.projectId != null;

    toast(notification.title, {
      description: notification.body,
      icon: <Bell className="size-4" />,
      action: canPreview
        ? {
            label: "View",
            onClick: () => {
              setPreviewTarget({
                taskId: notification.taskId as number,
                projectId: notification.projectId as number,
                title: notification.title,
              });
              setPreviewOpen(true);
            },
          }
        : undefined,
    });
  });

  if (!previewTarget) return null;

  return (
    <TaskPreviewModal
      open={previewOpen}
      onOpenChange={setPreviewOpen}
      taskId={previewTarget.taskId}
      projectId={previewTarget.projectId}
      fallbackTitle={previewTarget.title}
    />
  );
}
