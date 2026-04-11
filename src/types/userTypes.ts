export type UserRole = "user" | "admin";

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  joinDate: string;
  role: UserRole;
  socialLinks?: SocialLinks;
}

export interface AnalyticsData {
  pageViews: {
    total: number;
    today: number;
    weekly: number;
    monthly: number;
  };
  userEngagement: {
    likes: number;
    comments: number;
    shares: number;
    averageTimeOnPage: string;
  };
  blogPerformance: Array<{
    id: string;
    title: string;
    views: number;
    engagement: number;
  }>;
  topReferrers: Array<{
    source: string;
    visits: number;
    conversionRate: number;
  }>;
  demographics: {
    age: Array<{ group: string; percentage: number }>;
    locations: Array<{ country: string; percentage: number }>;
    devices: Array<{ type: string; percentage: number }>;
  };
  growthData: {
    followers: number[];
    subscribers: number[];
    monthlyActiveUsers: number[];
  };
}
