export type sidebarProjectType = {
  id: number;
  name: string;
  workspaceId: number;
  type?: "public" | "private";
};

export type ProjectMemberStatus = "active" | "removed";

export type ProjectMember = {
  id: number;
  projectId: number;
  userId: number;
  status: ProjectMemberStatus;
  removedAt: string | null;
  createdAt: string;
  user: {
    id: number;
    username: string;
    email: string;
    imageUrl?: string | null;
  };
  removedByUser?: { id: number; username: string } | null;
  invitedByUser?: { id: number; username: string } | null;
};

export type ProjectMembersResponse = {
  success: boolean;
  members: ProjectMember[];
};
