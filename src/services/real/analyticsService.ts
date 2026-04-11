import type { AnalyticsService } from "@/services/interfaces";
import type { AnalyticsData } from "@/types/userTypes";
import { apiClient } from "@/lib/apiClient";

export const realAnalyticsService: AnalyticsService = {
  getDashboard: () => apiClient.get<AnalyticsData>("/analytics/dashboard"),
};
