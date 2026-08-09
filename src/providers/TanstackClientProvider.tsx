"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default staleTime was 0, so every remount (e.g. navigating back to
      // the workspace home) refetched from the network even if nothing had
      // changed. Individual queries can still override this when they need
      // fresher data.
      staleTime: 30 * 1000,
    },
  },
});
export default function TanstackClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
