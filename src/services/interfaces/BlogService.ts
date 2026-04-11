import type { Blog, BlogSummary, Comment } from "@/types/blogTypes";
import type {
  ListBlogsParams,
  CursorParams,
  PaginatedResponse,
  CreateBlogRequest,
  UpdateBlogRequest,
  AddCommentRequest,
  ToggleLikeResponse,
  ToggleBookmarkResponse,
} from "@/types/apiTypes";

/**
 * List endpoints return `BlogSummary` (no content, no comments[]) so listings
 * stay memory-efficient even at thousands of items. Detail endpoints return
 * the full `Blog` including `content` and `comments`.
 */
export interface BlogService {
  /** Paginated listing with optional search/tag/author filters. */
  list(params?: ListBlogsParams): Promise<PaginatedResponse<BlogSummary>>;

  /** Blogs written by a given user. */
  listByAuthor(
    authorId: string,
    params?: CursorParams
  ): Promise<PaginatedResponse<BlogSummary>>;

  /** Blogs the current user has bookmarked. Requires auth. */
  listBookmarked(
    params?: CursorParams
  ): Promise<PaginatedResponse<BlogSummary>>;

  /** Blogs the current user has liked. Requires auth. */
  listLiked(params?: CursorParams): Promise<PaginatedResponse<BlogSummary>>;

  getBySlug(slug: string): Promise<Blog | null>;
  getById(id: string): Promise<Blog | null>;

  create(payload: CreateBlogRequest): Promise<Blog>;
  update(id: string, payload: UpdateBlogRequest): Promise<Blog>;
  remove(id: string): Promise<void>;

  toggleLike(id: string): Promise<ToggleLikeResponse>;
  toggleBookmark(id: string): Promise<ToggleBookmarkResponse>;
  addComment(blogId: string, payload: AddCommentRequest): Promise<Comment>;
  incrementView(id: string): Promise<void>;
}
