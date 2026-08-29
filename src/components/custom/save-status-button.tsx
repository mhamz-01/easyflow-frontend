"use client";

import { Button } from "../shadcn/button";
import { Spinner } from "../shadcn/spinner";
import { Check, AlertCircle, Save } from "lucide-react";
import { useSaveStatusStore } from "@/src/store/useSaveStatusStore";

export default function SaveStatusButton() {
  const status = useSaveStatusStore((s) => s.status);

  if (status === "saving") {
    return (
      <Button variant="outline" disabled className="gap-1.5">
        <Spinner />
        <span className="max-sm:hidden">Saving...</span>
      </Button>
    );
  }

  if (status === "error") {
    return (
      <Button variant="outline" disabled className="gap-1.5 text-destructive">
        <AlertCircle size={16} />
        <span className="max-sm:hidden">Save failed</span>
      </Button>
    );
  }

  if (status === "saved") {
    return (
      <Button variant="outline" disabled className="gap-1.5">
        <Check size={16} />
        <span className="max-sm:hidden">Saved</span>
      </Button>
    );
  }

  return (
    <Button variant="outline" disabled className="gap-1.5">
      <Save size={16} />
      <span className="max-sm:hidden">Save</span>
    </Button>
  );
}
