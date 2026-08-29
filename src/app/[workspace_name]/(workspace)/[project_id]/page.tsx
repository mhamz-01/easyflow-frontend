"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SidebarTrigger } from "@/src/components/shadcn/sidebar";
import NotificationBell from "@/src/components/notifications/notification-bell";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useProjectStore } from "@/src/store/useProjectStore";
import { getProjectsByWorkspaceSlug } from "@/src/lib/api/project/services";
import { taskService } from "@/src/lib/api/tasks/service";
import { getAllDocs } from "@/src/lib/api/documents/services";
import { docsKeys } from "@/src/lib/api/documents/keys";
import { getAllWhiteboards } from "@/src/lib/api/whiteboards/services";
import { whiteboardKeys } from "@/src/lib/api/whiteboards/keys";
import { getAllRecentActivities } from "@/src/lib/api/recent-activities/services";
import { useChatMessages } from "@/src/hooks/chat";
import { useChatUnread, isChannelUnread } from "@/src/hooks/use-chat-unread";
import type { sidebarProjectType } from "@/src/types/project";

import { computeTaskAnalytics } from "./_overview/task-analytics";
import OverviewSkeleton from "./_overview/overview-skeleton";
import QuickLinks from "./_overview/quick-links";
import StatTile from "./_overview/stat-tile";
import TaskStatusMeter from "./_overview/task-status-meter";
import TasksPreview from "./_overview/tasks-preview";
import DocsPreview from "./_overview/docs-preview";
import WhiteboardsPreview from "./_overview/whiteboards-preview";
import ChatPreview from "./_overview/chat-preview";
import ActivityPreview from "./_overview/activity-preview";

const ProjectOverviewPage = () => {
  const params = useParams<{ workspace_name: string; project_id: string }>();
  const projectId = Number(params.project_id);

  const workspace = useWorkspaceStore((s) => s.workspace);
  const setProject = useProjectStore((s) => s.setProject);
  const workspaceId = workspace?.id;
  const workspaceSlug = workspace?.workspaceSlug;

  const basePath = `/${workspaceSlug}/${projectId}`;
  const chatHref = `/${workspaceSlug}/chat?channel=${projectId}`;

  // Same cache entry the sidebar populates -- resolves the project's name
  // without a dedicated single-project endpoint.
  const { data: projectsData } = useQuery({
    queryKey: ["projects", workspaceSlug],
    queryFn: () => getProjectsByWorkspaceSlug(workspaceSlug!),
    enabled: Boolean(workspaceSlug),
  });
  const project = (projectsData?.projects as sidebarProjectType[] | undefined)?.find(
    (p) => p.id === projectId,
  );

  useEffect(() => {
    if (project) {
      setProject({ id: project.id, projectName: project.name });
    }
  }, [project, setProject]);

  const { data: tasksData, isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks", "project", projectId],
    queryFn: () => taskService.getTasksByProject(projectId, { limit: 200 }),
    enabled: Boolean(projectId),
  });

  const { data: docsData, isLoading: isDocsLoading } = useQuery({
    queryKey: docsKeys.all(workspaceId ?? 0, projectId),
    queryFn: () => getAllDocs({ workspaceId: workspaceId!, projectId }),
    enabled: Boolean(workspaceId && projectId),
  });

  const { data: whiteboardsData, isLoading: isWhiteboardsLoading } = useQuery({
    queryKey: whiteboardKeys.all(workspaceId ?? 0, projectId),
    queryFn: () => getAllWhiteboards({ workspaceId: workspaceId!, projectId }),
    enabled: Boolean(workspaceId && projectId),
  });

  const { data: activitiesData, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ["recentActivities", workspaceId, projectId],
    queryFn: () => getAllRecentActivities({ workspaceId: workspaceId!, projectId, limit: 8 }),
    enabled: Boolean(workspaceId && projectId),
  });

  const {
    data: chatData,
    isLoading: isChatLoading,
  } = useChatMessages(workspaceId, projectId);
  const { data: unreadChannels } = useChatUnread(workspaceId);
  const chatMessages = chatData?.pages[0]?.messages ?? [];
  const isChatUnread = isChannelUnread(unreadChannels, projectId);

  const analytics = useMemo(
    () => computeTaskAnalytics(tasksData?.tasks ?? []),
    [tasksData],
  );

  const docs = docsData?.docs ?? [];
  const whiteboards = whiteboardsData?.whiteboards ?? [];

  const isInitialLoading =
    !workspace || (isTasksLoading && isDocsLoading && isWhiteboardsLoading);

  if (isInitialLoading) {
    return (
      <>
        <div className="mx-4 mt-4 flex items-center justify-between">
          <SidebarTrigger />
          <NotificationBell />
        </div>
        <OverviewSkeleton />
      </>
    );
  }

  return (
    <>
      <div className="mx-4 mt-4 flex items-center justify-between">
        <SidebarTrigger />
        <NotificationBell />
      </div>

      <div className="flex flex-col gap-5 px-4 pb-10 sm:px-6">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-primary-blue">
            Project overview
          </span>
          <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight">
            {project?.name ?? "Project"}
          </h1>
        </div>

        <QuickLinks basePath={basePath} chatHref={chatHref} chatUnread={isChatUnread} />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatTile label="Total tasks" value={analytics.total} isLoading={isTasksLoading} />
          <StatTile
            label="Completed"
            value={`${analytics.completionRate}%`}
            sub={`${analytics.counts.done} of ${analytics.total} done`}
            tone={analytics.completionRate === 100 && analytics.total > 0 ? "good" : "default"}
            isLoading={isTasksLoading}
          />
          <StatTile
            label="Overdue"
            value={analytics.overdueCount}
            tone={analytics.overdueCount > 0 ? "warning" : "good"}
            isLoading={isTasksLoading}
          />
          <StatTile label="Docs" value={docs.length} isLoading={isDocsLoading} />
          <StatTile label="Whiteboards" value={whiteboards.length} isLoading={isWhiteboardsLoading} />
        </div>

        {analytics.total > 0 && (
          <div className="rounded-2xl border border-white/[0.06] bg-[#1C1C1C] px-4 py-3.5">
            <TaskStatusMeter counts={analytics.counts} total={analytics.total} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <TasksPreview
            basePath={basePath}
            total={analytics.total}
            overdueCount={analytics.overdueCount}
            upcoming={analytics.upcoming}
            isLoading={isTasksLoading}
          />
          <DocsPreview basePath={basePath} docs={docs} isLoading={isDocsLoading} />
          <WhiteboardsPreview basePath={basePath} whiteboards={whiteboards} isLoading={isWhiteboardsLoading} />
          <ChatPreview
            chatHref={chatHref}
            messages={chatMessages}
            isLoading={isChatLoading}
            isUnread={isChatUnread}
          />
          <ActivityPreview
            basePath={basePath}
            activities={activitiesData?.data ?? []}
            isLoading={isActivitiesLoading}
          />
        </div>
      </div>
    </>
  );
};

export default ProjectOverviewPage;
