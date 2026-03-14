const TaskTableSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Header */}
      <div className="flex border-b border-t">
        {["w-64", "w-32", "w-28", "w-28", "w-36"].map((w, i) => (
          <div key={i} className={`${w} h-8 px-4 flex items-center border-r`}>
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex border-b hover:bg-gray-50">
          {/* Name */}
          <div className="w-64 h-10 px-4 flex items-center border-r">
            <div className="h-3 bg-gray-200 rounded w-4/5" />
          </div>
          {/* Assignee */}
          <div className="w-32 h-10 px-4 flex items-center gap-2 border-r">
            <div className="h-6 w-6 bg-gray-200 rounded-full shrink-0" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
          {/* Priority */}
          <div className="w-28 h-10 px-4 flex items-center border-r">
            <div className="h-3 bg-gray-200 rounded w-12" />
          </div>
          {/* State */}
          <div className="w-28 h-10 px-4 flex items-center border-r">
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
          {/* Due Date */}
          <div className="w-36 h-10 px-4 flex items-center">
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskTableSkeleton;
