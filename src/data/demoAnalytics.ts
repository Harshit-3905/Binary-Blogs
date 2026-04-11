import type { AnalyticsData } from "@/types/userTypes";

export const demoAnalytics: AnalyticsData = {
  pageViews: {
    total: 12547,
    today: 342,
    weekly: 2184,
    monthly: 8976,
  },
  userEngagement: {
    likes: 842,
    comments: 156,
    shares: 78,
    averageTimeOnPage: "3m 24s",
  },
  blogPerformance: [
    {
      id: "blog1",
      title: "Building a React App from Scratch",
      views: 1245,
      engagement: 89,
    },
    {
      id: "blog2",
      title: "TypeScript Tips and Tricks",
      views: 967,
      engagement: 72,
    },
    { id: "blog3", title: "CSS Grid Mastery", views: 856, engagement: 63 },
    {
      id: "blog4",
      title: "Modern JavaScript Techniques",
      views: 721,
      engagement: 54,
    },
  ],
  topReferrers: [
    { source: "Google", visits: 4562, conversionRate: 3.2 },
    { source: "Twitter", visits: 2134, conversionRate: 2.8 },
    { source: "GitHub", visits: 1897, conversionRate: 4.1 },
    { source: "Dev.to", visits: 945, conversionRate: 3.7 },
    { source: "Direct", visits: 842, conversionRate: 2.9 },
  ],
  demographics: {
    age: [
      { group: "18-24", percentage: 18 },
      { group: "25-34", percentage: 32 },
      { group: "35-44", percentage: 27 },
      { group: "45-54", percentage: 15 },
      { group: "55+", percentage: 8 },
    ],
    locations: [
      { country: "United States", percentage: 42 },
      { country: "India", percentage: 12 },
      { country: "United Kingdom", percentage: 8 },
      { country: "Germany", percentage: 6 },
      { country: "Canada", percentage: 5 },
      { country: "Other", percentage: 27 },
    ],
    devices: [
      { type: "Desktop", percentage: 68 },
      { type: "Mobile", percentage: 27 },
      { type: "Tablet", percentage: 5 },
    ],
  },
  growthData: {
    followers: [120, 132, 145, 162, 178, 194, 213, 235, 256, 278, 298, 321],
    subscribers: [45, 52, 58, 63, 72, 79, 86, 95, 103, 113, 124, 135],
    monthlyActiveUsers: [
      324, 356, 402, 456, 512, 578, 642, 712, 792, 867, 934, 1023,
    ],
  },
};
