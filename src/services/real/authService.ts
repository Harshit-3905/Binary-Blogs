import type { AuthService } from "@/services/interfaces";
import type {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  SignupRequest,
  UpdateProfileRequest,
} from "@/types/apiTypes";
import type { User } from "@/types/userTypes";
import { ApiError, apiClient } from "@/lib/apiClient";

export const realAuthService: AuthService = {
  login: (payload: LoginRequest) =>
    apiClient.post<AuthResponse>("/auth/login", payload),

  signup: (payload: SignupRequest) =>
    apiClient.post<AuthResponse>("/auth/signup", payload),

  guestLogin: () => apiClient.post<AuthResponse>("/auth/guest"),

  logout: () => apiClient.post<void>("/auth/logout"),

  async getCurrentUser(): Promise<User | null> {
    try {
      return await apiClient.get<User>("/auth/me");
    } catch (err) {
      // 401 is expected when there is no active session.
      if (err instanceof ApiError && err.status === 401) return null;
      throw err;
    }
  },

  updateProfile: (payload: UpdateProfileRequest) =>
    apiClient.patch<User>("/auth/me", payload),

  changePassword: (payload: ChangePasswordRequest) =>
    apiClient.post<void>("/auth/change-password", payload),
};
