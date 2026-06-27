import { STATE_DROPDOWN_OPTIONS } from "@/src/components/single-select-dropdown/constants";
import { SelectDropdownField } from "@/src/components/single-select-dropdown/SelectDropdownField";
import { useUpdateTask } from "@/src/hooks/tasks";
import { useState } from "react";

const StateCell = ({ state, taskId }: { state: string; taskId: number }) => {
  const [optimisticState, setOptimisticState] = useState(state);
  const { mutate } = useUpdateTask({
    onError: () => setOptimisticState(state),
  });

  return (
    <SelectDropdownField
      value={optimisticState}
      onChange={(value) => {
        setOptimisticState(value);
        mutate({ taskId, payload: { state: value } });
      }}
      options={STATE_DROPDOWN_OPTIONS}
      className="dark:bg-transparent"
    />
  );
};

export default StateCell;
