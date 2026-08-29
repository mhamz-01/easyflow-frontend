"use client";

import { History, Loader2 } from "lucide-react";
import RecentActivityList from "../../_recent-activities/activities-list";
import { GetAllRecentActivitiesResponse } from "@/src/lib/api/recent-activities/services";
import Panel from "./panel";

const ActivityPreview = ({
  basePath,
  activities,
  isLoading,
}: {
  basePath: string;
  activities: GetAllRecentActivitiesResponse["data"];
  isLoading: boolean;
}) => {
  return (
    <Panel
      icon={<History className="size-4" />}
      title="Recent activity"
      href={`${basePath}/tasks`}
      hrefLabel="Open project"
    >
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-10">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-4 py-10 text-center">
          <History className="size-6 text-gray-600" />
          <p className="text-sm font-medium text-gray-400">No activity yet</p>
          <p className="text-xs text-gray-600">Task, doc, and whiteboard updates show up here.</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.06] px-4">
          {activities.map((item) => (
            <RecentActivityList
              key={item.id}
              name={item.title}
              type={item.type}
              updatedAt={item.updatedAt}
              editor={item.editor}
              projectName={null}
            />
          ))}
        </div>
      )}
    </Panel>
  );
};

export default ActivityPreview;
