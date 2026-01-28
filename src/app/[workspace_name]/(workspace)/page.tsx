"use client";

import { SidebarTrigger } from "@/src/components/shadcn/sidebar";
import { homePageActions } from "@/src/constants/workspace";
import Image from "next/image";
import RecentActivities from "./_recent-activities";
import StickyNotes from "./_sticky-notes";

export default function Home() {
  return (
    <>
      <SidebarTrigger className="pl-4 pt-4" />
      <section className="grid place-content-center">
        <div>
          <div className="text-center">
            <h1 className="text-title font-medium">
              Workflows Made Simple - EasyFlow
            </h1>
            <p className="text-body text-gray-100">
              Built for teams who want clarity, speed, and focus.
            </p>
            <p>
              Your projects, tasks, documents, and whiteboards — all in one
              place.
              <br />
              Collaborate smarter and let AI help you move faster.
            </p>
          </div>
          {/* homepage main actions */}
          <div className="flex items-center gap-5 justify-center flex-wrap mt-5">
            {homePageActions.map((action) => (
              <div
                key={action.name}
                className="group flex flex-col items-center text-center bg-[linear-gradient(to_bottom,#1C1C1C_0%,#1C1C1C_60%,#0F0F0F_100%)] p-5 rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:cursor-pointer min-w-[205px]"
              >
                <Image
                  src={action.icon}
                  alt={action.name}
                  preload
                  width={120}
                  height={120}
                  className="w-[30px] h-[30px] transition-transform duration-300 ease-out group-hover:scale-105"
                />
                <h1 className="text-h1 mt-2 font-bold">{action.name}</h1>
                <p className="text-sm opacity-90">{action.text}</p>
              </div>
            ))}
          </div>
        </div>
        <RecentActivities />
        <StickyNotes />
      </section>
    </>
  );
}
