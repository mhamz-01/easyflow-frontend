export const getCurrentProjectId = (): number => {
  if (typeof window === "undefined") {
    throw new Error("getCurrentProjectId() requires a browser environment");
  }

  const segments = window.location.pathname.split("/").filter(Boolean);
  const rawProjectId = segments[1]; // [0] = workspace_name, [1] = project_id
  const projectId = Number(rawProjectId);

  if (!rawProjectId || Number.isNaN(projectId)) {
    throw new Error(
      `Could not resolve current project id from URL "${window.location.pathname}"`,
    );
  }

  return projectId;
};
