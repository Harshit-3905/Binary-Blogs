import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const HomePage = lazy(() => import("./pages/HomePage"));
const BlogsPage = lazy(() => import("./pages/BlogsPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const NewBlogPage = lazy(() => import("./pages/NewBlogPage"));
const EditBlogPage = lazy(() => import("./pages/EditBlogPage"));
const BookmarksPage = lazy(() => import("./pages/BookmarksPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function AppLoadingScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className="h-12 w-12 rounded-full border-4 border-[var(--accent-color)]/25 border-t-[var(--accent-color)] animate-spin"
          aria-hidden="true"
        />
        <div>
          <p className="text-2xl font-bold">Binary Blogs</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}

function RequireAuth({ isLoggedIn }: { isLoggedIn: boolean }) {
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

function RequireGuest({ isLoggedIn }: { isLoggedIn: boolean }) {
  return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />;
}

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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {isBootstrapping ? (
          <AppLoadingScreen message="Loading your workspace..." />
        ) : (
          <BrowserRouter>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Suspense fallback={<AppLoadingScreen message="Loading page..." />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/blogs" element={<BlogsPage />} />
                    <Route path="/blog/:slug" element={<BlogDetailPage />} />
                    <Route path="/profile/:id" element={<ProfilePage />} />

                    <Route element={<RequireGuest isLoggedIn={isLoggedIn} />}>
                      <Route path="/login" element={<AuthPage />} />
                      <Route path="/signup" element={<AuthPage />} />
                    </Route>

                    <Route element={<RequireAuth isLoggedIn={isLoggedIn} />}>
                      <Route path="/new-blog" element={<NewBlogPage />} />
                      <Route path="/edit-blog/:id" element={<EditBlogPage />} />
                      <Route path="/bookmarks" element={<BookmarksPage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        )}
      </TooltipProvider>
  );
};

export default App;
