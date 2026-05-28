import Avatar from "@/src/components/custom/avatar";
import { History } from "lucide-react";
import profile from "@/public/images/profile.png";
import { formatDate } from "@/src/lib/utils";



const RecentActivityList = ({
  name,
  type,
  updatedAt,
  editor,
}: {
  name: string;
  type: "DOC" | "WHITEBOARD" | "TASK";
  updatedAt: string;
  editor: { username: string; imageUrl?: string } | null;
}) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <span className="p-2 rounded bg-[#3c3c3c]">
          <History />
        </span>
        <div className="flex flex-col">
          <span className="font-medium capitalize">{name}</span>
          <span className="text-xs text-gray-400">
            {type.toLowerCase()} · created by {editor?.username ?? "unknown"} · {formatDate(updatedAt)}
          </span>
        </div>
      </div>
      <Avatar src={editor?.imageUrl ?? profile.src} width={30} height={30} />
    </div>
  );
};
export default RecentActivityList;
