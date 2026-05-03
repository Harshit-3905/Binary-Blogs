import type { TagService } from "@/services/interfaces";
import { Query } from "appwrite";
import { databases } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwriteConfig";

type TagDocument = {
  name: string;
  score: number;
};

type BlogDocument = {
  tags?: string[];
};

const DATABASE_ID = appwriteConfig.databaseId;
const TAGS_COLLECTION_ID = appwriteConfig.collections.tags;
const BLOGS_COLLECTION_ID = appwriteConfig.collections.blogs;

export const tagService: TagService = {
  async listFeatured(): Promise<string[]> {
    const fromTags = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: TAGS_COLLECTION_ID,
      queries: [Query.orderDesc("score"), Query.limit(15)],
    });

    const tagDocs = fromTags.documents as unknown as TagDocument[];
    const populated = tagDocs
      .map((t) => t.name?.trim())
      .filter((name): name is string => Boolean(name));

    if (populated.length > 0) {
      return populated;
    }

    const blogs = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: BLOGS_COLLECTION_ID,
      queries: [Query.limit(500)],
    });

    const counts = new Map<string, number>();
    for (const blog of blogs.documents as unknown as BlogDocument[]) {
      for (const tag of blog.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([name]) => name);
  },
};
