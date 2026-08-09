// Shared React Query keys for the resources the chat share flow reads —
// used by both the attachment picker and the message attachment cards so
// picking an item and then seeing it rendered never double-fetches.

export const docsListKey = (workspaceId: number | null | undefined, projectId: number) =>
  ["docs", workspaceId, projectId] as const;

export const whiteboardsListKey = (workspaceId: number | null | undefined, projectId: number) =>
  ["whiteboards", workspaceId, projectId] as const;

export const tasksSummaryKey = (projectId: number) =>
  ["tasks", "project", projectId, "summary"] as const;
