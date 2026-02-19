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
  AlertCircle,
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Circle,
  Columns3,
  Layers,
  SlidersHorizontal,
  Table,
  User,
} from "lucide-react";
import { useState } from "react";

const TaskManagerHeader = () => {
  const [groupBy, setGroupBy] = useState("none");
  const [sortBy, setSortBy] = useState("none");
  const [view, setView] = useState("table");

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 my-5 border-b px-3 pb-3">
      {/* Left: View Switcher */}
      <div className="flex items-center gap-2">
        <div className="bg-muted rounded-lg p-1 flex">
          <Button
            variant={"ghost"}
            className={
              view === "table"
                ? "bg-primary-blue text-white dark:hover:bg-primary-blue"
                : ""
            }
            size="sm"
            onClick={() => setView("table")}
          >
            <Table className="h-4 w-4" />
            Table view
          </Button>
          <Button
            variant={"ghost"}
            size="sm"
            className={
              view === "board"
                ? "bg-primary-blue text-white dark:hover:bg-primary-blue hover:text-white"
                : ""
            }
            onClick={() => setView("board")}
          >
            <Columns3 className="h-4 w-4" />
            Board view
          </Button>
        </div>
      </div>
      {/* Right: Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Group By */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Layers className="h-4 w-4" />
              Group by: {groupBy}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setGroupBy("none")}>
              <Circle className="h-4 w-4" />
              No Grouping
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setGroupBy("state")}>
              <Circle className="h-4 w-4" />
              State
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setGroupBy("priority")}>
              <AlertCircle className="h-4 w-4" />
              Priority
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setGroupBy("assignees")}>
              <User className="h-4 w-4" />
              Assignees
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort By */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4" />
              Sort by: {sortBy}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy("none")}>
              No Sorting
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("priority")}>
              <AlertCircle className="h-4 w-4" />
              Priority
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("dueDate")}>
              <Calendar className="h-4 w-4" />
              Due Date
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("state")}>
              <Circle className="h-4 w-4" />
              State
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Show/Hide Fields */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4" />
              Fields
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Visible Fields</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TaskManagerHeader;
