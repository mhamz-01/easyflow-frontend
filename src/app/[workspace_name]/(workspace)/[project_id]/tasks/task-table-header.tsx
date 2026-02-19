import { Dispatch, SetStateAction, useEffect, useRef } from "react";

const TaskTableHeader = ({
  visibleColumns,
  columnStyle,
  setColumnStyle,
}: {
  visibleColumns: { id: number; label: string; isHidden: boolean }[];
  columnStyle: string;
  setColumnStyle: Dispatch<SetStateAction<string>>;
}) => {
  // 🔥 Resize Logic
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const resizingIndexRef = useRef<number | null>(null);

  const handleMouseDown = (
    e: React.MouseEvent,
    index: number,
    width: number,
  ) => {
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    resizingIndexRef.current = index;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (resizingIndexRef.current === null) return;
    const delta = e.clientX - startXRef.current;
    const newWidth = Math.max(120, startWidthRef.current + delta);
  };

  const handleMouseUp = () => {
    resizingIndexRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className={`grid ${columnStyle} bg-[#191919] text-[#7b7b7b] h-8 font-semibold border border-b-0`}
    >
      {visibleColumns.map((column, index) => (
        <div
          key={column.id}
          className="pl-4 flex justify-between items-center border-r"
        >
          {column.label}
          <span
            onMouseDown={(e) => handleMouseDown(e, index, 213)}
            className="w-2 h-full bg-blue-900 cursor-col-resize"
          />
        </div>
      ))}
    </div>
  );
};

export default TaskTableHeader;
