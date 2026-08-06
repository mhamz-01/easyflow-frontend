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

  export type WorkspaceInvite = {
    id: number;
    email: string;
    role: string;
    token: string;
    workspaceId: number;
    createdAt: string;
    User: {
      username: string;
    };
    Workspace: {
      workspaceName: string;
    };
  };

  export type WorkspaceMembers = {
    id: number;
    role: string;
    User: {
      id: number;
      imageUrl?: string;
      createdAt: string;
      email: string;
      username: string;
    };
  };

  export type WorkspaceInvitesResponse = {
    success: boolean;
    invites: WorkspaceInvite[];
  };

  export type workspaceMembersResponse = {
    success: boolean;
    members: WorkspaceMembers[];
  };

  export interface AcceptInvitationPayload {
    token: string; // or number if you use number IDs
  }

  export interface AcceptInvitationResponse {
    success: boolean;
    message: string;
    workspaceSlug?: string; // returned workspace slug if accepted, for redirecting
    alreadyMember?: boolean;
  }

  export interface deleteInvitationResponse {
    success: boolean;
    message: string;
    invitationId: number;
  }

  export interface UserWorkspaceInvitesResponse {
    success: boolean;
    invitations: WorkspaceInvite[];
  }
