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
  defaultAccess: "view" | "edit";
  createdBy: number;
  creator?: DocAssignee;
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
  defaultAccess: "view" | "edit";
  projectId: number;
  workspaceId: number;
  updatedAt: Date;
  lastEdited: Date;

};

// Effective access level the requesting user has on this document —
// always "edit" for private docs (untouched by this feature).
export type DocAccessLevel = "view" | "edit";

export type singleDocResponse = {
  success: boolean;
  document: singleDoc;
  access: DocAccessLevel;
};

// A per-user access override on a public document, as returned by
// GET /docs/:id/access.
export type DocAccessEntry = {
  id: number;
  userId: number;
  accessLevel: "view" | "edit" | "none";
  grantedBy: number | null;
  user?: DocAssignee;
};

export type docAccessListResponse = {
  success: boolean;
  grants: DocAccessEntry[];
};

export type grantDocAccessResponse = {
  success: boolean;
  grant: DocAccessEntry;
};

export type setDefaultAccessResponse = {
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

