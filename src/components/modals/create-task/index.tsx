import { Button } from "../../shadcn/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/dialog";

const CreateTaskModal = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Task</DialogTitle>
      </DialogHeader>
      <DialogFooter>
        {/* attach files button */}
        <Button>Attach files</Button>
        {/* create task button */}
        <Button>Create task</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CreateTaskModal;
