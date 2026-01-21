import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/shadcn/alert-dialog";
import { Spinner } from "../shadcn/spinner";

const AlertDialogContentModal = ({
  title = "Are you absolutely sure?",
  body = "This action cannot be undone. This will permanently delete all your data.",
  loader,
  buttonText = "Continue",
  onContinue,
}: {
  title?: string;
  body?: string;
  loader: boolean;
  buttonText?: string;
  onContinue: () => void;
}) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{body}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          onClick={onContinue}
        >
          {loader ? <Spinner /> : buttonText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default AlertDialogContentModal;
