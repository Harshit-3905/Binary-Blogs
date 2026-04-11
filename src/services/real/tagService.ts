import type { TagService } from "@/services/interfaces";
import { apiClient } from "@/lib/apiClient";

export const realTagService: TagService = {
  listFeatured: () => apiClient.get<string[]>("/tags/featured"),
};
