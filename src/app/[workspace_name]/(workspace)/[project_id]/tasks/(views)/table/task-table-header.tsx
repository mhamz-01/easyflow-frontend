import { Dispatch, SetStateAction, useRef } from "react";

const MIN_WIDTH = 100;

const TaskTableHeader = ({
  visibleColumns,
  columnWidths,
  setColumnWidths,
  hasHorizontalScroll,
}: {
  visibleColumns: { id: number; label: string; isHidden: boolean }[];
  columnWidths: number[];
  setColumnWidths: Dispatch<SetStateAction<number[]>>;
  hasHorizontalScroll: boolean;
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
  // main border
  // border-b-0
  // each
  // border-r

  // when overflows
  // main no border classname
  // for each cell border-r0 and no border classname for last element
  return (
    <div
      style={{
        gridTemplateColumns: columnWidths.map((w) => `${w}px`).join(" "),
      }}
      className={`grid bg-[#191919] text-[#7b7b7b] ${hasHorizontalScroll ? "" : "border border-b-0"} h-8 font-semibold`}
    >
      {visibleColumns.map((column, index) => (
        <div
          key={column.id}
          className={`pl-4 flex justify-between items-center ${hasHorizontalScroll ? "border" : ""} ${index !== visibleColumns.length - 1 ? (hasHorizontalScroll ? "" : "border-r") : hasHorizontalScroll ? "border-r" : "border-r-0"} relative`} // don't show border right for last element
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
