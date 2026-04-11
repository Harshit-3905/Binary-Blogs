import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Blog, BlogSummary } from "@/types/blogTypes";
import type {
  CreateBlogRequest,
  ListBlogsParams,
  UpdateBlogRequest,
} from "@/types/apiTypes";
import { blogService } from "@/services";

const DEFAULT_PAGE_SIZE = 6;

type FetchFilters = Pick<ListBlogsParams, "search" | "tags" | "authorId" | "sort">;

export interface BlogStoreState {
  // ---------- Paginated listing (for BlogsPage) ----------
  blogs: BlogSummary[];
  limit: number;
  nextCursor: string | null;
  hasMore: boolean;
  isLoading: boolean;
  filters: FetchFilters;

  // ---------- Cross-view interaction state ----------
  likedBlogIds: string[];
  bookmarkedBlogIds: string[];

  // ---------- Actions: listing ----------
  fetchBlogs: (options?: {
    reset?: boolean;
    limit?: number;
    filters?: FetchFilters;
  }) => Promise<void>;

  // ---------- Actions: CRUD ----------
  /** Returns the full `Blog` from the server. Does not touch the list. */
  addBlog: (payload: CreateBlogRequest) => Promise<Blog>;
  /** Returns the full `Blog` from the server. Does not touch the list. */
  updateBlog: (id: string, payload: UpdateBlogRequest) => Promise<Blog>;
  /** Optimistically removes from the list, rolls back on failure. */
  deleteBlog: (id: string) => Promise<void>;

  // ---------- Actions: interactions ----------
  toggleLike: (id: string) => Promise<void>;
  toggleBookmark: (id: string) => Promise<void>;
  isLikedByUser: (id: string) => boolean;
  isBookmarkedByUser: (id: string) => boolean;
}

export const useBlogStore = create<BlogStoreState>()(
  persist(
    (set, get) => ({
      blogs: [],
      limit: DEFAULT_PAGE_SIZE,
      nextCursor: null,
      hasMore: true,
      isLoading: false,
      filters: {},

      likedBlogIds: [],
      bookmarkedBlogIds: [],

      fetchBlogs: async (options = {}) => {
        if (get().isLoading) return;

        const reset = options.reset ?? false;
        const state = get();
        const limit = options.limit ?? state.limit;
        const filters = options.filters ?? (reset ? {} : state.filters);

        // On reset we send no cursor (first page); otherwise use the
        // server-provided cursor from the previous call.
        if (!reset && !state.hasMore) return;
        const cursor = reset ? undefined : state.nextCursor ?? undefined;

        set({ isLoading: true });
        try {
          const res = await blogService.list({
            ...filters,
            cursor,
            limit,
          });

          // Annotate with the user's local like/bookmark state so UI reads
          // stay consistent across views regardless of what the server
          // reports.
          const { bookmarkedBlogIds } = get();
          const annotated = res.items.map((b) => ({
            ...b,
            bookmarked: bookmarkedBlogIds.includes(b.id) || b.bookmarked,
          }));

          set({
            blogs: reset ? annotated : [...state.blogs, ...annotated],
            limit,
            nextCursor: res.nextCursor,
            hasMore: res.nextCursor !== null,
            filters,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      addBlog: (payload) => blogService.create(payload),

      updateBlog: (id, payload) => blogService.update(id, payload),

      deleteBlog: async (id) => {
        const prev = get().blogs;
        set({ blogs: prev.filter((b) => b.id !== id) });
        try {
          await blogService.remove(id);
        } catch (err) {
          set({ blogs: prev });
          throw err;
        }
      },

      toggleLike: async (id) => {
        const { blogs, likedBlogIds } = get();
        const wasLiked = likedBlogIds.includes(id);

        // Optimistic update
        set({
          likedBlogIds: wasLiked
            ? likedBlogIds.filter((x) => x !== id)
            : [...likedBlogIds, id],
          blogs: blogs.map((b) =>
            b.id === id
              ? { ...b, likes: wasLiked ? b.likes - 1 : b.likes + 1 }
              : b
          ),
        });

        try {
          const res = await blogService.toggleLike(id);
          set((s) => ({
            blogs: s.blogs.map((b) =>
              b.id === id ? { ...b, likes: res.likes } : b
            ),
          }));
        } catch (err) {
          set({ blogs, likedBlogIds });
          throw err;
        }
      },

      toggleBookmark: async (id) => {
        const { blogs, bookmarkedBlogIds } = get();
        const wasBookmarked = bookmarkedBlogIds.includes(id);

        set({
          bookmarkedBlogIds: wasBookmarked
            ? bookmarkedBlogIds.filter((x) => x !== id)
            : [...bookmarkedBlogIds, id],
          blogs: blogs.map((b) =>
            b.id === id ? { ...b, bookmarked: !wasBookmarked } : b
          ),
        });

        try {
          await blogService.toggleBookmark(id);
        } catch (err) {
          set({ blogs, bookmarkedBlogIds });
          throw err;
        }
      },

      isLikedByUser: (id) => get().likedBlogIds.includes(id),
      isBookmarkedByUser: (id) => get().bookmarkedBlogIds.includes(id),
    }),
    {
      name: "blog-store",
      // Persist only user-local interaction state. List data should always
      // come fresh from the service so the UI doesn't drift.
      partialize: (state) => ({
        likedBlogIds: state.likedBlogIds,
        bookmarkedBlogIds: state.bookmarkedBlogIds,
      }),
    }
  )
);
