/**
 * Service selection happens **here and only here**. Components and stores
 * import the concrete services from this barrel; they never know whether the
 * underlying implementation is mock or real.
 *
 * Toggle via `VITE_USE_MOCK_API` in `.env` (see `.env.example`). To remove the
 * mock layer once the backend is stable, delete `src/services/mock/` and the
 * lines that reference it below.
 */
import { USE_MOCK_API } from "@/lib/apiClient";

import type {
  AuthService,
  BlogService,
  UserService,
  AnalyticsService,
  PreferencesService,
  TagService,
} from "./interfaces";

import { mockAuthService } from "./mock/authService";
import { mockBlogService } from "./mock/blogService";
import { mockUserService } from "./mock/userService";
import { mockAnalyticsService } from "./mock/analyticsService";
import { mockPreferencesService } from "./mock/preferencesService";
import { mockTagService } from "./mock/tagService";

import { realAuthService } from "./real/authService";
import { realBlogService } from "./real/blogService";
import { realUserService } from "./real/userService";
import { realAnalyticsService } from "./real/analyticsService";
import { realPreferencesService } from "./real/preferencesService";
import { realTagService } from "./real/tagService";

export const authService: AuthService = USE_MOCK_API
  ? mockAuthService
  : realAuthService;

export const blogService: BlogService = USE_MOCK_API
  ? mockBlogService
  : realBlogService;

export const userService: UserService = USE_MOCK_API
  ? mockUserService
  : realUserService;

export const analyticsService: AnalyticsService = USE_MOCK_API
  ? mockAnalyticsService
  : realAnalyticsService;

export const preferencesService: PreferencesService = USE_MOCK_API
  ? mockPreferencesService
  : realPreferencesService;

export const tagService: TagService = USE_MOCK_API
  ? mockTagService
  : realTagService;

export type {
  AuthService,
  BlogService,
  UserService,
  AnalyticsService,
  PreferencesService,
  TagService,
};
