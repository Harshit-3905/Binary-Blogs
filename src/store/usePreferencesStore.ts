import { create } from "zustand";
import type {
  UpdatePreferencesRequest,
  UserPreferences,
} from "@/types/preferencesTypes";
import { preferencesService } from "@/services";
import { demoPreferences } from "@/data/demoPreferences";

interface PreferencesState {
  preferences: UserPreferences;
  isLoaded: boolean;
  isSaving: boolean;
  loadPreferences: () => Promise<void>;
  updatePreferences: (patch: UpdatePreferencesRequest) => Promise<void>;
  reset: () => void;
}

/**
 * Server-backed user preferences. Loaded once on login (see App.tsx) and
 * written through on every change. Appearance preferences are mirrored into
 * `useThemeStore` by `SettingsPage` for immediate visual effect.
 */
export const usePreferencesStore = create<PreferencesState>()((set, get) => ({
  preferences: demoPreferences,
  isLoaded: false,
  isSaving: false,

  loadPreferences: async () => {
    const prefs = await preferencesService.get();
    set({ preferences: prefs, isLoaded: true });
  },

  updatePreferences: async (patch) => {
    const previous = get().preferences;

    // Optimistic merge
    const optimistic: UserPreferences = {
      appearance: { ...previous.appearance, ...(patch.appearance ?? {}) },
      notifications: {
        ...previous.notifications,
        ...(patch.notifications ?? {}),
      },
      privacy: { ...previous.privacy, ...(patch.privacy ?? {}) },
      content: { ...previous.content, ...(patch.content ?? {}) },
    };
    set({ preferences: optimistic, isSaving: true });

    try {
      const updated = await preferencesService.update(patch);
      set({ preferences: updated });
    } catch (err) {
      set({ preferences: previous });
      throw err;
    } finally {
      set({ isSaving: false });
    }
  },

  reset: () =>
    set({ preferences: demoPreferences, isLoaded: false, isSaving: false }),
}));
