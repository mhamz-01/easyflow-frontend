export const workspaceKeys = {
  all: ["workspace"] as const,

  list: () => [...workspaceKeys.all, "list"] as const,

  detail: (slug: string) => [...workspaceKeys.all, "detail", slug] as const,
};
