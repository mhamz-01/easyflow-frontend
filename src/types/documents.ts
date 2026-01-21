import { JSONContent } from "@tiptap/react";
export type Doc = {
  id: number;
  documentName: string;
};
export type singleDoc = {
  documentName: string;
  id: number;
  createdBy: number;
  assignees: null | [string];
  createdDate: Date;
  content: null | JSONContent;
  isPrivate: boolean;
  projectId: number;
  workspaceId: number;
  updatedAt: Date;
  lastEdited: Date;
};

export type singleDocResponse = {
  success: boolean;
  document: singleDoc;
};
export type docsListResponse = {
  success: boolean;
  docs: {
    id: number;
    documentName: string;
  }[];
};
