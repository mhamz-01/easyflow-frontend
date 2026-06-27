import SelectDate from "@/src/components/select-date/SelectDate";
import { useUpdateTask } from "@/src/hooks/tasks";
import { formatDate } from "@/src/lib/utils";

const DateCell = ({ taskId, date }: { taskId: number; date: string }) => {
  const { mutate } = useUpdateTask();

  return (
    <SelectDate
      value={date ? new Date(date) : undefined}
      onChange={(date) => {
        mutate({ taskId, payload: { dueDate: date } });
      }}
      renderTrigger={({ value }) => (
        <span className="cursor-pointer inline-block min-w-20 dark:bg-transparent hover:dark:bg-transparent border-0">
          {value instanceof Date ? (
            formatDate(value)
          ) : (
            <span className="invisible">Pick a date</span>
          )}
        </span>
      )}
    />
  );
};

export default DateCell;
