import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { getMe } from "@/src/lib/api/user/services";

// The internal numeric user id rarely changes and is cheap to keep around
// for the whole session — long staleTime avoids re-fetching it on every
// mount of every component that needs it (notification bell, realtime topic
// subscriptions, etc).
export const useCurrentUser = () => {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
    enabled: !!isSignedIn,
    staleTime: 60 * 60 * 1000,
  });
};
