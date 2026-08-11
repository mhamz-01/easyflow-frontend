"use client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/shadcn/dialog";
import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import { Label } from "@/src/components/shadcn/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { Spinner } from "../shadcn/spinner";
import { Globe, Lock } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  isPrivate: z.boolean(),
  defaultAccess: z.enum(["view", "edit"]),
});

type FormValues = z.infer<typeof schema>;

interface CreateItemModalProps {
  title: string;
  description: string;
  label: string;
  placeholder: string;
  buttonText: string;
  isPending: boolean;
  onSubmit: (
    name: string,
    isPrivate: boolean,
    defaultAccess?: "view" | "edit",
  ) => void; // ✅ passes isPrivate (+ defaultAccess when showDefaultAccessOption is on)
  // Opt-in: show the "Open for all" / "View only" default-access toggle
  // for public items. Off by default so other CreateItemModal consumers
  // (e.g. whiteboards) are unaffected.
  showDefaultAccessOption?: boolean;
}

const CreateItemModal: React.FC<CreateItemModalProps> = ({
  title,
  description,
  label,
  placeholder,
  buttonText,
  isPending,
  onSubmit,
  showDefaultAccessOption = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", isPrivate: false, defaultAccess: "edit" },
  });

  const isPrivate = watch("isPrivate");
  const defaultAccess = watch("defaultAccess");

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(
      data.name,
      data.isPrivate,
      showDefaultAccessOption ? data.defaultAccess : undefined,
    );
    reset();
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4 space-y-4">
        {/* Name input */}
        <div className="flex flex-col">
          <Label htmlFor="name">{label}</Label>
          <Input
            id="name"
            className="mt-3"
            placeholder={placeholder}
            autoFocus
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Visibility toggle */}
        <div className="flex flex-col gap-1.5">
          <Label>Visibility</Label>
          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              onClick={() => setValue("isPrivate", false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                !isPrivate
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              <Globe size={15} />
              Public
            </button>
            <button
              type="button"
              onClick={() => setValue("isPrivate", true)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                isPrivate
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              <Lock size={15} />
              Private
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isPrivate
              ? "Only you can see this document."
              : "Everyone in the project can see this document."}
          </p>
        </div>

        {/* Default access — only meaningful for public items */}
        {showDefaultAccessOption && !isPrivate && (
          <div className="flex flex-col gap-1.5">
            <Label>Default access</Label>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => setValue("defaultAccess", "edit")}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  defaultAccess === "edit"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                Open for all
              </button>
              <button
                type="button"
                onClick={() => setValue("defaultAccess", "view")}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  defaultAccess === "view"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                View only
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {defaultAccess === "view"
                ? "Others can view but not edit, unless given access individually."
                : "Everyone with access can also edit."}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending} size="sm" variant="primary">
            {isPending ? <Spinner /> : buttonText}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default CreateItemModal;