/**
 * Shared in-memory state for all mock services. Kept in a single module so
 * mutations from one mock (e.g. `authService.login`) are visible to other
 * mocks (e.g. `blogService.listBookmarked` which filters by current user).
 *
 * This module only matters while `VITE_USE_MOCK_API=true`. Once real services
 * are selected in `services/index.ts`, nothing imports it.
 */
import { v4 as uuidv4 } from "uuid";
import type { Blog, BlogSummary } from "@/types/blogTypes";
import type { User } from "@/types/userTypes";
import type { UserPreferences } from "@/types/preferencesTypes";
import { demoBlogs } from "@/data/demoBlogs";
import { demoPreferences } from "@/data/demoPreferences";

/**
 * We emulate the httpOnly auth cookie via sessionStorage so that mock-mode
 * reloads behave like real-mode reloads (the "cookie" survives, the user
 * stays logged in). This value is NOT used by the real service layer.
 */
const MOCK_SESSION_KEY = "bb_mock_session_user";

function loadMockSession(): User | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(MOCK_SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function persistMockSession(user: User | null): void {
  if (typeof sessionStorage === "undefined") return;
  if (user) sessionStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
  else sessionStorage.removeItem(MOCK_SESSION_KEY);
}

export interface MockState {
  currentUser: User | null;
  blogs: Blog[];
  /** Per-user sets: userId -> Set of blog ids. */
  likesByUser: Map<string, Set<string>>;
  bookmarksByUser: Map<string, Set<string>>;
  /** Per-user preferences. */
  preferencesByUser: Map<string, UserPreferences>;
}

function hydrateDemoBlog(b: (typeof demoBlogs)[number]): Blog {
  const content = b.content ?? "";
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return {
    ...b,
    readingTime: Math.max(1, Math.ceil(wordCount / 200)),
  } as Blog;
}

export const mockState: MockState = {
  currentUser: loadMockSession(),
  blogs: demoBlogs.map(hydrateDemoBlog),
  likesByUser: new Map(),
  bookmarksByUser: new Map(),
  preferencesByUser: new Map(),
};

export function requireMockUser(): User {
  if (!mockState.currentUser) {
    throw new Error("Not authenticated (mock)");
  }
  return mockState.currentUser;
}

export function getUserLikes(userId: string): Set<string> {
  let set = mockState.likesByUser.get(userId);
  if (!set) {
    set = new Set();
    mockState.likesByUser.set(userId, set);
  }
  return set;
}

export function getUserBookmarks(userId: string): Set<string> {
  let set = mockState.bookmarksByUser.get(userId);
  if (!set) {
    set = new Set();
    mockState.bookmarksByUser.set(userId, set);
  }
  return set;
}

export function getUserPreferences(userId: string): UserPreferences {
  let prefs = mockState.preferencesByUser.get(userId);
  if (!prefs) {
    prefs = structuredClone(demoPreferences);
    mockState.preferencesByUser.set(userId, prefs);
  }
  return prefs;
}

export function findBlogOrThrow(id: string): Blog {
  const blog = mockState.blogs.find((b) => b.id === id);
  if (!blog) throw new Error(`Blog ${id} not found`);
  return blog;
}

/**
 * Turn a full `Blog` into a listing-friendly `BlogSummary`:
 * - strip `content` and `comments[]`
 * - trim `author` to `{id, name, avatar}` (no bio)
 * - attach derived `readingTime` and `commentCount`
 * - attach user-specific `bookmarked` flag
 */
export function toBlogSummary(blog: Blog, viewerId?: string): BlogSummary {
  const wordCount = blog.content ? blog.content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const bookmarked = viewerId
    ? getUserBookmarks(viewerId).has(blog.id)
    : false;
  return {
    id: blog.id,
    author: {
      id: blog.author.id,
      name: blog.author.name,
      avatar: blog.author.avatar,
    },
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    coverImage: blog.coverImage,
    tags: blog.tags,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    views: blog.views,
    likes: blog.likes,
    commentCount: blog.comments?.length ?? 0,
    readingTime,
    bookmarked,
  };
}

/**
 * Opaque cursor encoding. The real backend will use a keyset cursor over an
 * indexed column; we simulate it with a base64-encoded offset. The frontend
 * treats this as opaque — it never parses cursors.
 */
export function encodeCursor(offset: number): string {
  return btoa(JSON.stringify({ o: offset }));
}

export function decodeCursor(cursor: string | undefined): number {
  if (!cursor) return 0;
  try {
    const parsed = JSON.parse(atob(cursor)) as { o?: number };
    return typeof parsed.o === "number" ? parsed.o : 0;
  } catch {
    return 0;
  }
}

export function paginateCursor<T>(
  items: T[],
  cursor: string | undefined,
  limit = 6
): { items: T[]; nextCursor: string | null } {
  const safeLimit = Math.max(1, limit);
  const start = decodeCursor(cursor);
  const slice = items.slice(start, start + safeLimit);
  const end = start + slice.length;
  return {
    items: slice,
    nextCursor: end < items.length ? encodeCursor(end) : null,
  };
}

export { uuidv4 };
