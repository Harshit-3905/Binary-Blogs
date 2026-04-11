import type {
  UserPreferences,
  UpdatePreferencesRequest,
} from "@/types/preferencesTypes";

export interface PreferencesService {
  get(): Promise<UserPreferences>;
  update(payload: UpdatePreferencesRequest): Promise<UserPreferences>;
}
