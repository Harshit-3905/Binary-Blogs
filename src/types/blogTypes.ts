/**
 * Author reference as it appears on a blog card / summary. The full profile
 * (with bio, joinDate, etc.) lives on `User` and is only inlined on the
 * complete `Blog` detail payload.
 */
export interface AuthorRef {
  id: string;
  name: string;
  avatar: string;
}

export interface BlogAuthor extends AuthorRef {
  bio: string;
}

export type Comment = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: number;
};

/**
 * Lightweight shape returned by every list endpoint. Critically does NOT
 * include the full markdown body or the comments array — both can be very
 * large and the user may never open the blog. Derived display fields like
 * `readingTime` and `commentCount` are precomputed server-side.
 */
export interface BlogSummary {
  id: string;
  author: AuthorRef;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  views: number;
  likes: number;
  commentCount: number;
  /** Reading time in whole minutes. */
  readingTime: number;
  /** Whether the **current user** has bookmarked this blog. */
  bookmarked: boolean;
}

/**
 * Full blog returned only by `getBySlug` / `getById` (detail page) and by
 * `create` / `update`. Extends `BlogSummary` with the heavy fields.
 */
export interface Blog extends Omit<BlogSummary, "author" | "commentCount"> {
  author: BlogAuthor;
  content: string;
  comments: Comment[];
}
