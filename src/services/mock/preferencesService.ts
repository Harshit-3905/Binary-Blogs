import type { PreferencesService } from "@/services/interfaces";
import type {
  UpdatePreferencesRequest,
  UserPreferences,
} from "@/types/preferencesTypes";
import { mockDelay } from "@/services/mockUtils";
import { getUserPreferences, mockState, requireMockUser } from "./mockState";

/** Deep merge a top-level partial update into the full preferences shape. */
function mergePreferences(
  current: UserPreferences,
  patch: UpdatePreferencesRequest
): UserPreferences {
  return {
    appearance: { ...current.appearance, ...(patch.appearance ?? {}) },
    notifications: { ...current.notifications, ...(patch.notifications ?? {}) },
    privacy: { ...current.privacy, ...(patch.privacy ?? {}) },
    content: { ...current.content, ...(patch.content ?? {}) },
  };
}

export const mockPreferencesService: PreferencesService = {
  async get(): Promise<UserPreferences> {
    await mockDelay(80);
    const user = requireMockUser();
    return getUserPreferences(user.id);
  },

  async update(payload: UpdatePreferencesRequest): Promise<UserPreferences> {
    await mockDelay(80);
    const user = requireMockUser();
    const current = getUserPreferences(user.id);
    const merged = mergePreferences(current, payload);
    mockState.preferencesByUser.set(user.id, merged);
    return merged;
  },
};
