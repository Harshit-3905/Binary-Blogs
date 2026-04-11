import type { TagService } from "@/services/interfaces";
import { mockDelay } from "@/services/mockUtils";
import { mockState } from "./mockState";

/**
 * Featured tags in the mock are derived from the demo blog corpus: we count
 * tag occurrences and return the top 15, falling back to a curated seed list
 * if the corpus happens to be empty. This mirrors what a real backend would
 * do (materialized view of trending tags).
 */
const SEED_TAGS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Vue",
  "Next.js",
  "Node.js",
  "CSS",
  "HTML",
  "Python",
  "Frontend",
  "Backend",
];

export const mockTagService: TagService = {
  async listFeatured(): Promise<string[]> {
    await mockDelay(80);
    const counts = new Map<string, number>();
    for (const blog of mockState.blogs) {
      for (const tag of blog.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    if (counts.size === 0) return SEED_TAGS;
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([name]) => name);
  },
};
