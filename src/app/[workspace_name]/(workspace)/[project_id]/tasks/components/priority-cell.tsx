import { PRIORITY_DROPDOWN_OPTIONS } from "@/src/components/single-select-dropdown/constants";
import { SelectDropdownField } from "@/src/components/single-select-dropdown/SelectDropdownField";
import { useUpdateTask } from "@/src/hooks/tasks";
import { useState } from "react";

const PriorityCell = ({
  priority,
  taskId,
}: {
  priority: string;
  taskId: number;
}) => {
  const [optimisticPriority, setOptimisticPriority] = useState(priority);
  const { mutate } = useUpdateTask({
    onError: () => setOptimisticPriority(priority),
  });

  return (
    <div>
      <SelectDropdownField
        value={optimisticPriority}
        onChange={(value) => {
          setOptimisticPriority(value);
          mutate({ taskId, payload: { priority: value } });
        }}
        options={PRIORITY_DROPDOWN_OPTIONS}
        className="dark:bg-transparent"
      />
    </div>
  );
};

export default PriorityCell;
