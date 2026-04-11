/** User-configurable preferences stored server-side. */
export interface UserPreferences {
  appearance: {
    theme: "light" | "dark";
    colorScheme: string; // name from the theme store's palette, e.g. "Purple"
    fontFamily: "sans" | "serif" | "mono" | "code";
  };
  notifications: {
    email: boolean;
    comments: boolean;
    mentions: boolean;
    newsletter: boolean;
  };
  privacy: {
    profileVisible: boolean;
    analytics: boolean;
    twoFactor: boolean;
  };
  content: {
    autoSave: boolean;
    codeHighlighting: boolean;
    wysiwyg: boolean;
  };
}

/** A deep-partial for PATCH-style updates. */
export type UpdatePreferencesRequest = {
  [K in keyof UserPreferences]?: Partial<UserPreferences[K]>;
};
