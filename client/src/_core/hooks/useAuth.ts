import { useMemo } from "react";

/**
 * useAuth hook (Simplified)
 * Authentication has been removed as per user request.
 * This hook now returns a static Guest user to bypass all login locks.
 */
export function useAuth() {
  const state = useMemo(() => {
    const dummyUser = {
      id: 1,
      openId: "guest",
      name: "Guest User",
      email: "guest@example.com",
    };

    return {
      user: dummyUser,
      loading: false,
      error: null,
      isAuthenticated: true,
    };
  }, []);

  return {
    ...state,
    refresh: async () => {},
    logout: async () => {
      console.log("Logout called (No-op as auth is removed)");
    },
  };
}
