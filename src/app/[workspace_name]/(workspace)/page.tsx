"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/src/components/shadcn/sidebar";
import { homePageActions } from "@/src/constants/workspace";
import Image from "next/image";
import RecentActivities from "./_recent-activities";
import StickyNotes from "./_sticky-notes";
import SelectProjectModal from "@/src/components/modals/select-project-modal";
import { useUser } from "@clerk/nextjs";
import { getRandomHeadline } from "@/src/constants/home-greetings";
import { useMemo } from "react";

const actionTypeMap: Record<string, "whiteboards" | "docs" | "tasks"> = {
  Whiteboard: "whiteboards",
  Document: "docs",
  Tasks: "tasks",
};

export default function Home() {
  const { title, subtitle } = useMemo(() => getRandomHeadline(), []);
  const { user } = useUser();
const firstName = user?.firstName ?? "there";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};
const greeting = getGreeting();
  const [selectedAction, setSelectedAction] = useState<typeof homePageActions[number] | null>(null);

  return (
    <>
      <SidebarTrigger className="ml-4 mt-4" />
      <section className="grid place-content-center pb-6">
        <div>
        <div className="text-center max-w-xl mx-auto">
  <span className="inline-block text-md font-medium tracking-wide uppercase text-[#2563eb] mb-12">
    {greeting}, {firstName}
  </span>
  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
  {title}
</h1>
<p className="text-sm text-gray-400 mt-2.5 leading-relaxed">
  {subtitle}
</p>
</div>

          <div className="flex items-center gap-5 justify-center flex-wrap mt-10">
            {homePageActions.map((action) => (
              <div
                key={action.name}
                onClick={() => {
                  if (action.name === "Brain") return;
                  setSelectedAction(action);
                }}
                className="group relative flex flex-col items-center text-center bg-[linear-gradient(to_bottom,#1C1C1C_0%,#1C1C1C_60%,#0F0F0F_100%)] p-6 rounded-2xl border border-white/[0.04] transition-all duration-300 ease-out  hover:border-[#2563eb]/30 hover:shadow-[0_12px_40px_-8px_rgba(37,99,235,0.25)] hover:cursor-pointer min-w-[205px]"
              >
                <span className="absolute inset-0 rounded-2xl bg-[#2563eb]/0 group-hover:bg-[#2563eb]/[0.04] transition-colors duration-300 pointer-events-none" />

                <span className="flex items-center justify-center w-12 h-12 rounded-xl group-hover:border-[#2563eb]/40 transition-colors duration-300">
                  <Image
                    src={action.icon}
                    alt={action.name}
                    width={120}
                    height={120}
                    className="w-[42px] h-[42px] transition-transform duration-300 ease-out group-hover:scale-110"
                  />
                </span>

                <h1 className="text-h1 mt-3 font-semibold">{action.name}</h1>
                <p className="text-sm text-gray-400 mt-0.5">{action.text}</p>

                {/* <span className="mt-3 text-xs font-medium text-[#2563eb] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                  Get started →
                </span> */}
              </div>
            ))}
          </div>
        </div>
        <RecentActivities />
        <StickyNotes />
      </section>

      {selectedAction && (
        <SelectProjectModal
          isOpen={!!selectedAction}
          onClose={() => setSelectedAction(null)}
          actionType={actionTypeMap[selectedAction.name]}
          actionLabel={selectedAction.name}
          actionIcon={selectedAction.icon}
        />
      )}
    </>
  );
}