import { JSONContent } from "@tiptap/react";
export type Doc = {
  id: number;
  documentName: string;
};

type contentTab = {
  id: string;
  title: string;
  content: JSONContent;
  subtabs: [] | contentTab[];
};

export type singleDoc = {
  documentName: string;
  id: number;
  createdBy: number;
  assignees: null | [string];
  createdDate: Date;
  content: null | contentTab[];
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

export type createdDocResponse = {
  message: string;
  createdDoc: singleDoc;
};
