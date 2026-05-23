import { useCallback, useState, useEffect } from "react";
import { trpc } from "@/providers/trpc";

export interface UnifiedUser {
  id: number;
  name: string;
  email?: string | null;
  avatar?: string | null;
  role: string;
}

export function useAuth() {
  const utils = trpc.useUtils();
  const [forceReady, setForceReady] = useState(false);

  // Query local auth first (email/password)
  const localQuery = trpc.localAuth.me.useQuery(undefined, {
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Query OAuth user (only if no local user found)
  const oauthQuery = trpc.auth.me.useQuery(undefined, {
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !localQuery.data && !localQuery.isLoading,
    staleTime: 1000 * 60 * 5,
  });

  // Force ready after 2 seconds max (prevent infinite loading)
  useEffect(() => {
    const timer = setTimeout(() => setForceReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Logout mutation
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.invalidate();
    },
  });

  // Build unified user from whichever auth method works
  let user: UnifiedUser | null = null;

  if (localQuery.data) {
    user = {
      id: localQuery.data.id,
      name: localQuery.data.name,
      email: localQuery.data.email,
      avatar: localQuery.data.avatar,
      role: localQuery.data.role,
    };
  } else if (oauthQuery.data) {
    user = {
      id: oauthQuery.data.id,
      name: oauthQuery.data.name,
      email: oauthQuery.data.email,
      avatar: oauthQuery.data.avatar,
      role: oauthQuery.data.role,
    };
  }

  // Loading is done when local query finishes or timeout hits
  const isLoading = !forceReady && (localQuery.isLoading || oauthQuery.isLoading);
  const isAuthenticated = !!user;

  const logout = useCallback(async () => {
    localStorage.removeItem("local_auth_token");
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Ignore OAuth logout errors
    }
    window.location.href = "/#/";
  }, [logoutMutation]);

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };
}
