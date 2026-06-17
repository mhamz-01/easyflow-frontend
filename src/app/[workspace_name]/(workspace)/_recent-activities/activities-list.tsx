import Avatar from "@/src/components/custom/avatar";
import profile from "@/public/images/profile.png";
import docsIcon from "@/public/icons/docs.svg";
import whiteboardIcon from "@/public/icons/whiteboard.svg";
import tasksIcon from "@/public/icons/tasks.svg";
import { formatDate } from "@/src/lib/utils";
import Image from "next/image";

const typeIconMap = {
  DOC: docsIcon,
  WHITEBOARD: whiteboardIcon,
  TASK: tasksIcon,
};

const RecentActivityList = ({
  name,
  type,
  updatedAt,
  editor,
  projectName,
}: {
  name: string;
  type: "DOC" | "WHITEBOARD" | "TASK";
  updatedAt: string;
  editor: { username: string; imageUrl?: string } | null;
  projectName: string | null;
}) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <span className="p-2 ">
          <Image src={typeIconMap[type]} alt={type} width={30} height={30} />
        </span>
        <div className="flex flex-col">
          <span className="font-medium capitalize">{name}</span>
          <span className="text-xs text-gray-400">
            {projectName ? `${projectName} · ` : ""}created by {editor?.username ?? "unknown"} · {formatDate(updatedAt)}
          </span>
        </div>
      </div>
      <Avatar src={editor?.imageUrl ?? profile.src} width={30} height={30} />
    </div>
  );
};

export default RecentActivityList;