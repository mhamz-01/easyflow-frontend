import { Dispatch, SetStateAction, useRef } from "react";
import { Checkbox } from "@/src/components/shadcn/checkbox";

const MIN_WIDTH = 100;
export const CHECKBOX_COLUMN_WIDTH = 40;

const TaskTableHeader = ({
  visibleColumns,
  columnWidths,
  setColumnWidths,
  allSelected,
  someSelected,
  onToggleSelectAll,
}: {
  visibleColumns: { id: number; label: string; isHidden: boolean }[];
  columnWidths: number[];
  setColumnWidths: Dispatch<SetStateAction<number[]>>;
  allSelected: boolean;
  someSelected: boolean;
  onToggleSelectAll: () => void;
}) => {
  const startX = useRef(0);
  const startWidth = useRef(0);
  const columnIndex = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    startX.current = e.clientX;
    startWidth.current = columnWidths[index];
    columnIndex.current = index;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (columnIndex.current === null) return;

    const diff = e.clientX - startX.current;
    const newWidth = Math.max(MIN_WIDTH, startWidth.current + diff);

    setColumnWidths((prev) => {
      const updated = [...prev];
      updated[columnIndex.current!] = newWidth;
      return updated;
    });
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    columnIndex.current = null;
  };

  const widths = columnWidths.slice(0, visibleColumns.length);
  const gridTemplateColumns = [
    `${CHECKBOX_COLUMN_WIDTH}px`,
    ...widths.slice(0, -1).map((w) => `${w}px`),
    `minmax(${widths[widths.length - 1] ?? 213}px, 1fr)`,
  ].join(" ");

  return (
    <div
      style={{ gridTemplateColumns }}
      className="grid bg-[#191919] text-[#7b7b7b] h-8 font-semibold"
    >
      <div className="flex items-center justify-center border-l border-t border-r border-b">
        <Checkbox
          checked={allSelected ? true : someSelected ? "indeterminate" : false}
          onCheckedChange={onToggleSelectAll}
          aria-label="Select all tasks"
        />
      </div>
      {visibleColumns.map((column, index) => (
        <div
          key={column.id}
          className="pl-4 flex justify-between items-center border-t border-r border-b relative"
        >
          {column.label}

          {/* Resize Handle */}
          <span
            onMouseDown={(e) => handleMouseDown(e, index)}
            className="absolute right-0 top-0 h-full w-2 cursor-col-resize bg-transparent"
          />
        </div>
      ))}
    </div>
  );
};

export default TaskTableHeader;
