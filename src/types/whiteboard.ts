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
      projectId: number;
      workspaceId: number;
      updatedAt: Date;
      lastEdited: Date;
  }
  
  export type singleWhiteboardResponse = {
      success: boolean;
      whiteboard: singleWhiteboard;
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