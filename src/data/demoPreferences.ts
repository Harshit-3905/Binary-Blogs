import type { UserPreferences } from "@/types/preferencesTypes";

export const demoPreferences: UserPreferences = {
  appearance: {
    theme: "dark",
    colorScheme: "Purple",
    fontFamily: "code",
  },
  notifications: {
    email: true,
    comments: true,
    mentions: true,
    newsletter: false,
  },
  privacy: {
    profileVisible: true,
    analytics: false,
    twoFactor: false,
  },
  content: {
    autoSave: true,
    codeHighlighting: true,
    wysiwyg: true,
  },
};
