const APPWRITE_COLLECTIONS = {
  users: "users",
  blogs: "blogs",
  comments: "comments",
  likes: "likes",
  bookmarks: "bookmarks",
  preferences: "preferences",
  tags: "tags",
} as const;

const APPWRITE_BUCKETS = {
  images: "blog_images",
} as const;

export const appwriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  collections: APPWRITE_COLLECTIONS,
  buckets: APPWRITE_BUCKETS,
} as const;
