import type { BlogService } from "@/services/interfaces";
import type { Blog, BlogSummary, Comment } from "@/types/blogTypes";
import type {
  AddCommentRequest,
  CreateBlogRequest,
  CursorParams,
  ListBlogsParams,
  PaginatedResponse,
  ToggleBookmarkResponse,
  ToggleLikeResponse,
  UpdateBlogRequest,
} from "@/types/apiTypes";
import { mockDelay } from "@/services/mockUtils";
import {
  findBlogOrThrow,
  getUserBookmarks,
  getUserLikes,
  mockState,
  paginateCursor,
  requireMockUser,
  toBlogSummary,
  uuidv4,
} from "./mockState";

function applyFilters(blogs: Blog[], params: ListBlogsParams): Blog[] {
  let result = blogs;
  if (params.authorId) {
    result = result.filter((b) => b.author.id === params.authorId);
  }
  if (params.tags?.length) {
    result = result.filter((b) =>
      params.tags!.every((t) => b.tags.includes(t))
    );
  }
  if (params.search) {
    const term = params.search.toLowerCase();
    result = result.filter(
      (b) =>
        b.title.toLowerCase().includes(term) ||
        b.excerpt.toLowerCase().includes(term) ||
        b.tags.some((t) => t.toLowerCase().includes(term))
    );
  }
  if (params.sort === "popular") {
    result = [...result].sort((a, b) => b.views - a.views);
  } else {
    result = [...result].sort((a, b) => b.createdAt - a.createdAt);
  }
  return result;
}

function summariesPage(
  source: Blog[],
  params: CursorParams
): PaginatedResponse<BlogSummary> {
  const viewerId = mockState.currentUser?.id;
  const page = paginateCursor(source, params.cursor, params.limit);
  return {
    items: page.items.map((b) => toBlogSummary(b, viewerId)),
    nextCursor: page.nextCursor,
  };
}

export const mockBlogService: BlogService = {
  async list(
    params: ListBlogsParams = {}
  ): Promise<PaginatedResponse<BlogSummary>> {
    await mockDelay();
    const filtered = applyFilters(mockState.blogs, params);
    return summariesPage(filtered, params);
  },

  async listByAuthor(
    authorId: string,
    params: CursorParams = {}
  ): Promise<PaginatedResponse<BlogSummary>> {
    await mockDelay();
    const filtered = applyFilters(mockState.blogs, { authorId });
    return summariesPage(filtered, params);
  },

  async listBookmarked(
    params: CursorParams = {}
  ): Promise<PaginatedResponse<BlogSummary>> {
    await mockDelay();
    const user = requireMockUser();
    const ids = getUserBookmarks(user.id);
    const filtered = mockState.blogs.filter((b) => ids.has(b.id));
    return summariesPage(filtered, params);
  },

  async listLiked(
    params: CursorParams = {}
  ): Promise<PaginatedResponse<BlogSummary>> {
    await mockDelay();
    const user = requireMockUser();
    const ids = getUserLikes(user.id);
    const filtered = mockState.blogs.filter((b) => ids.has(b.id));
    return summariesPage(filtered, params);
  },

  async getBySlug(slug: string): Promise<Blog | null> {
    await mockDelay(100);
    return mockState.blogs.find((b) => b.slug === slug) ?? null;
  },

  async getById(id: string): Promise<Blog | null> {
    await mockDelay(100);
    return mockState.blogs.find((b) => b.id === id) ?? null;
  },

  async create(payload: CreateBlogRequest): Promise<Blog> {
    await mockDelay();
    const user = requireMockUser();
    const now = Date.now();
    const blog: Blog = {
      id: uuidv4(),
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio ?? "",
      },
      ...payload,
      createdAt: now,
      updatedAt: now,
      views: 0,
      likes: 0,
      bookmarked: false,
      comments: [],
      readingTime: Math.max(
        1,
        Math.ceil(payload.content.trim().split(/\s+/).length / 200)
      ),
    };
    mockState.blogs = [blog, ...mockState.blogs];
    return blog;
  },

  async update(id: string, payload: UpdateBlogRequest): Promise<Blog> {
    await mockDelay();
    const blog = findBlogOrThrow(id);
    const content = payload.content ?? blog.content;
    const updated: Blog = {
      ...blog,
      ...payload,
      updatedAt: Date.now(),
      readingTime: Math.max(
        1,
        Math.ceil(content.trim().split(/\s+/).length / 200)
      ),
    };
    mockState.blogs = mockState.blogs.map((b) => (b.id === id ? updated : b));
    return updated;
  },

  async remove(id: string): Promise<void> {
    await mockDelay(100);
    mockState.blogs = mockState.blogs.filter((b) => b.id !== id);
  },

  async toggleLike(id: string): Promise<ToggleLikeResponse> {
    await mockDelay(80);
    const user = requireMockUser();
    const likes = getUserLikes(user.id);
    const blog = findBlogOrThrow(id);
    if (likes.has(id)) {
      likes.delete(id);
      blog.likes = Math.max(0, blog.likes - 1);
      return { liked: false, likes: blog.likes };
    }
    likes.add(id);
    blog.likes += 1;
    return { liked: true, likes: blog.likes };
  },

  async toggleBookmark(id: string): Promise<ToggleBookmarkResponse> {
    await mockDelay(80);
    const user = requireMockUser();
    const bookmarks = getUserBookmarks(user.id);
    if (bookmarks.has(id)) {
      bookmarks.delete(id);
      return { bookmarked: false };
    }
    bookmarks.add(id);
    return { bookmarked: true };
  },

  async addComment(
    blogId: string,
    payload: AddCommentRequest
  ): Promise<Comment> {
    await mockDelay();
    const user = requireMockUser();
    const comment: Comment = {
      id: uuidv4(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: payload.content,
      createdAt: Date.now(),
    };
    const blog = findBlogOrThrow(blogId);
    blog.comments = [...blog.comments, comment];
    return comment;
  },

  async incrementView(id: string): Promise<void> {
    const blog = mockState.blogs.find((b) => b.id === id);
    if (blog) blog.views += 1;
  },
};
