import { JSONContent } from "@tiptap/react";
export type DocAssignee = {
  id: number;
  username: string;
  imageUrl?: string;
};

export type Doc = {
  id: number;
  documentName: string;
  isPrivate: boolean;
  createdBy: number;
  createdDate: string;
  assignees: DocAssignee[];
  preview: string; 
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
  assignees: number[] | null;
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
  // docs: {
  //   id: number;
  //   documentName: string;
  // }[];
  docs: Doc[];
};

export type createdDocResponse = {
  message: string;
  createdDoc: singleDoc;
};

