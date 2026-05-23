import { useAuth } from "./useAuth";

export function useIsAdmin() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";
  return { isAdmin, isAuthenticated };
}
