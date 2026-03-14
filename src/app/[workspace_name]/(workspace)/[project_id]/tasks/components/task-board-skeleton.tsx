const TaskBoardSkeleton = () => {
  return (
    <div className="flex gap-4 p-4 overflow-x-auto animate-pulse">
      {Array.from({ length: 4 }).map((_, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-3 min-w-60 w-60">
          {/* Column header */}
          <div className="flex items-center gap-2 px-1">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-6" />
          </div>

          {/* Cards */}
          {Array.from({ length: colIdx % 2 === 0 ? 4 : 3 }).map(
            (_, cardIdx) => (
              <div
                key={cardIdx}
                className="bg-white border rounded-lg p-3 flex flex-col gap-3 shadow-sm"
              >
                {/* Task name */}
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />

                {/* Footer: assignee + priority */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 bg-gray-200 rounded-full" />
                    <div className="h-2.5 bg-gray-200 rounded w-12" />
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-14" />
                </div>
              </div>
            ),
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskBoardSkeleton;
