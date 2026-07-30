"use client";

import { useRef, useState } from "react";
import { LogOut, Settings } from "lucide-react";
import Image from "next/image";
import { useOutsideClick } from "@/src/hooks/use-outside-click";
import { useClerk, useUser } from "@clerk/nextjs";
import { cn } from "@/src/lib/utils";
import { Skeleton } from "../shadcn/skeleton";
import Link from "next/link";
import { useWorkspaceStore } from "@/src/store/workspace";
import Avatar from "../custom/avatar";

const UserAccountMenu = ({ floatRight }: { floatRight?: boolean }) => {
  // states
  const workspace = useWorkspaceStore((s) => s.workspace);
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const { signOut } = useClerk();

  useOutsideClick(modalRef, triggerRef, () => setOpen(false));

  return (
    <div className="relative h-8">
      {/* Avatar Button */}
      {isLoaded ? (
        <Avatar
          src={user?.imageUrl}
          ref={triggerRef}
          className="w-8 h-8"
          width={32}
          height={32}
          onClick={() => setOpen(!open)}
        />
      ) : (
        <Skeleton className="w-8 h-8 rounded-full" />
      )}

      {/* Dropdown */}
      <div
        ref={modalRef}
        className={`absolute z-10 ${
          floatRight ? "left-0" : "right-0"
        } mt-3 w-54 rounded-md bg-background shadow-xl border border-border transition-all duration-200 origin-top ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Email Section */}
        <div className="px-4 py-3 border-b">
          <p className="text-xs text-gray-200">Signed in as</p>
          <p className="text-sm font-medium text-gray-300 truncate">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
        </div>

        {/* Actions */}
        <div className="p-2">
          <Link
            href={`/${workspace?.workspaceSlug}/settings/profile?tab=account`}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm"
          >
            <Settings size={18} />
            Settings
          </Link>
          {/* Clicking this button signs out a user // and redirects them to the
          home page */}
          <button
            onClick={() => signOut({ redirectUrl: "/sign-in" })}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAccountMenu;
