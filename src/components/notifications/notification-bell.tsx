"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, BellOff, CalendarClock, RefreshCcw, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/shadcn/dropdown-menu";
import Avatar from "@/src/components/custom/avatar";
import { cn } from "@/src/lib/utils";
import { useWorkspaceStore } from "@/src/store/workspace";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsList,
  useNotificationsUnread,
} from "@/src/hooks/use-notifications";
import TaskPreviewModal from "@/src/app/[workspace_name]/(workspace)/chat/_components/preview-modals/task-preview-modal";
import type { AppNotification, NotificationType } from "@/src/types/notifications";

const TYPE_ICON: Record<NotificationType, typeof UserPlus> = {
  TASK_ASSIGNED: UserPlus,
  TASK_STATUS_CHANGED: RefreshCcw,
  TASK_DUE_CHANGED: CalendarClock,
};

const NotificationBell = () => {
  const workspace = useWorkspaceStore((s) => s.workspace);
  const [open, setOpen] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<{
    taskId: number;
    projectId: number;
    title: string;
  } | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: unreadCount = 0 } = useNotificationsUnread(workspace?.id);
  const { data, isLoading, isError } = useNotificationsList(workspace?.id);
  const markRead = useMarkNotificationRead(workspace?.id);
  const markAllRead = useMarkAllNotificationsRead(workspace?.id);

  const notifications = data?.pages.flatMap((page) => page.notifications) ?? [];
  const badgeLabel = unreadCount > 9 ? "9+" : String(unreadCount);

  const handleSelect = (notification: AppNotification) => {
    if (!notification.isRead) markRead.mutate(notification.id);
    if (notification.taskId != null && notification.projectId != null) {
      setPreviewTarget({
        taskId: notification.taskId,
        projectId: notification.projectId,
        title: notification.title,
      });
      setPreviewOpen(true);
      setOpen(false);
    }
  };

  return (
    <>
      {/* modal=false: Radix's default (true) locks scroll on everything
          outside the menu while it's open, same as a dialog — wrong for a
          lightweight bell dropdown, which should leave the page scrollable. */}
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex size-8 items-center justify-center rounded-full hover:bg-accent transition-colors"
          >
            <Bell className="size-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium leading-none text-white">
                {badgeLabel}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={10} className="w-80 p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold">Notifications</h2>
            <button
              type="button"
              disabled={unreadCount === 0 || markAllRead.isPending}
              onClick={() => markAllRead.mutate()}
              className="text-xs font-medium text-primary-blue hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="flex flex-col gap-3 p-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 animate-pulse">
                    <div className="size-8 rounded-full bg-muted shrink-0" />
                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="h-3 w-2/3 rounded bg-muted" />
                      <div className="h-2.5 w-1/2 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isError && (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <p className="text-sm text-red-400">Failed to load notifications</p>
                <p className="text-xs text-gray-500">Please try again</p>
              </div>
            )}

            {!isLoading && !isError && notifications.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-14 text-center px-6">
                <BellOff className="text-gray-600 size-8" />
                <p className="text-sm font-medium text-gray-400">No notifications yet</p>
                <p className="text-xs text-gray-600">
                  Task assignments and updates will show up here.
                </p>
              </div>
            )}

            {!isLoading &&
              !isError &&
              notifications.map((notification) => {
                const Icon = TYPE_ICON[notification.type];
                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleSelect(notification)}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent",
                      !notification.isRead && "bg-primary-blue/5",
                    )}
                  >
                    <div className="relative shrink-0">
                      <Avatar src={notification.actor?.imageUrl ?? undefined} width={32} height={32} />
                      <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-background border border-border">
                        <Icon className="size-2.5 text-muted-foreground" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">{notification.body}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="mt-1.5 size-2 rounded-full bg-primary-blue shrink-0" />
                    )}
                  </button>
                );
              })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {previewTarget && (
        <TaskPreviewModal
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          taskId={previewTarget.taskId}
          projectId={previewTarget.projectId}
          fallbackTitle={previewTarget.title}
        />
      )}
    </>
  );
};

export default NotificationBell;
