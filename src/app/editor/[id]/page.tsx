"use client";

import { updateDoc } from "@/src/lib/api/documents/services";
import { Editor } from "@mhamz.01/easyflow-texteditor";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import "@mhamz.01/easyflow-texteditor/dist/index.css";

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();

  const mutation = useMutation({
    mutationFn: updateDoc,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <Editor
      onChange={(payload) => {
        mutation.mutate({
          id: Number(id),
          columnName: "content",
          value: payload,
        });
      }}
    />
  );
}
