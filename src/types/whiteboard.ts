// ─── Internal Content Structures ─────────────────────────────────────────────

export interface WhiteboardTask {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done"; // ✅ was: string
  assignee: string;
  project: string;
  priority: "low" | "medium" | "high";     // ✅ was: string
  dueDate: string;
  x: number;
  y: number;
}
export type UserSummary = {
  id: number;
  username: string;
  imageUrl?: string;
};
  
export interface WhiteboardDocument {
  id: string;
  title: string;
  project: string;
  breadcrumb: string[];
  preview: string;
  updatedAt: string;
  x: number;
  y: number;
}
  
  /**
   * Based on your payload, this is what lives inside 'content'
   */
  export interface WhiteboardContent {
    canvas: string;
    tasks: WhiteboardTask[];
    documents: WhiteboardDocument[];
  }
  // ────────────────────────────────────────────
  
  export type Whiteboard = {
    id: number;
    whiteboardName: string;
    isPrivate: boolean;
    defaultAccess: "view" | "edit";
    assignees?: UserSummary[];
    creator?: UserSummary;
    createdBy: number;
    createdDate: string;
  };

  export type singleWhiteboard = {
      whiteboardName: string;
      id: number;
      createdBy: number;
      assignees: number[] | null;
      createdDate: Date;
      content: WhiteboardContent;
      isPrivate: boolean;
      defaultAccess: "view" | "edit";
      projectId: number;
      workspaceId: number;
      updatedAt: Date;
      lastEdited: Date;
  }

  // Effective access level the requesting user has on this whiteboard —
  // always "edit" for private whiteboards (untouched by this feature).
  export type WhiteboardAccessLevel = "view" | "edit";

  export type singleWhiteboardResponse = {
      success: boolean;
      whiteboard: singleWhiteboard;
      access: WhiteboardAccessLevel;
  }

  export type whiteboardsListResponse = {
      success: boolean;
      // whiteboards: {
      //     id: number;
      //     whiteboardName: string;
      // }[];
      whiteboards:Whiteboard[];
  }

  export type createdWhiteboardResponse = {
    message: string;
    createdDoc: singleWhiteboard;
  };

  // A per-user access override on a public whiteboard, as returned by
  // GET /whiteboards/:id/access.
  export type WhiteboardAccessEntry = {
    id: number;
    userId: number;
    accessLevel: "view" | "edit" | "none";
    grantedBy: number | null;
    user?: UserSummary;
  };

  export type whiteboardAccessListResponse = {
    success: boolean;
    grants: WhiteboardAccessEntry[];
  };

  export type grantWhiteboardAccessResponse = {
    success: boolean;
    grant: WhiteboardAccessEntry;
  };

  export type setWhiteboardDefaultAccessResponse = {
    success: boolean;
    whiteboard: singleWhiteboard;
  };