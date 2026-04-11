import type { AnalyticsService } from "@/services/interfaces";
import type { AnalyticsData } from "@/types/userTypes";
import { demoAnalytics } from "@/data/demoAnalytics";
import { mockDelay } from "@/services/mockUtils";

export const mockAnalyticsService: AnalyticsService = {
  async getDashboard(): Promise<AnalyticsData> {
    await mockDelay();
    return demoAnalytics;
  },
};
