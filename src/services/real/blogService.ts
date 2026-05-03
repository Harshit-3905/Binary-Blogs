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
import { ID, Query } from "appwrite";
import { account, databases } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwriteConfig";
import {
  decodeOffsetCursor,
  encodeOffsetCursor,
  getCurrentAccountId,
  readingTimeFromContent,
  requireCurrentAccountId,
  toEpoch,
} from "./shared/serviceUtils";

type BlogDocument = {
  $id: string;
  authorId: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  tags?: string[];
  content: string;
  readingTime: number;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
};

type UserDocument = {
  accountId: string;
  name: string;
  avatar: string;
  bio?: string;
};

type CommentDocument = {
  $id: string;
  blogId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
};

function isPermissionError(err: unknown): boolean {
  const e = err as { code?: number; type?: string; message?: string };
  const message = (e?.message ?? "").toLowerCase();
  return (
    e?.type === "general_unauthorized_scope" ||
    e?.type === "general_access_forbidden" ||
    e?.code === 401 ||
    e?.code === 403 ||
    message.includes("permission") ||
    message.includes("scope")
  );
}

const DATABASE_ID = appwriteConfig.databaseId;
const BLOGS_COLLECTION_ID = appwriteConfig.collections.blogs;
const USERS_COLLECTION_ID = appwriteConfig.collections.users;
const COMMENTS_COLLECTION_ID = appwriteConfig.collections.comments;
const LIKES_COLLECTION_ID = appwriteConfig.collections.likes;
const BOOKMARKS_COLLECTION_ID = appwriteConfig.collections.bookmarks;

async function getUserMap(accountIds: string[]): Promise<Map<string, UserDocument>> {
  const unique = Array.from(new Set(accountIds)).filter(Boolean);
  if (unique.length === 0) return new Map();

  const users = await databases.listDocuments({
    databaseId: DATABASE_ID,
    collectionId: USERS_COLLECTION_ID,
    queries: [Query.equal("accountId", unique), Query.limit(500)],
  });

  const map = new Map<string, UserDocument>();
  for (const doc of users.documents as unknown as UserDocument[]) {
    map.set(doc.accountId, doc);
  }
  return map;
}

async function getBlogBookmarksByUser(userId: string): Promise<Set<string>> {
  const docs = await databases.listDocuments({
    databaseId: DATABASE_ID,
    collectionId: BOOKMARKS_COLLECTION_ID,
    queries: [Query.equal("userId", [userId]), Query.limit(500)],
  });
  return new Set(
    (docs.documents as unknown as Array<{ blogId: string }>).map((d) => d.blogId)
  );
}

async function getBlogLikesByUser(userId: string): Promise<Set<string>> {
  const docs = await databases.listDocuments({
    databaseId: DATABASE_ID,
    collectionId: LIKES_COLLECTION_ID,
    queries: [Query.equal("userId", [userId]), Query.limit(500)],
  });
  return new Set(
    (docs.documents as unknown as Array<{ blogId: string }>).map((d) => d.blogId)
  );
}

async function getCommentCounts(blogIds: string[]): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  for (const blogId of blogIds) {
    const res = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: COMMENTS_COLLECTION_ID,
      queries: [Query.equal("blogId", [blogId]), Query.limit(1)],
    });
    counts.set(blogId, res.total);
  }
  return counts;
}

function toSummary(
  blog: BlogDocument,
  users: Map<string, UserDocument>,
  commentCount: number,
  bookmarked: boolean
): BlogSummary {
  const author = users.get(blog.authorId);
  return {
    id: blog.$id,
    author: {
      id: blog.authorId,
      name: author?.name ?? "Unknown",
      avatar: author?.avatar ?? "",
    },
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    coverImage: blog.coverImage,
    tags: blog.tags ?? [],
    createdAt: toEpoch(blog.createdAt),
    updatedAt: toEpoch(blog.updatedAt),
    views: blog.views ?? 0,
    likes: blog.likes ?? 0,
    commentCount,
    readingTime: blog.readingTime ?? readingTimeFromContent(blog.content ?? ""),
    bookmarked,
  };
}

async function getAllBlogs(): Promise<BlogDocument[]> {
  const res = await databases.listDocuments({
    databaseId: DATABASE_ID,
    collectionId: BLOGS_COLLECTION_ID,
    queries: [Query.limit(500)],
  });
  return res.documents as unknown as BlogDocument[];
}

export const blogService: BlogService = {
  async list(params: ListBlogsParams = {}): Promise<PaginatedResponse<BlogSummary>> {
    const viewerId = await getCurrentAccountId();
    const bookmarks = viewerId ? await getBlogBookmarksByUser(viewerId) : new Set<string>();

    let blogs = await getAllBlogs();

    if (params.authorId) {
      blogs = blogs.filter((b) => b.authorId === params.authorId);
    }
    if (params.tags?.length) {
      blogs = blogs.filter((b) =>
        params.tags!.every((tag) => (b.tags ?? []).includes(tag))
      );
    }
    if (params.search) {
      const term = params.search.toLowerCase();
      blogs = blogs.filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          b.excerpt.toLowerCase().includes(term) ||
          (b.tags ?? []).some((t) => t.toLowerCase().includes(term))
      );
    }

    blogs = [...blogs].sort((a, b) =>
      params.sort === "popular"
        ? (b.likes ?? 0) - (a.likes ?? 0)
        : toEpoch(b.createdAt) - toEpoch(a.createdAt)
    );

    const offset = decodeOffsetCursor(params.cursor);
    const limit = params.limit ?? 6;
    const pageBlogs = blogs.slice(offset, offset + limit);
    const nextCursor =
      offset + limit < blogs.length ? encodeOffsetCursor(offset + limit) : null;

    const users = await getUserMap(pageBlogs.map((b) => b.authorId));
    const commentCounts = await getCommentCounts(pageBlogs.map((b) => b.$id));

    return {
      items: pageBlogs.map((blog) =>
        toSummary(blog, users, commentCounts.get(blog.$id) ?? 0, bookmarks.has(blog.$id))
      ),
      nextCursor,
    };
  },

  listByAuthor(authorId: string, params: CursorParams = {}) {
    return this.list({ ...params, authorId });
  },

  async listBookmarked(params: CursorParams = {}): Promise<PaginatedResponse<BlogSummary>> {
    const userId = await requireCurrentAccountId();
    const bookmarkedIds = await getBlogBookmarksByUser(userId);
    const result = await this.list({ ...params });
    return {
      items: result.items.filter((i) => bookmarkedIds.has(i.id)),
      nextCursor: result.nextCursor,
    };
  },

  async listLiked(params: CursorParams = {}): Promise<PaginatedResponse<BlogSummary>> {
    const userId = await requireCurrentAccountId();
    const likedIds = await getBlogLikesByUser(userId);
    const result = await this.list({ ...params });
    return {
      items: result.items.filter((i) => likedIds.has(i.id)),
      nextCursor: result.nextCursor,
    };
  },

  async getBySlug(slug: string): Promise<Blog | null> {
    const res = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: BLOGS_COLLECTION_ID,
      queries: [Query.equal("slug", [slug]), Query.limit(1)],
    });
    if (res.documents.length === 0) return null;
    return this.getById(res.documents[0].$id);
  },

  async getById(id: string): Promise<Blog | null> {
    try {
      const blogDoc = (await databases.getDocument({
        databaseId: DATABASE_ID,
        collectionId: BLOGS_COLLECTION_ID,
        documentId: id,
      })) as unknown as BlogDocument;

      const [users, comments, viewerId] = await Promise.all([
        getUserMap([blogDoc.authorId]),
        databases.listDocuments({
          databaseId: DATABASE_ID,
          collectionId: COMMENTS_COLLECTION_ID,
          queries: [Query.equal("blogId", [id]), Query.orderAsc("createdAt"), Query.limit(500)],
        }),
        getCurrentAccountId(),
      ]);

      const bookmarkedIds = viewerId ? await getBlogBookmarksByUser(viewerId) : new Set<string>();
      const author = users.get(blogDoc.authorId);
      const mappedComments = (comments.documents as unknown as CommentDocument[]).map((c) => ({
        id: c.$id,
        userId: c.userId,
        userName: c.userName,
        userAvatar: c.userAvatar,
        content: c.content,
        createdAt: toEpoch(c.createdAt),
      }));

      return {
        ...toSummary(
          blogDoc,
          users,
          mappedComments.length,
          bookmarkedIds.has(blogDoc.$id)
        ),
        author: {
          id: blogDoc.authorId,
          name: author?.name ?? "Unknown",
          avatar: author?.avatar ?? "",
          bio: author?.bio ?? "",
        },
        content: blogDoc.content,
        comments: mappedComments,
      };
    } catch (err) {
      const e = err as { code?: number };
      if (e.code === 404) return null;
      throw err;
    }
  },

  async create(payload: CreateBlogRequest): Promise<Blog> {
    const userId = await requireCurrentAccountId();
    const now = new Date().toISOString();
    const created = await databases.createDocument({
      databaseId: DATABASE_ID,
      collectionId: BLOGS_COLLECTION_ID,
      documentId: ID.unique(),
      data: {
        authorId: userId,
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt,
        coverImage: payload.coverImage,
        tags: payload.tags,
        content: payload.content,
        readingTime: readingTimeFromContent(payload.content),
        views: 0,
        likes: 0,
        createdAt: now,
        updatedAt: now,
      },
      permissions: [
        `read("any")`,
        `update("user:${userId}")`,
        `delete("user:${userId}")`,
      ],
    });

    const blog = await this.getById(created.$id);
    if (!blog) throw new Error("Failed to load created blog");
    return blog;
  },

  async update(id: string, payload: UpdateBlogRequest): Promise<Blog> {
    const existing = await this.getById(id);
    if (!existing) throw new Error("Blog not found");

    const nextContent = payload.content ?? existing.content;
    await databases.updateDocument({
      databaseId: DATABASE_ID,
      collectionId: BLOGS_COLLECTION_ID,
      documentId: id,
      data: {
        ...payload,
        readingTime: readingTimeFromContent(nextContent),
        updatedAt: new Date().toISOString(),
      },
    });

    const updated = await this.getById(id);
    if (!updated) throw new Error("Blog not found after update");
    return updated;
  },

  async remove(id: string): Promise<void> {
    await databases.deleteDocument({
      databaseId: DATABASE_ID,
      collectionId: BLOGS_COLLECTION_ID,
      documentId: id,
    });
  },

  async toggleLike(id: string): Promise<ToggleLikeResponse> {
    const userId = await requireCurrentAccountId();
    const existing = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: LIKES_COLLECTION_ID,
      queries: [Query.equal("blogId", [id]), Query.equal("userId", [userId]), Query.limit(1)],
    });

    const blog = (await databases.getDocument({
      databaseId: DATABASE_ID,
      collectionId: BLOGS_COLLECTION_ID,
      documentId: id,
    })) as unknown as BlogDocument;

    let liked = false;
    let likes = blog.likes ?? 0;

    if (existing.documents.length > 0) {
      await databases.deleteDocument({
        databaseId: DATABASE_ID,
        collectionId: LIKES_COLLECTION_ID,
        documentId: existing.documents[0].$id,
      });
      likes = Math.max(0, likes - 1);
    } else {
      await databases.createDocument({
        databaseId: DATABASE_ID,
        collectionId: LIKES_COLLECTION_ID,
        documentId: ID.unique(),
        data: {
          blogId: id,
          userId,
          createdAt: new Date().toISOString(),
        },
      });
      liked = true;
      likes += 1;
    }

    try {
      await databases.updateDocument({
        databaseId: DATABASE_ID,
        collectionId: BLOGS_COLLECTION_ID,
        documentId: id,
        data: { likes },
      });
    } catch (err) {
      // Non-authors may not have update access on blog docs. Keep the action
      // functional via likes collection and return the computed count.
      if (!isPermissionError(err)) throw err;
    }

    return { liked, likes };
  },

  async toggleBookmark(id: string): Promise<ToggleBookmarkResponse> {
    const userId = await requireCurrentAccountId();
    const existing = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: BOOKMARKS_COLLECTION_ID,
      queries: [Query.equal("blogId", [id]), Query.equal("userId", [userId]), Query.limit(1)],
    });

    if (existing.documents.length > 0) {
      await databases.deleteDocument({
        databaseId: DATABASE_ID,
        collectionId: BOOKMARKS_COLLECTION_ID,
        documentId: existing.documents[0].$id,
      });
      return { bookmarked: false };
    }

    await databases.createDocument({
      databaseId: DATABASE_ID,
      collectionId: BOOKMARKS_COLLECTION_ID,
      documentId: ID.unique(),
      data: {
        blogId: id,
        userId,
        createdAt: new Date().toISOString(),
      },
    });

    return { bookmarked: true };
  },

  async addComment(blogId: string, payload: AddCommentRequest): Promise<Comment> {
    const me = await account.get();
    const prefs = (await account.getPrefs()) as { avatar?: string };
    const comment = (await databases.createDocument({
      databaseId: DATABASE_ID,
      collectionId: COMMENTS_COLLECTION_ID,
      documentId: ID.unique(),
      data: {
        blogId,
        userId: me.$id,
        userName: me.name || "User",
        userAvatar: prefs?.avatar || "",
        content: payload.content,
        createdAt: new Date().toISOString(),
      },
    })) as unknown as CommentDocument;

    return {
      id: comment.$id,
      userId: comment.userId,
      userName: comment.userName,
      userAvatar: comment.userAvatar,
      content: comment.content,
      createdAt: toEpoch(comment.createdAt),
    };
  },

  async incrementView(id: string): Promise<void> {
    const blog = (await databases.getDocument({
      databaseId: DATABASE_ID,
      collectionId: BLOGS_COLLECTION_ID,
      documentId: id,
    })) as unknown as BlogDocument;

    await databases.updateDocument({
      databaseId: DATABASE_ID,
      collectionId: BLOGS_COLLECTION_ID,
      documentId: id,
      data: { views: (blog.views ?? 0) + 1 },
    });
  },
};
