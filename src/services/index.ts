/**
 * Service selection happens **here and only here**. Components and stores
 * import the concrete services from this barrel.
 *
 * All services are now real Appwrite-backed.
 */
import type {
  AuthService,
  BlogService,
  UserService,
  AnalyticsService,
  PreferencesService,
  TagService,
} from "./interfaces";

export { authService } from "./real/authService";
export { blogService } from "./real/blogService";
export { userService } from "./real/userService";
export { analyticsService } from "./real/analyticsService";
export { preferencesService } from "./real/preferencesService";
export { tagService } from "./real/tagService";

export type {
  AuthService,
  BlogService,
  UserService,
  AnalyticsService,
  PreferencesService,
  TagService,
};
