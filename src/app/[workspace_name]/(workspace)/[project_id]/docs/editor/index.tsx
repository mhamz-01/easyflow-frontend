"use client";

import { getSingleDoc, updateDoc } from "@/src/lib/api/documents/services";
import { Editor } from "@mhamz.01/easyflow-texteditor";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import "@mhamz.01/easyflow-texteditor/dist/index.css";
import { useEffect } from "react";

export default function DocEditor({ id }: { id: string }) {
  const { data, isLoading, isFetched, isError, refetch } = useQuery({
    queryKey: ["doc", id],
    queryFn: () => getSingleDoc(Number(id)),
  });

  const mutation = useMutation({
    mutationFn: updateDoc,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  useEffect(() => {
    console.log("singel doc content", data?.document.content);
  }, [data]);

  if (isLoading) {
    return <div className="max-h-max rounded-xl bg-muted animate-pulse" />;
  }
  return (
    <div className="easyflow-editor h-full">
      <Editor
        initialTabs={data?.document.content ?? []}
        onChange={(payload) => {
          console.log("payload", payload);
          mutation.mutate({
            id: Number(id),
            columnName: "content",
            value: payload.tabs,
          });
        }}
      />
    </div>
  );
}
