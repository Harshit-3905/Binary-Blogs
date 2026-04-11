import type { PreferencesService } from "@/services/interfaces";
import type {
  UpdatePreferencesRequest,
  UserPreferences,
} from "@/types/preferencesTypes";
import { apiClient } from "@/lib/apiClient";

export const realPreferencesService: PreferencesService = {
  get: () => apiClient.get<UserPreferences>("/me/preferences"),
  update: (payload: UpdatePreferencesRequest) =>
    apiClient.patch<UserPreferences>("/me/preferences", payload),
};
