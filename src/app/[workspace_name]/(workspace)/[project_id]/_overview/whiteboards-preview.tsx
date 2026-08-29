"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import whiteboardIcon from "@/public/icons/whiteboard.svg";
import Avatar from "@/src/components/custom/avatar";
import { Badge } from "@/src/components/shadcn/badge";
import { formatDate } from "@/src/lib/utils";
import { Whiteboard } from "@/src/types/whiteboard";
import Panel from "./panel";

const WhiteboardsPreview = ({
  basePath,
  whiteboards,
  isLoading,
}: {
  basePath: string;
  whiteboards: Whiteboard[];
  isLoading: boolean;
}) => {
  const router = useRouter();
  const recent = [...whiteboards]
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 4);

  return (
    <Panel
      icon={<Image src={whiteboardIcon} alt="" width={16} height={16} />}
      title="Whiteboards"
      meta={
        !isLoading && (
          <Badge variant="secondary" className="font-normal">
            {whiteboards.length}
          </Badge>
        )
      }
      href={`${basePath}/whiteboards`}
    >
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-10">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        </div>
      ) : recent.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-4 py-10 text-center">
          <p className="text-sm font-medium text-gray-400">No whiteboards yet</p>
          <p className="text-xs text-gray-600">Sketch out ideas visually here.</p>
        </div>
      ) : (
        <ul className="divide-y divide-white/[0.06]">
          {recent.map((whiteboard) => (
            <li key={whiteboard.id}>
              <button
                type="button"
                onClick={() => router.push(`${basePath}/whiteboards/${whiteboard.id}`)}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
              >
                <p className="min-w-0 flex-1 truncate text-sm font-medium">
                  {whiteboard.whiteboardName}
                </p>
                <span className="shrink-0 text-xs text-gray-500">
                  {formatDate(whiteboard.createdDate, { year: undefined, month: "short", day: "2-digit" })}
                </span>
                <Avatar src={whiteboard.creator?.imageUrl} width={20} height={20} className="shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
};

export default WhiteboardsPreview;
