import type { AnalyticsData } from "@/types/userTypes";

export interface AnalyticsService {
  getDashboard(): Promise<AnalyticsData>;
}
