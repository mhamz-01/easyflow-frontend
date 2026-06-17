"use client";
import { useQuery } from "@tanstack/react-query";
import RecentActivityList from "./activities-list";
import { getAllRecentActivities } from "@/src/lib/api/recent-activities/services";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { History } from "lucide-react";

const dummyData = [
  {
    name: "easyflow user stories",

    type: "DOC",
  },
  {
    name: "Database schema",
    type: "TASK",
  },
  {
    name: "Easyflow Project Outlines",

    type: "WHITEBOARD",
  },
  {
    name: "Todo list",

    type: "TASK",
  },
  {
    name: "Gather requirements",
    type: "WHITEBOARD",
  },
];
const RecentActivities = () => {
  const { userId } = useAuth();
  const workspace = useWorkspaceStore((s) => s.workspace);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["recentActivities", workspace?.id],
    queryFn: () => getAllRecentActivities({ workspaceId: workspace!.id }),
    enabled: !!workspace?.id,
  });

  useEffect(() => {
    console.log("Data", data);
  }, [data]);

  return (
    <div className="border-t-2 mt-5 pt-5 px-5">
      <div>
        <h1 className="text-h1">Recent</h1>
      </div>
      <div>
        {isLoading && (
          <div className="flex flex-col gap-3 mt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3 animate-pulse">
                <div className="w-9 h-9 rounded bg-[#3c3c3c]" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="h-3 w-1/3 rounded bg-[#3c3c3c]" />
                  <div className="h-2.5 w-1/2 rounded bg-[#3c3c3c]" />
                </div>
              </div>
            ))}
          </div>
        )}
  
        {isError && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <p className="text-sm text-red-400">Failed to load recent activity</p>
            <p className="text-xs text-gray-500">Please refresh the page</p>
          </div>
        )}
  
        {data?.data.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-20 text-center">
            <History className="text-gray-600 w-8 h-8" />
            <p className="text-sm font-medium text-gray-400">No recent activity yet</p>
            <p className="text-xs text-gray-600">Actions like creating tasks, docs, or whiteboards will appear here</p>
          </div>
        )}
  
        {!isLoading && !isError && data?.data.map((item) => (
          <RecentActivityList
            key={item.id}
            name={item.title}
            type={item.type}
            updatedAt={item.updatedAt}
            editor={item.editor}
            projectName={item.projectName}
          />
        ))}
      </div>
    </div>
  );

}
export default RecentActivities;
