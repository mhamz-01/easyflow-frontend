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
    <div className="border-t-2 mt-5 pt-5">
      <div>
        <h1 className="text-h1">Recent</h1>
        {/* dropdwon */}
      </div>
      {/* list of recent activities */}
      <div>
        {dummyData.map((item) => (
          <RecentActivityList key={item.name} name={item.name} />
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
