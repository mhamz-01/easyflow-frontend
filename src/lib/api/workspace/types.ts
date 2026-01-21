// Workspace Types

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface CreateWorkspaceInput {
  workspaceName: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string;
}
