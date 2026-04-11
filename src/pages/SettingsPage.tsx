import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { authService } from "@/services";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, Palette, Bell, Shield, User, Database } from "lucide-react";
import { AccentColorSelector } from "@/components/AccentColorSelector";
import { FontSelector } from "@/components/FontSelector";

export default function SettingsPage() {
  const { isLoggedIn, user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { preferences, updatePreferences } = usePreferencesStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("appearance");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  /**
   * Theme clicks update both the local theme store (for immediate CSS
   * variable application) and the preferences store (for server-side
   * persistence so the choice survives a reload on another device).
   */
  const handleThemeChange = async (newTheme: "light" | "dark") => {
    if (theme === newTheme) return;
    setTheme(newTheme);
    try {
      await updatePreferences({ appearance: { theme: newTheme } });
      toast({
        title: `Theme changed to ${newTheme}`,
        description: "Your theme preference has been saved.",
      });
    } catch {
      setTheme(theme); // revert
      toast({
        title: "Failed to save theme",
        variant: "destructive",
      });
    }
  };

  /** Generic boolean-toggle helper for non-appearance preference sections. */
  const toggleBool = async <
    S extends "notifications" | "privacy" | "content",
    K extends keyof typeof preferences[S] & string
  >(
    section: S,
    key: K,
    label: string
  ) => {
    const next = !preferences[section][key];
    try {
      await updatePreferences({
        [section]: { [key]: next },
      } as Parameters<typeof updatePreferences>[0]);
      toast({
        title: `${label} ${next ? "enabled" : "disabled"}`,
      });
    } catch {
      toast({
        title: `Failed to update ${label.toLowerCase()}`,
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword) {
      toast({
        title: "Missing Current Password",
        description: "Please enter your current password.",
        variant: "destructive",
      });
      return;
    }
    if (!newPassword) {
      toast({
        title: "Missing New Password",
        description: "Please enter a new password.",
        variant: "destructive",
      });
      return;
    }
    if (!confirmPassword) {
      toast({
        title: "Missing Confirmation",
        description: "Please confirm your new password.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast({
        title: "Failed to change password",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const MotionButton = motion(Button);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="container max-w-6xl py-8 md:py-12">
      <AnimatedSection>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-8">
          Manage your account settings and preferences
        </p>
      </AnimatedSection>

      <Tabs
        defaultValue="appearance"
        className="space-y-8"
        onValueChange={setActiveTab}
      >
        <AnimatedSection>
          <div className="overflow-x-auto pb-2">
            <TabsList className="w-full grid grid-cols-5 md:grid-cols-5 md:gap-2 gap-1 h-fit">
              <TabsTrigger
                value="appearance"
                className={`flex items-center justify-center flex-col md:flex-row gap-1 md:gap-2 px-2 py-1.5 ${
                  activeTab === "appearance"
                    ? "md:bg-background md:text-foreground bg-[var(--accent-color)] text-white"
                    : ""
                }`}
              >
                <Palette className="h-4 w-4" />
                <span className="text-[10px] xs:text-xs md:hidden">Theme</span>
                <span className="hidden md:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className={`flex items-center justify-center flex-col md:flex-row gap-1 md:gap-2 px-2 py-1.5 ${
                  activeTab === "account"
                    ? "md:bg-background md:text-foreground bg-[var(--accent-color)] text-white"
                    : ""
                }`}
              >
                <User className="h-4 w-4" />
                <span className="text-[10px] xs:text-xs md:hidden">
                  Account
                </span>
                <span className="hidden md:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className={`flex items-center justify-center flex-col md:flex-row gap-1 md:gap-2 px-2 py-1.5 ${
                  activeTab === "notifications"
                    ? "md:bg-background md:text-foreground bg-[var(--accent-color)] text-white"
                    : ""
                }`}
              >
                <Bell className="h-4 w-4" />
                <span className="text-[10px] xs:text-xs md:hidden">Alerts</span>
                <span className="hidden md:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className={`flex items-center justify-center flex-col md:flex-row gap-1 md:gap-2 px-2 py-1.5 ${
                  activeTab === "privacy"
                    ? "md:bg-background md:text-foreground bg-[var(--accent-color)] text-white"
                    : ""
                }`}
              >
                <Shield className="h-4 w-4" />
                <span className="text-[10px] xs:text-xs md:hidden">
                  Privacy
                </span>
                <span className="hidden md:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger
                value="data"
                className={`flex items-center justify-center flex-col md:flex-row gap-1 md:gap-2 px-2 py-1.5 ${
                  activeTab === "data"
                    ? "md:bg-background md:text-foreground bg-[var(--accent-color)] text-white"
                    : ""
                }`}
              >
                <Database className="h-4 w-4" />
                <span className="text-[10px] xs:text-xs md:hidden">Data</span>
                <span className="hidden md:inline">Data</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </AnimatedSection>

        <TabsContent value="appearance" className="space-y-6">
          <AnimatedSection>
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>
                  Customize how Binary Blogs appears to you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Theme Mode</h3>
                  <div className="flex flex-col md:flex-row gap-4">
                    <MotionButton
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      variant="link"
                      size="default"
                      className={`flex-1 gap-2 py-6 ${
                        theme === "light"
                          ? "bg-[var(--accent-color)] text-white"
                          : ""
                      } border-2 border-[var(--accent-color)]`}
                      onClick={() => handleThemeChange("light")}
                    >
                      <Sun className="h-5 w-5 mr-2" />
                      Light Mode
                    </MotionButton>
                    <MotionButton
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      variant="link"
                      size="default"
                      className={`flex-1 gap-2 py-6 ${
                        theme === "dark"
                          ? "bg-[var(--accent-color)] text-white"
                          : ""
                      } border-2 border-[var(--accent-color)]`}
                      onClick={() => handleThemeChange("dark")}
                    >
                      <Moon className="h-5 w-5 mr-2" />
                      Dark Mode
                    </MotionButton>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Accent Color</h3>
                  <AccentColorSelector />
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Font Settings</h3>
                  <FontSelector />
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </TabsContent>

        <TabsContent value="account">
          <AnimatedSection>
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <input
                        id="name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={user?.name || ""}
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <input
                        id="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={user?.email || "user@example.com"}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Password</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="current-password">Current Password</Label>
                      <input
                        id="current-password"
                        type="password"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="new-password">New Password</Label>
                      <input
                        id="new-password"
                        type="password"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <input
                        id="confirm-password"
                        type="password"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    className="mt-4 bg-[var(--accent-color)] text-white hover:bg-background hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] border-2 border-transparent"
                    onClick={handlePasswordChange}
                  >
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </TabsContent>

        <TabsContent value="notifications">
          <AnimatedSection>
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about comments and likes via email
                      </p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={preferences.notifications.email}
                      onCheckedChange={() =>
                        toggleBool("notifications", "email", "Email notifications")
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="comment-notifications">
                        Comment Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone comments on your blogs
                      </p>
                    </div>
                    <Switch
                      id="comment-notifications"
                      checked={preferences.notifications.comments}
                      onCheckedChange={() =>
                        toggleBool(
                          "notifications",
                          "comments",
                          "Comment notifications"
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mention-notifications">
                        Mention Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone mentions you in a comment
                      </p>
                    </div>
                    <Switch
                      id="mention-notifications"
                      checked={preferences.notifications.mentions}
                      onCheckedChange={() =>
                        toggleBool(
                          "notifications",
                          "mentions",
                          "Mention notifications"
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newsletter">Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive our weekly developer newsletter
                      </p>
                    </div>
                    <Switch
                      id="newsletter"
                      checked={preferences.notifications.newsletter}
                      onCheckedChange={() =>
                        toggleBool(
                          "notifications",
                          "newsletter",
                          "Newsletter subscription"
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </TabsContent>

        <TabsContent value="privacy">
          <AnimatedSection>
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control your privacy and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="profile-visibility">
                        Profile Visibility
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to other users
                      </p>
                    </div>
                    <Switch
                      id="profile-visibility"
                      checked={preferences.privacy.profileVisible}
                      onCheckedChange={() =>
                        toggleBool(
                          "privacy",
                          "profileVisible",
                          "Profile visibility"
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="analytics">Usage Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Help us improve by allowing anonymous usage data
                        collection
                      </p>
                    </div>
                    <Switch
                      id="analytics"
                      checked={preferences.privacy.analytics}
                      onCheckedChange={() =>
                        toggleBool("privacy", "analytics", "Usage analytics")
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">
                        Two-Factor Authentication
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enhance your account security with 2FA
                      </p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={preferences.privacy.twoFactor}
                      onCheckedChange={() =>
                        toggleBool(
                          "privacy",
                          "twoFactor",
                          "Two-factor authentication"
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </TabsContent>

        <TabsContent value="data">
          <AnimatedSection>
            <Card>
              <CardHeader>
                <CardTitle>Content Settings</CardTitle>
                <CardDescription>
                  Configure how your content is saved and displayed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-save">Auto-Save Drafts</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically save your blog drafts while writing
                      </p>
                    </div>
                    <Switch
                      id="auto-save"
                      checked={preferences.content.autoSave}
                      onCheckedChange={() =>
                        toggleBool("content", "autoSave", "Auto-save drafts")
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="code-highlighting">
                        Code Syntax Highlighting
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Highlight syntax in code blocks when reading blogs
                      </p>
                    </div>
                    <Switch
                      id="code-highlighting"
                      checked={preferences.content.codeHighlighting}
                      onCheckedChange={() =>
                        toggleBool(
                          "content",
                          "codeHighlighting",
                          "Code highlighting"
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="wysiwyg">WYSIWYG Editor</Label>
                      <p className="text-sm text-muted-foreground">
                        Use the visual editor when writing blogs
                      </p>
                    </div>
                    <Switch
                      id="wysiwyg"
                      checked={preferences.content.wysiwyg}
                      onCheckedChange={() =>
                        toggleBool("content", "wysiwyg", "WYSIWYG editor")
                      }
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Storage Usage</h3>
                  <div className="space-y-2">
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: "25%" }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Using 25MB of 100MB (25%)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}
