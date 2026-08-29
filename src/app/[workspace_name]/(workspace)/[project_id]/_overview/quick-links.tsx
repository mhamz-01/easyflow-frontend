import Image from "next/image";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import tasksIcon from "@/public/icons/tasks.svg";
import whiteboardIcon from "@/public/icons/whiteboard.svg";
import docsIcon from "@/public/icons/docs.svg";

const QuickLinks = ({
  basePath,
  chatHref,
  chatUnread,
}: {
  basePath: string;
  chatHref: string;
  chatUnread: boolean;
}) => {
  const links = [
    { name: "Tasks", href: `${basePath}/tasks`, icon: tasksIcon, color: "#51FF00" },
    { name: "Whiteboards", href: `${basePath}/whiteboards`, icon: whiteboardIcon, color: "#FFC53D" },
    { name: "Docs", href: `${basePath}/docs`, icon: docsIcon, color: "#0D8EFF" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#1C1C1C] px-4 py-3.5 transition-colors hover:border-white/[0.12]"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
            style={{ backgroundColor: `${link.color}1A` }}
          >
            <Image src={link.icon} alt="" width={20} height={20} />
          </span>
          <span className="text-sm font-medium">{link.name}</span>
        </Link>
      ))}

      <Link
        href={chatHref}
        className="group relative flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#1C1C1C] px-4 py-3.5 transition-colors hover:border-white/[0.12]"
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
          style={{ backgroundColor: "#FF00C81A" }}
        >
          <MessageSquare className="size-[18px]" style={{ color: "#FF00C8" }} />
        </span>
        <span className="text-sm font-medium">Chat</span>
        {chatUnread && (
          <span className="absolute right-3 top-3 size-2 rounded-full bg-destructive" />
        )}
      </Link>
    </div>
  );
};

export default QuickLinks;
