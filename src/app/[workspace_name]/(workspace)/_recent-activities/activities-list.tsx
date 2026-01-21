import Avatar from "@/src/components/custom/avatar";
import { History } from "lucide-react";
import profile from "@/public/images/profile.png";
const RecentActivityList = ({ name }: { name: string }) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        {/* icon */}
        <span className="p-2 rounded bg-[#3c3c3c]">
          <History />
        </span>
        {/* name */}
        <span className="font-medium capitalize ">{name}</span>
        {/* last edited */}
        <span className="font-medium capitalize text-gray-100">2 days ago</span>
      </div>
      <Avatar src={profile.src} width={30} height={30} />
    </div>
  );
};

export default RecentActivityList;
