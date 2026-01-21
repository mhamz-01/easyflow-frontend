"use client";

import { Button } from "@/src/components/shadcn/button";
import { getSingleDoc } from "@/src/lib/api/documents/services";
import { useDocumentStore } from "@/src/store/useDocumentStore";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const params = useParams<{ id: string }>();
  const setDocument = useDocumentStore((s) => s.setDocument);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["doc", params.id],
    queryFn: () => getSingleDoc(Number(params.id)),
    enabled: !!params.id,
  });

  useEffect(() => {
    if (data) {
      setDocument(data.document);
    }
  }, [data, setDocument]);

  return (
    <div className="space-y-4 h-[calc(100vh-80px)] overflow-hidden">
      {/* Back button stays static */}
      {/* <Button onClick={() => router.back()} variant="ghost">
        <ArrowLeft />
        Back
      </Button> */}

      {/* Loading & Error states */}
      {isLoading && (
        <div className="text-sm text-muted-foreground">Loading document…</div>
      )}

      {isError && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          Failed to load document
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      )}

      {/* Editor iframe only when data is ready */}
      {isLoading ? (
        <div className="max-h-max rounded-xl bg-muted animate-pulse" />
      ) : (
        <iframe
          src={`/editor/${params.id}`}
          className="w-full max-h-screen h-full"
        />
      )}
    </div>
  );
};

export default Page;
