"use client";

import { getSingleDoc, updateDoc } from "@/src/lib/api/documents/services";
import { Editor } from "@mhamz.01/easyflow-texteditor";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import "@mhamz.01/easyflow-texteditor/dist/index.css";
import { useEffect } from "react";
const dummyTabsFromDB = [
  {
    id: "tab-1",
    title: "Introduction",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: "left",
          },
          content: [
            {
              type: "text",
              text: "Get Started...",
              marks: [
                {
                  type: "textStyle",
                  attrs: {
                    color: "#4a4a4a",
                    fontFamily: "Inter",
                    fontSize: "22px",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    subtabs: [],
  },
  {
    id: "tab-2",
    title: "Features",
    content: {
      type: "doc",
      content: [
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Rich text editing" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Tabs & Subtabs" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Dark mode UI" }],
                },
              ],
            },
          ],
        },
      ],
    },
    subtabs: [
      {
        id: "subtab-2-1",
        title: "Advanced",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This is a subtab loaded from DB.",
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: "tab-3",
    title: "Conclusion",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Everything here is coming from a dummy API response.",
            },
          ],
        },
      ],
    },
    subtabs: [],
  },
];
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
        initialTabs={dummyTabsFromDB}
        // initialTabs={data?.document.content ?? []}
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
