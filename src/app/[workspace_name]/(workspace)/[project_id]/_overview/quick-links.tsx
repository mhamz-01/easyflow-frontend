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
    <div className="flex flex-wrap items-center gap-2">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="group flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-[#1C1C1C] py-1.5 pl-1.5 pr-3 text-xs font-medium transition-colors hover:border-white/[0.12]"
        >
          <span
            className="flex size-6 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105"
            style={{ backgroundColor: `${link.color}1A` }}
          >
            <Image src={link.icon} alt="" width={13} height={13} />
          </span>
          {link.name}
        </Link>
      ))}

      <Link
        href={chatHref}
        className="group relative flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-[#1C1C1C] py-1.5 pl-1.5 pr-3 text-xs font-medium transition-colors hover:border-white/[0.12]"
      >
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105"
          style={{ backgroundColor: "#FF00C81A" }}
        >
          <MessageSquare className="size-[13px]" style={{ color: "#FF00C8" }} />
        </span>
        Chat
        {chatUnread && (
          <span className="absolute right-1 top-1 size-1.5 rounded-full bg-destructive" />
        )}
      </Link>
    </div>
  );
};

export default QuickLinks;
