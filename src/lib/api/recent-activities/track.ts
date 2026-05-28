import { createRecentActivity } from "./services";

interface TrackActivityParams {
  workspaceId: number;
  userId: string;
  title: string;
  type: "DOC" | "WHITEBOARD" | "TASK";
  typeID: number;
  projectID: number;
  lastEditedBy: string;
}

export const trackActivity = async (params: TrackActivityParams) => {
  try {
    await createRecentActivity(params);
  } catch (err) {
    console.error("Failed to track activity", err); // silent fail, don't block UX
  }
};