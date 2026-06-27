"use client";
import { Button } from "@/src/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/shadcn/dropdown-menu";
import {
  ArrowUpDown,
  ChevronDown,
  Columns3,
  Layers,
  SlidersHorizontal,
  Table,
} from "lucide-react";
import { useTaskStore } from "./store/useTaskStore";

const TaskManagerHeader = () => {
  const {
    view,
    tableGroupBy,
    boardGroupBy,
    tableSortBy,
    setView,
    setTableGroupBy,
    setBoardGroupBy,
    setTableSortBy,
    visibleColumns,
    toggleColumn,
  } = useTaskStore();

  const activeGroupBy = view === "table" ? tableGroupBy : boardGroupBy;
  const setGroupBy = view === "table" ? setTableGroupBy : setBoardGroupBy;

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 my-5 px-3 pb-3">
      {/* View Switcher */}
      <div className="bg-muted rounded-lg p-1 flex">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView("table")}
          className={
            view === "table"
              ? "bg-primary-blue text-white dark:hover:bg-primary-blue"
              : ""
          }
        >
          <Table className="h-4 w-4" />
          Table view
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView("board")}
          className={
            view === "board"
              ? "bg-primary-blue text-white dark:hover:bg-primary-blue"
              : ""
          }
        >
          <Columns3 className="h-4 w-4" />
          Board view
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {/* Group By */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Layers className="h-4 w-4" />
              Group by: {activeGroupBy}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setGroupBy("none")}>
              No Grouping
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setGroupBy("state")}>
              State
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setGroupBy("priority")}>
              Priority
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setGroupBy("assignee")}>
              Assignee
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort By */}
        {view === "table" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4" />
                Sort by: {tableSortBy}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTableSortBy("none")}>
                No Sorting
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTableSortBy("priority")}>
                Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTableSortBy("dueDate")}>
                Due Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTableSortBy("state")}>
                State
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Visible Fields */}
        {view === "table" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4" />
                Fields
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Visible Fields</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {visibleColumns.map((col) => (
                <DropdownMenuItem
                  key={col.id}
                  onClick={() => toggleColumn(col.id)}
                >
                  {col.label}
                  {col.isHidden ? " (Hidden)" : ""}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default TaskManagerHeader;
