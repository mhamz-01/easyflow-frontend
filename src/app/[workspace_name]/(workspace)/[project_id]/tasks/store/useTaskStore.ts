import { create } from "zustand";

type Checklist = {
  name: string;
  items: string[];
};
type Attachement = {
  id: number;
  orignalName: string;
  fileKey: string;
};

export type User = {
  id: number;
  name: string;
  avatar?: string;
};

export type Task = {
  id: number;
  code?: string; // TRI-TH-1
  name: string;
  description: string;

  state: "todo" | "in-progress" | "done" | "to-be-done";
  priority: "low" | "medium" | "high";

  startDate?: string;
  dueDate: string;
  endDate?: string;

  assignees: User[];
  createdBy: User;

  checklist: Checklist[];
  links: string[];
  attachments: Attachement[];

  createdAt?: string;
  updatedAt?: string;
};
type VisibleColumn = {
  id: number;
  label: string;
  isHidden: boolean;
};

type TaskStore = {
  isOpen: boolean;
  view: "table" | "board";
  groupBy: string;
  sortBy: string;
  visibleColumns: VisibleColumn[];

  setIsOpen: (value: boolean) => void;
  setView: (view: "table" | "board") => void;
  setGroupBy: (value: string) => void;
  setSortBy: (value: string) => void;
  toggleColumn: (id: number) => void;

  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  isOpen: false,
  view: "table",
  groupBy: "none",
  sortBy: "none",

  visibleColumns: [
    { id: 1, label: "Name", isHidden: false },
    { id: 2, label: "Assignee", isHidden: false },
    { id: 3, label: "Priority", isHidden: false },
    { id: 4, label: "State", isHidden: false },
    { id: 5, label: "Due Date", isHidden: false },
  ],

  setIsOpen: (value) => set({ isOpen: value, selectedTask: null }),
  setView: (view) => set({ view }),
  setGroupBy: (value) => set({ groupBy: value }),
  setSortBy: (value) => set({ sortBy: value }),

  toggleColumn: (id) =>
    set((state) => ({
      visibleColumns: state.visibleColumns.map((col) =>
        col.id === id ? { ...col, isHidden: !col.isHidden } : col,
      ),
    })),

  selectedTask: null,

  setSelectedTask: (task) => set({ selectedTask: task }),
}));
