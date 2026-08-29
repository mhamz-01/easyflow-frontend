import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Panel = ({
  icon,
  title,
  meta,
  href,
  hrefLabel = "View all",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  href: string;
  hrefLabel?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1C1C1C]">
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5">
            {icon}
          </span>
          <h2 className="truncate text-sm font-semibold">{title}</h2>
          {meta}
        </div>
        <Link
          href={href}
          className="flex shrink-0 items-center gap-1 text-xs text-gray-400 transition-colors hover:text-primary-blue"
        >
          {hrefLabel}
          <ArrowRight className="size-3" />
        </Link>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
};

export default Panel;
