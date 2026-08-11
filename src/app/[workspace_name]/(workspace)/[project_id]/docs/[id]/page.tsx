"use client";

import { Button } from "@/src/components/shadcn/button";
import { getSingleDoc } from "@/src/lib/api/documents/services";
import { docsKeys } from "@/src/lib/api/documents/keys";
import { useDocumentStore } from "@/src/store/useDocumentStore";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import DocEditor from "../editor";
import { useSidebar } from "@/src/components/shadcn/sidebar";

const Page = () => {
  const params = useParams<{ id: string }>();
  const {setOpen} = useSidebar();
  // const router = useRouter();
  const setDocument = useDocumentStore((s) => s.setDocument);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: docsKeys.single(Number(params.id)),
    queryFn: () => getSingleDoc(Number(params.id)),
    enabled: !!params.id,
  });

  useEffect(() => {
    setOpen(false);
    return () => setOpen(true);
  }, []);

  useEffect(() => {
    if (data) {
      setDocument(data.document);
    }
  }, [data, setDocument]);

  return (
    <div className="relative h-screen overflow-hidden">
      {isLoading && <div className="max-h-max rounded-xl bg-muted animate-pulse" />}
      {isError && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 text-sm text-red-500 bg-background px-3 py-2 rounded-lg shadow">
          Failed to load document
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-1" />Refresh
          </Button>
        </div>
      )}
      <DocEditor id={params.id} />
    </div>
  );};

export default Page;
