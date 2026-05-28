"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/shadcn/dialog";
import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import { Label } from "@/src/components/shadcn/label";
import { Spinner } from "@/src/components/shadcn/spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DialogClose } from "@radix-ui/react-dialog";

const schema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

type FormValues = z.infer<typeof schema>;

interface AddLinkModalProps {
  isPending: boolean;
  onSubmit: (url: string) => void;
}

const AddLinkModal = ({ isPending, onSubmit }: AddLinkModalProps) => {
  const { register, handleSubmit, formState: { errors }, reset } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data.url);
    reset();
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add Link</DialogTitle>
        <DialogDescription>Paste a URL to attach to this task.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4 space-y-4">
        <div className="flex flex-col">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            className="mt-3"
            placeholder="https://example.com"
            autoFocus
            {...register("url")}
          />
          {errors.url && (
            <span className="text-red-500 text-sm mt-1">{errors.url.message}</span>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" size="sm">Cancel</Button>
          </DialogClose>
          <Button type="submit" size="sm" variant="primary" disabled={isPending}>
            {isPending ? <Spinner /> : "Add Link"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AddLinkModal;