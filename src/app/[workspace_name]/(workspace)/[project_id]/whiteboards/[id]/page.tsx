"use client";

import { Button } from "@/src/components/shadcn/button";
import { getSingleWhiteboard } from "@/src/lib/api/whiteboards/services";
import { whiteboardKeys } from "@/src/lib/api/whiteboards/keys";
import { useWhiteboardStore } from "@/src/store/useWhiteboardStore";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WhiteboardEditor from "../whiteboard-canvas";
import { useSidebar } from "@/src/components/shadcn/sidebar";



const Page = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {setOpen} = useSidebar();
  const setWhiteboard = useWhiteboardStore((s) => s.setWhiteboard);


  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: whiteboardKeys.single(Number(params.id)),
    queryFn: () => getSingleWhiteboard(Number(params.id)),
    enabled: !!params.id,
  });

  useEffect(() => {
    setOpen(false);
    return () => setOpen(true);
  }, []);

  useEffect(() => {
    if (data) setWhiteboard(data.whiteboard);
  }, [data, setWhiteboard]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {isError && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 text-sm text-red-500 bg-background px-3 py-2 rounded-lg shadow">
          Failed to load whiteboard
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-1" />Refresh
          </Button>
        </div>
      )}
      {isLoading && <div className="w-full h-full rounded-xl bg-muted animate-pulse" />}
      <WhiteboardEditor id={params.id} />
    </div>
  );
};

export default Page;