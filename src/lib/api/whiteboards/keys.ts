export const whiteboardKeys = {
  all: (workspaceId: number , projectId: number) => [
    "whiteboards",
    workspaceId,
    projectId,
  ],
  single: (id: number) => ["whiteboard", id],
  access: (id: number) => ["whiteboard", id, "access"],
};
