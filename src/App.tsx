import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

// Pages
import HomePage from "./pages/HomePage";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import NewBlogPage from "./pages/NewBlogPage";
import EditBlogPage from "./pages/EditBlogPage";
import BookmarksPage from "./pages/BookmarksPage";
import DashboardPage from "./pages/DashboardPage";
import AuthPage from "./pages/AuthPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import { Analytics } from "@vercel/analytics/react"

const queryClient = new QueryClient();

const App = () => {
  const { theme, selectedColorName, accentColor, fontFamily, setColorScheme, setFontFamily } = useThemeStore();
  const { isLoggedIn, restoreSession } = useAuthStore();
  const { loadPreferences, reset: resetPreferences } = usePreferencesStore();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  // Apply theme, accent color, and font family from store
  useEffect(() => {
    // Apply explicit theme choice
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    // Apply color scheme (this will set all necessary CSS variables)
    setColorScheme(selectedColorName);

    // Apply font family
    setFontFamily(fontFamily);
  }, [theme, selectedColorName, accentColor, fontFamily, setColorScheme, setFontFamily]);

  // Gate initial render until auth and first preference sync complete.
  useEffect(() => {
    let cancelled = false;

    const bootstrapApp = async () => {
      try {
        await restoreSession();
        const { isLoggedIn: loggedIn } = useAuthStore.getState();
        if (loggedIn) {
          await loadPreferences().catch(() => undefined);
        } else {
          resetPreferences();
        }
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    };

    bootstrapApp();
    return () => {
      cancelled = true;
    };
  }, [restoreSession, loadPreferences, resetPreferences]);

  // Preferences are server-backed, so (re-)load them whenever auth state
  // changes. On logout we reset to the default fixture.
  useEffect(() => {
    if (isBootstrapping) return;
    if (isLoggedIn) {
      loadPreferences().catch(() => undefined);
    } else {
      resetPreferences();
    }
  }, [isBootstrapping, isLoggedIn, loadPreferences, resetPreferences]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {isBootstrapping ? (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4 text-center">
              <div
                className="h-12 w-12 rounded-full border-4 border-[var(--accent-color)]/25 border-t-[var(--accent-color)] animate-spin"
                aria-hidden="true"
              />
              <div>
                <p className="text-2xl font-bold">Binary Blogs</p>
                <p className="text-sm text-muted-foreground">
                  Loading your workspace...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <BrowserRouter>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/blogs" element={<BlogsPage />} />
                  <Route path="/blog/:slug" element={<BlogDetailPage />} />
                  <Route path="/new-blog" element={<NewBlogPage />} />
                  <Route path="/edit-blog/:id" element={<EditBlogPage />} />
                  <Route path="/bookmarks" element={<BookmarksPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/signup" element={<AuthPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/:id" element={<ProfilePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              <Analytics />
            </div>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
