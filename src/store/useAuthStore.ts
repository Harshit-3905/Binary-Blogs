import { create } from "zustand";
import type { User, AnalyticsData } from "@/types/userTypes";
import type {
  LoginRequest,
  SignupRequest,
  UpdateProfileRequest,
} from "@/types/apiTypes";
import { analyticsService, authService } from "@/services";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  analyticsData: AnalyticsData | null;
  /** True once `restoreSession` has run (prevents a logged-out flash). */
  isAuthReady: boolean;

  restoreSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: SignupRequest) => Promise<void>;
  guestLogin: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (payload: UpdateProfileRequest) => Promise<void>;
  fetchAnalytics: () => Promise<void>;
}

/**
 * Auth store. **No tokens or user data are persisted to localStorage** – the
 * session lives entirely in the server-set httpOnly cookie. On every app boot
 * `restoreSession()` hits `GET /auth/me`; if the cookie is valid we rebuild
 * the user state, otherwise we stay logged out.
 *
 * Persisting auth here would re-introduce the XSS exposure we removed.
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  user: null,
  analyticsData: null,
  isAuthReady: false,

  restoreSession: async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        set({ isLoggedIn: true, user });
      } else {
        set({ isLoggedIn: false, user: null });
      }
    } catch {
      set({ isLoggedIn: false, user: null });
    } finally {
      set({ isAuthReady: true });
    }
  },

  login: async (email, password) => {
    const payload: LoginRequest = { email, password };
    const { user } = await authService.login(payload);
    set({ isLoggedIn: true, user });
  },

  signup: async (payload) => {
    const { user } = await authService.signup(payload);
    set({ isLoggedIn: true, user });
  },

  guestLogin: async () => {
    const { user } = await authService.guestLogin();
    set({ isLoggedIn: true, user });
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ isLoggedIn: false, user: null, analyticsData: null });
    }
  },

  updateUser: async (payload) => {
    const previous = get().user;
    set({ user: previous ? { ...previous, ...payload } : null });
    try {
      const updated = await authService.updateProfile(payload);
      set({ user: updated });
    } catch (err) {
      set({ user: previous });
      throw err;
    }
  },

  fetchAnalytics: async () => {
    const data = await analyticsService.getDashboard();
    set({ analyticsData: data });
  },
}));
