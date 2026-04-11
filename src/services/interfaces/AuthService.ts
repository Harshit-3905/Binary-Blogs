import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "@/types/apiTypes";
import type { User } from "@/types/userTypes";

export interface AuthService {
  login(payload: LoginRequest): Promise<AuthResponse>;
  signup(payload: SignupRequest): Promise<AuthResponse>;
  guestLogin(): Promise<AuthResponse>;
  logout(): Promise<void>;
  /** Called on app boot to restore the session from the auth cookie. */
  getCurrentUser(): Promise<User | null>;
  updateProfile(payload: UpdateProfileRequest): Promise<User>;
  changePassword(payload: ChangePasswordRequest): Promise<void>;
}
