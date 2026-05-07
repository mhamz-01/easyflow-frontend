// tasks/types.ts
export type TaskState = "todo" | "in progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface ChecklistItem {
  name: string;
  items: string[];
}

interface Attachment {
  id: number;
  fileKey: string;
  originalName: string;
  mimeType: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  imageUrl?: string;
}

export interface Workspace {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
}

interface assignee {
  id: number;
  username: string;
  imageUrl: string;
}
export interface TaskViewList {
  id: number;
  name: string;
  assignees: assignee[];
  dueDate: string;
  priority: string;
  state: string;
}
export interface Task {
  id: number;
  workspaceId: number;
  projectId: number;
  name: string;
  description?: string | null;
  attachments: Attachment[];
  links: string[];
  state: string;
  priority: string;
  createdBy: number;
  startDate?: string | null;
  checklist?: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
  creator: User;
  assignees: User[];
  workspace: Workspace;
  project?: Project | null;
  dueDate: string;
}

export interface CreateTask {
  workspaceId: number;
  projectId: number;
  name: string;
  description?: string | null;
  attachments?: number[];
  links?: string[];
  state?: string;
  priority?: string;
  startDate?: string | null;
  checklist?: ChecklistItem[];
  assigneeIds?: number[];
}

export interface UpdateTaskPayload {
  name?: string;
  description?: string;
  state?: string;
  priority?: string;
  projectId?: number;
  dueDate?: Date;
  assigneeIds?: number[];
  checklist?: ChecklistItem[];
  links?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
