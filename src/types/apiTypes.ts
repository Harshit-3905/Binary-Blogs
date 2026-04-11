/**
 * Request/Response DTOs that define the contract the frontend expects from
 * the backend. The backend spec should be derived from these shapes.
 * See docs/API_CONTRACT.md for the full endpoint list.
 */
import type { Blog, BlogSummary, Comment } from "./blogTypes";
import type { User, AnalyticsData } from "./userTypes";
import type {
  UserPreferences,
  UpdatePreferencesRequest,
} from "./preferencesTypes";

// ---------- Auth ----------
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * The backend issues an httpOnly, Secure, SameSite=Lax cookie on successful
 * auth; the body only carries the user profile. The frontend never reads or
 * stores tokens directly.
 */
export interface AuthResponse {
  user: User;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  avatar?: string;
  socialLinks?: User["socialLinks"];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ---------- Pagination (cursor-based) ----------
/**
 * Cursor-based pagination. The `cursor` is an **opaque string** produced by
 * the server; the client only ever stores it and passes it back verbatim on
 * the next request. This avoids the consistency issues of offset pagination
 * (skipped/duplicated rows under writes) and scales cheaply on keyset
 * indexes.
 */
export interface PaginatedResponse<T> {
  items: T[];
  /** `null` when there are no more pages. */
  nextCursor: string | null;
}

export interface CursorParams {
  /** Server-returned cursor from the previous page, or omitted for page 1. */
  cursor?: string;
  limit?: number;
}

// ---------- Blogs ----------
export interface ListBlogsParams extends CursorParams {
  search?: string;
  tags?: string[];
  authorId?: string;
  sort?: "newest" | "popular";
}

export interface CreateBlogRequest {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
}

export type UpdateBlogRequest = Partial<CreateBlogRequest>;

export interface AddCommentRequest {
  content: string;
}

export interface ToggleLikeResponse {
  liked: boolean;
  likes: number;
}

export interface ToggleBookmarkResponse {
  bookmarked: boolean;
}

// Re-export domain types so callers can import everything from one place.
export type {
  Blog,
  BlogSummary,
  Comment,
  User,
  AnalyticsData,
  UserPreferences,
  UpdatePreferencesRequest,
};
