"use client";
import { useQuery } from "@tanstack/react-query";
import RecentActivityList from "./activities-list";
import { getAllRecentActivities } from "@/src/lib/api/recent-activities/services";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

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
    queryKey: ["recentActivities", userId, workspace?.id],
    queryFn: () =>
      getAllRecentActivities({
        userId: userId!,
        workspaceId: workspace!.id, // assert workspace is not null
      }),
    enabled: !!userId && !!workspace?.id,
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
        {isLoading && <p className="text-sm text-gray-400">Loading...</p>}
        {isError && <p className="text-sm text-red-400">Failed to load activities</p>}
        {data?.data.map((item) => (
  <RecentActivityList
    key={item.id}
    name={item.title}
    type={item.type}
    updatedAt={item.updatedAt}
    editor={item.editor}
  />
))}
      </div>
    </div>
  );
};

export default RecentActivities;
