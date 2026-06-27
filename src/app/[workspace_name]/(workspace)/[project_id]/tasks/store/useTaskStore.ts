import { Task } from "@/src/types/tasks";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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

type VisibleColumn = {
  id: number;
  label: string;
  isHidden: boolean;
};

type TaskStore = {
  isOpen: boolean;
  taskId: number | null;
  view: "table" | "board";
  tableGroupBy: string;
  boardGroupBy: string;
  tableSortBy: string;
  visibleColumns: VisibleColumn[];

  setIsOpen: (value: boolean, taskId: number | null) => void;
  setTaskId: (taskId: number | null) => void;
  setView: (view: "table" | "board") => void;
  setTableGroupBy: (value: string) => void;
  setBoardGroupBy: (value: string) => void;
  setTableSortBy: (value: string) => void;
  toggleColumn: (id: number) => void;

  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      isOpen: false,
      taskId: null,
      view: "table",
      tableGroupBy: "none",
      boardGroupBy: "state",
      tableSortBy: "none",

      visibleColumns: [
        { id: 1, label: "Name", isHidden: false },
        { id: 2, label: "Assignee", isHidden: false },
        { id: 3, label: "Priority", isHidden: false },
        { id: 4, label: "State", isHidden: false },
        { id: 5, label: "Due Date", isHidden: false },
      ],

      setIsOpen: (value, taskId) =>
        set({ isOpen: value, taskId, selectedTask: null }),
      setTaskId: (taskId) => set({ taskId }),
      setView: (view) => set({ view }),
      setTableGroupBy: (value) => set({ tableGroupBy: value }),
      setBoardGroupBy: (value) => set({ boardGroupBy: value }),
      setTableSortBy: (value) => set({ tableSortBy: value }),

      toggleColumn: (id) =>
        set((state) => ({
          visibleColumns: state.visibleColumns.map((col) =>
            col.id === id ? { ...col, isHidden: !col.isHidden } : col,
          ),
        })),

      selectedTask: null,

      setSelectedTask: (task) => set({ selectedTask: task }),
    }),
    {
      name: "task-view-store",
      // groupBy is intentionally shared between table & board (one dropdown
      // drives both) -- persisting the whole view-settings slice keeps that
      // merged. isOpen/taskId/selectedTask are transient drawer state and
      // must not survive a reload.
      partialize: (state) => ({
        view: state.view,
        tableGroupBy: state.tableGroupBy,
        boardGroupBy: state.boardGroupBy,
        tableSortBy: state.tableSortBy,
        visibleColumns: state.visibleColumns,
      }),
    },
  ),
);
