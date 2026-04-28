// ─── Internal Content Structures ─────────────────────────────────────────────

export interface WhiteboardTask {
    id: string;
    title: string;
    status: string;
    assignee: string;
    project: string;
    priority: string;
    dueDate: string;
    x: number;
    y: number;
  }
  
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
  }
  
  export type singleWhiteboard = {
      whiteboardName: string;
      id: number;
      createdBy: number;
      assignees: null | [string];
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
      whiteboards: {
          id: number;
          whiteboardName: string;
      }[];
  }
  
  export type createdWhiteboardResponse = {
    message: string;
    createdDoc: singleWhiteboard;
  };