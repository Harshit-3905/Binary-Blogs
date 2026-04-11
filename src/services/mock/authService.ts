import type { AuthService } from "@/services/interfaces";
import type { AuthResponse, LoginRequest, SignupRequest, UpdateProfileRequest, ChangePasswordRequest } from "@/types/apiTypes";
import type { User } from "@/types/userTypes";
import { defaultUser, guestUser } from "@/data/demoUsers";
import { mockDelay } from "@/services/mockUtils";
import { mockState, persistMockSession, requireMockUser } from "./mockState";

function setCurrentMockUser(user: User | null): void {
  mockState.currentUser = user;
  persistMockSession(user);
}

export const mockAuthService: AuthService = {
  async login(_payload: LoginRequest): Promise<AuthResponse> {
    await mockDelay();
    setCurrentMockUser(defaultUser);
    return { user: defaultUser };
  },

  async signup(payload: SignupRequest): Promise<AuthResponse> {
    await mockDelay();
    const user: User = {
      ...defaultUser,
      id: `u_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      joinDate: new Date().toISOString().split("T")[0],
    };
    setCurrentMockUser(user);
    return { user };
  },

  async guestLogin(): Promise<AuthResponse> {
    await mockDelay(100);
    setCurrentMockUser(guestUser);
    return { user: guestUser };
  },

  async logout(): Promise<void> {
    await mockDelay(50);
    setCurrentMockUser(null);
  },

  async getCurrentUser(): Promise<User | null> {
    await mockDelay(50);
    return mockState.currentUser;
  },

  async updateProfile(payload: UpdateProfileRequest): Promise<User> {
    await mockDelay();
    const current = requireMockUser();
    const updated: User = { ...current, ...payload };
    setCurrentMockUser(updated);
    return updated;
  },

  async changePassword(_payload: ChangePasswordRequest): Promise<void> {
    await mockDelay();
  },
};
