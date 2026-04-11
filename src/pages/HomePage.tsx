import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Index from "./Index";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function HomePage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();
  const { isLoggedIn, analyticsData, fetchAnalytics } = useAuthStore();

  useEffect(() => {
    // Only set the theme if it's not already set - preserve user preferences
    if (theme === undefined) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }

    // Load dashboard analytics once per session for logged-in users.
    if (isLoggedIn && !analyticsData) {
      fetchAnalytics().catch(() => undefined);
    }
  }, [navigate, setTheme, theme, isLoggedIn, analyticsData, fetchAnalytics]);

  return <Index />;
}
