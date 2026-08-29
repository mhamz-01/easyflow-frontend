"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import docsIcon from "@/public/icons/docs.svg";
import Avatar from "@/src/components/custom/avatar";
import { Badge } from "@/src/components/shadcn/badge";
import { Doc } from "@/src/types/documents";
import Panel from "./panel";

const DocsPreview = ({
  basePath,
  docs,
  isLoading,
}: {
  basePath: string;
  docs: Doc[];
  isLoading: boolean;
}) => {
  const router = useRouter();
  const recent = [...docs]
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 4);

  return (
    <Panel
      icon={<Image src={docsIcon} alt="" width={16} height={16} />}
      title="Docs"
      meta={
        !isLoading && (
          <Badge variant="secondary" className="font-normal">
            {docs.length}
          </Badge>
        )
      }
      href={`${basePath}/docs`}
    >
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-10">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        </div>
      ) : recent.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-4 py-10 text-center">
          <p className="text-sm font-medium text-gray-400">No documents yet</p>
          <p className="text-xs text-gray-600">Notes and specs you create will show up here.</p>
        </div>
      ) : (
        <ul className="divide-y divide-white/[0.06]">
          {recent.map((doc) => (
            <li key={doc.id}>
              <button
                type="button"
                onClick={() => router.push(`${basePath}/docs/${doc.id}`)}
                className="flex w-full items-start justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{doc.documentName}</p>
                  {doc.preview && (
                    <p className="mt-0.5 truncate text-xs text-gray-500">{doc.preview}</p>
                  )}
                </div>
                <Avatar
                  src={doc.creator?.imageUrl}
                  width={20}
                  height={20}
                  className="mt-0.5 shrink-0"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
};

export default DocsPreview;
