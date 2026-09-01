"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/shadcn/dialog";
import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import { Label } from "@/src/components/shadcn/label";
import { Spinner } from "@/src/components/shadcn/spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateChatChannel } from "@/src/lib/api/chat/channels/hooks";

const createChannelSchema = z.object({
  name: z.string().trim().min(1, "Channel name is required").max(80),
});

type CreateChannelFormValues = z.infer<typeof createChannelSchema>;

interface CreateChannelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  projectName: string;
}

const CreateChannelModal = ({
  open,
  onOpenChange,
  projectId,
  projectName,
}: CreateChannelModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateChannelFormValues>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: { name: "" },
  });

  const createChannel = useCreateChatChannel(projectId);

  const onSubmit = (data: CreateChannelFormValues) => {
    createChannel.mutate(data.name, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New channel</DialogTitle>
          <DialogDescription>
            Add a channel inside <span className="font-medium">&quot;{projectName}&quot;</span>&apos;s chat.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
          <div className="flex flex-col">
            <Label htmlFor="channel-name">Channel name</Label>
            <Input
              id="channel-name"
              className="mt-3"
              placeholder="e.g. blockers"
              {...register("name")}
            />
            {errors.name && (
              <span className="mt-1 text-sm text-red-500">{errors.name.message}</span>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={createChannel.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" variant="primary" disabled={createChannel.isPending}>
              {createChannel.isPending ? <Spinner /> : "Create channel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
