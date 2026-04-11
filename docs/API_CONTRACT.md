# Frontend → Backend API Contract

This document is **derived from the frontend's data requirements**. Every
endpoint listed here is already wired into `src/services/*` — implementing it
on the backend with the shapes below means zero frontend changes (just flip
`VITE_USE_MOCK_API=false` and set `VITE_API_BASE_URL`).

All requests/responses are `application/json`. Requests are made with
`credentials: "include"`.

## Authentication — cookie based

The backend MUST issue auth via an httpOnly cookie (not a JSON token):

- On `POST /auth/login`, `/auth/signup`, `/auth/guest` — respond
  `Set-Cookie: bb_session=…; HttpOnly; Secure; SameSite=Lax; Path=/`.
- On `POST /auth/logout` — respond `Set-Cookie: bb_session=; Max-Age=0 …`.
- Every authenticated endpoint identifies the user from this cookie; the
  frontend never reads or sends bearer tokens.
- CORS must allow `Access-Control-Allow-Credentials: true` and an explicit
  `Access-Control-Allow-Origin` (not `*`) for the frontend domain.

Type names reference `src/types/`:
- `User`, `AnalyticsData` → `userTypes.ts`
- `Blog`, `BlogSummary`, `Comment`, `AuthorRef` → `blogTypes.ts`
- `UserPreferences` → `preferencesTypes.ts`
- Request DTOs → `apiTypes.ts`

---

## BlogSummary vs Blog

Listing endpoints return the lightweight `BlogSummary`; detail endpoints
return the full `Blog`. This keeps listings memory-efficient even at
thousands of items — the user may browse through hundreds of cards without
the frontend ever holding a single blog's full content.

```ts
interface BlogSummary {
  id: string;
  author: { id, name, avatar };     // no bio
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  views: number;
  likes: number;
  commentCount: number;              // just the count
  readingTime: number;               // precomputed minutes
  bookmarked: boolean;               // per current user
}

interface Blog extends BlogSummary {
  author: { id, name, avatar, bio }; // full author
  content: string;                   // full markdown body
  comments: Comment[];               // full thread
}
```

Backend contract:
- `GET /blogs` and all `list*` endpoints MUST NOT return `content` or
  `comments` fields.
- `readingTime` is computed server-side (e.g. `ceil(wordCount / 200)`).
- `commentCount` is an aggregate.
- `bookmarked` reflects the current authenticated user; it is `false` for
  anonymous requests.

## Cursor pagination

Every `list*` endpoint uses **cursor pagination** (not offset):

```ts
interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;         // null when no more pages
}
```

Query parameters:
- `cursor` (optional) — the opaque string returned by the previous call.
  Omit on the first page.
- `limit` (optional) — page size; the frontend defaults to 6 for the blogs
  listing.

The cursor value is **opaque**: the backend picks its encoding (keyset over
`(created_at, id)` is recommended) and the frontend stores/passes it back
unchanged. This avoids the consistency issues of offset pagination (skipped
or duplicated rows under concurrent writes) and is cheap on any indexed
column.

## Auth

| Method | Path                    | Auth | Request                 | Response       | Used by                              |
| ------ | ----------------------- | ---- | ----------------------- | -------------- | ------------------------------------ |
| POST   | `/auth/login`           | –    | `LoginRequest`          | `AuthResponse` | `AuthPage` login form                |
| POST   | `/auth/signup`          | –    | `SignupRequest`         | `AuthResponse` | `AuthPage` signup form               |
| POST   | `/auth/guest`           | –    | –                       | `AuthResponse` | `AuthPage` "Continue as guest"       |
| POST   | `/auth/logout`          | ✅   | –                       | `204`          | `Header` logout                      |
| GET    | `/auth/me`              | ✅   | –                       | `User` \| 401  | `App.tsx` session restore on boot    |
| PATCH  | `/auth/me`              | ✅   | `UpdateProfileRequest`  | `User`         | profile updates (future UI)          |
| POST   | `/auth/change-password` | ✅   | `ChangePasswordRequest` | `204`          | `SettingsPage`                       |

`AuthResponse = { user: User }` (the cookie is carried in `Set-Cookie`, not
in the JSON).

## Blogs

| Method | Path                    | Auth | Request                                                      | Response                          | Used by                        |
| ------ | ----------------------- | ---- | ------------------------------------------------------------ | --------------------------------- | ------------------------------ |
| GET    | `/blogs`                | –    | query: `search`, `tags[]`, `authorId`, `cursor`, `limit`, `sort` | `PaginatedResponse<BlogSummary>`  | `BlogsPage`, `Index` featured  |
| GET    | `/blogs/slug/:slug`     | –    | –                                                            | `Blog` \| 404                     | `BlogDetailPage`               |
| GET    | `/blogs/:id`            | –    | –                                                            | `Blog` \| 404                     | `EditBlogPage`                 |
| POST   | `/blogs`                | ✅   | `CreateBlogRequest`                                          | `Blog`                            | `NewBlogPage`                  |
| PATCH  | `/blogs/:id`            | ✅   | `UpdateBlogRequest`                                          | `Blog`                            | `EditBlogPage`                 |
| DELETE | `/blogs/:id`            | ✅   | –                                                            | `204`                             | (future)                       |
| POST   | `/blogs/:id/like`       | ✅   | –                                                            | `{ liked, likes }`                | `BlogCard`, `BlogDetailPage`   |
| POST   | `/blogs/:id/bookmark`   | ✅   | –                                                            | `{ bookmarked }`                  | `BlogCard`, `BlogDetailPage`   |
| POST   | `/blogs/:id/comments`   | ✅   | `AddCommentRequest`                                          | `Comment`                         | `BlogDetailPage`               |
| POST   | `/blogs/:id/view`       | –    | –                                                            | `204`                             | `BlogDetailPage` (fire-and-forget) |

Notes:
- `POST /blogs` and `POST /blogs/:id/comments` derive the author from the
  auth cookie — the client never sends `author`.
- `toggleLike` / `toggleBookmark` are server-side idempotent toggles. Clients
  send no body; the response reflects the resulting state.

## Current user's collections

| Method | Path              | Auth | Request              | Response                         | Used by                           |
| ------ | ----------------- | ---- | -------------------- | -------------------------------- | --------------------------------- |
| GET    | `/me/bookmarks`   | ✅   | `cursor`, `limit`    | `PaginatedResponse<BlogSummary>` | `BookmarksPage`, `DashboardPage`  |
| GET    | `/me/likes`       | ✅   | `cursor`, `limit`    | `PaginatedResponse<BlogSummary>` | `ProfilePage` liked tab           |
| GET    | `/me/preferences` | ✅   | –                    | `UserPreferences`                | `App.tsx` on login                |
| PATCH  | `/me/preferences` | ✅   | `UpdatePreferencesRequest` | `UserPreferences`          | `SettingsPage`                    |

## Users

| Method | Path                | Auth | Query             | Response                         | Used by                         |
| ------ | ------------------- | ---- | ----------------- | -------------------------------- | ------------------------------- |
| GET    | `/users/:id`        | –    | –                 | `User`                           | `ProfilePage` (other profiles)  |
| GET    | `/users/:id/blogs`  | –    | `cursor`, `limit` | `PaginatedResponse<BlogSummary>` | `ProfilePage`, `DashboardPage`  |

## Tags

Tag names displayed in filters and pickers come from the backend, so editors
can curate the featured tag list without a frontend release.

| Method | Path             | Auth | Response   | Used by                        |
| ------ | ---------------- | ---- | ---------- | ------------------------------ |
| GET    | `/tags/featured` | –    | `string[]` | `BlogsPage`, `BookmarksPage`   |

Typical backing: a materialized view of the top-N tags by recent blog count,
refreshed on a schedule.

## Analytics

| Method | Path                   | Auth | Response        | Used by         |
| ------ | ---------------------- | ---- | --------------- | --------------- |
| GET    | `/analytics/dashboard` | ✅   | `AnalyticsData` | `DashboardPage` |

---

## Switching from mock to real API

1. Implement the endpoints above.
2. Set in `.env`:
   ```
   VITE_API_BASE_URL=https://<your-host>
   VITE_USE_MOCK_API=false
   ```
3. No component or store changes needed — `src/services/index.ts` is the only
   place that selects between `src/services/mock/*` and `src/services/real/*`.
