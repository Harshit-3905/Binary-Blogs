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
import { ApiError, apiClient } from "@/lib/apiClient";

export const realBlogService: BlogService = {
  list: (params: ListBlogsParams = {}) =>
    apiClient.get<PaginatedResponse<BlogSummary>>("/blogs", { ...params }),

  listByAuthor: (authorId: string, params: CursorParams = {}) =>
    apiClient.get<PaginatedResponse<BlogSummary>>(
      `/users/${authorId}/blogs`,
      { ...params }
    ),

  listBookmarked: (params: CursorParams = {}) =>
    apiClient.get<PaginatedResponse<BlogSummary>>("/me/bookmarks", {
      ...params,
    }),

  listLiked: (params: CursorParams = {}) =>
    apiClient.get<PaginatedResponse<BlogSummary>>("/me/likes", { ...params }),

  async getBySlug(slug: string): Promise<Blog | null> {
    try {
      return await apiClient.get<Blog>(
        `/blogs/slug/${encodeURIComponent(slug)}`
      );
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    }
  },

  async getById(id: string): Promise<Blog | null> {
    try {
      return await apiClient.get<Blog>(`/blogs/${id}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    }
  },

  create: (payload: CreateBlogRequest) =>
    apiClient.post<Blog>("/blogs", payload),

  update: (id: string, payload: UpdateBlogRequest) =>
    apiClient.patch<Blog>(`/blogs/${id}`, payload),

  remove: (id: string) => apiClient.del<void>(`/blogs/${id}`),

  toggleLike: (id: string) =>
    apiClient.post<ToggleLikeResponse>(`/blogs/${id}/like`),

  toggleBookmark: (id: string) =>
    apiClient.post<ToggleBookmarkResponse>(`/blogs/${id}/bookmark`),

  addComment: (blogId: string, payload: AddCommentRequest) =>
    apiClient.post<Comment>(`/blogs/${blogId}/comments`, payload),

  incrementView: (id: string) => apiClient.post<void>(`/blogs/${id}/view`),
};
