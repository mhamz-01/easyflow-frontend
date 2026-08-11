export const docsKeys = {
  all: (workspaceId: number, projectId: number) => [
    "docs",
    workspaceId,
    projectId,
  ],
  single: (id: number) => ["doc", id],
  access: (id: number) => ["doc", id, "access"],
};
