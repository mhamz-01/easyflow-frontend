// Type for data returned when a new workspace is created
export type NewWorkspaceCreated = {
  success: boolean;
  message: string;
  workspace: {
    workspaceName: string;
    workspaceSlug: string;
    admin: string;
  };
};

// type for workspace item in modals components
export type workspaceItemProps = {
  id: number;
  workspaceName: string;
  workspaceSlug: string;
  members: [] | null;
  admin: string;
  isSelected: boolean;
};
