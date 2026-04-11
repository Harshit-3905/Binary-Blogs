import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { BlogSummary } from "@/types/blogTypes";
import { motion } from "framer-motion";
import {
  ArrowUp,
  TrendingUp,
  Eye,
  ThumbsUp,
  MessageSquare,
  Bookmark,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useBlogStore } from "@/store/useBlogStore";

interface DashboardChartsProps {
  blogs: BlogSummary[];
}

export function DashboardCharts({ blogs }: DashboardChartsProps) {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  // Add resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine if mobile view (adjust as needed)
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  // Add CSS variables for tooltip styling
  const tooltipStyle = {
    backgroundColor: "hsl(var(--background) / 0.85)",
    backdropFilter: "blur(8px)",
    borderColor: "var(--accent-color)",
    borderRadius: "8px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.2)",
    fontSize: isMobile ? "12px" : "14px",
  };

  // Generate proper demo data for line chart - views over time
  const generateViewsData = () => {
    const data = [];
    const now = new Date();
    let baseViews = 50;
    let trendFactor = 1;

    // For mobile, show fewer data points
    const dataPoints = isMobile ? 14 : 30;

    for (let i = dataPoints; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);

      // Add a slight upward trend with occasional spikes
      if (i % 7 === 0) trendFactor += 0.2; // Weekly growth
      if (i % 10 === 0) baseViews += 30; // Occasional spike from a new post

      // Weekend bump
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const weekendMultiplier = isWeekend ? 1.4 : 1;

      // Random daily fluctuation
      const dailyFluctuation = Math.random() * 30 - 15;

      const views = Math.floor(
        baseViews * trendFactor * weekendMultiplier + dailyFluctuation
      );

      data.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        views: Math.max(10, views), // Ensure at least 10 views
        likes: Math.floor(views * 0.15), // ~15% of viewers like the content
      });
    }

    return data;
  };

  const viewsData = generateViewsData();

  // Generate realistic referrer data
  const referrerData = [
    { name: "Google", value: 42 },
    { name: "Social Media", value: 28 },
    { name: "Direct", value: 16 },
    { name: "Other Blogs", value: 9 },
    { name: "Email", value: 5 },
  ];

  // Format data for bar chart - likes per blog with realistic titles
  const blogTitles = [
    "Getting Started with React Hooks",
    "Building a Modern API with Node.js",
    "CSS Grid Layout Explained",
    "TypeScript Best Practices",
    "Deploying to AWS: A Complete Guide",
  ];

  const likesData = blogTitles.map((title, index) => {
    // Generate a realistic distribution of likes
    const baseValue = 50 - index * 8; // Decreasing trend
    const likes = baseValue + Math.floor(Math.random() * 20);

    return {
      name: isMobile
        ? title.substring(0, 12) + "..."
        : isTablet
        ? title.substring(0, 18) + "..."
        : title.length > 25
        ? title.substring(0, 25) + "..."
        : title,
      likes: likes,
      views: likes * (5 + Math.floor(Math.random() * 3)), // Views are roughly 5-8x likes
    };
  });

  // Format data for pie chart - engagement breakdown
  const totalViews =
    blogs.length > 0 ? blogs.reduce((sum, blog) => sum + blog.views, 0) : 1240;

  const totalLikes =
    blogs.length > 0 ? blogs.reduce((sum, blog) => sum + blog.likes, 0) : 217;

  const totalComments =
    blogs.length > 0
      ? blogs.reduce((sum, blog) => sum + blog.commentCount, 0)
      : 84;

  const totalBookmarks =
    blogs.length > 0 ? blogs.filter((blog) => blog.bookmarked).length : 35;

  const engagementData = [
    { name: "Views", value: totalViews, icon: <Eye className="h-4 w-4" /> },
    {
      name: "Likes",
      value: totalLikes,
      icon: <ThumbsUp className="h-4 w-4" />,
    },
    {
      name: "Comments",
      value: totalComments,
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      name: "Bookmarks",
      value: totalBookmarks,
      icon: <Bookmark className="h-4 w-4" />,
    },
  ];

  // Better colors using the app's color scheme
  const COLORS = [
    "var(--accent-color)",
    "var(--accent-color-bright)",
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
  ];
  const { blogs: storeBlogs } = useBlogStore();
  // Format data for top performing blogs
  const topBlogData = blogs.length > 0 ? blogs : storeBlogs;

  const topBlogs = [...topBlogData]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((blog) => ({
      id: blog.id,
      title: blog.title,
      views: blog.views,
      likes: blog.likes,
      comments: blog.commentCount,
      slug: blog.slug,
    }));

  // Calculate overall stats
  const totalStats = {
    posts: blogs.length || 5,
    totalViews,
    totalLikes,
    totalComments,
    avgViewsPerPost: Math.round(totalViews / (blogs.length || 5)),
    engagementRate: (((totalLikes + totalComments) / totalViews) * 100).toFixed(
      1
    ),
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <motion.div
        className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <div className="p-1 absolute right-3 top-3 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-full">
              <TrendingUp className="h-4 w-4" />
            </div>
            <CardHeader className="pb-2 p-4 sm:p-6">
              <CardDescription>Total Posts</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">
                {totalStats.posts}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <Badge
                  variant="outline"
                  className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium mr-2"
                >
                  <ArrowUp className="h-3 w-3 mr-1" />
                  12%
                </Badge>
                <span className="truncate">vs. previous month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="overflow-hidden">
            <div className="p-1 absolute right-3 top-3 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-full">
              <Eye className="h-4 w-4" />
            </div>
            <CardHeader className="pb-2 p-4 sm:p-6">
              <CardDescription>Total Views</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">
                {totalStats.totalViews.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <Badge
                  variant="outline"
                  className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium mr-2"
                >
                  <ArrowUp className="h-3 w-3 mr-1" />
                  24%
                </Badge>
                <span className="truncate">vs. previous month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="overflow-hidden">
            <div className="p-1 absolute right-3 top-3 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-full">
              <ThumbsUp className="h-4 w-4" />
            </div>
            <CardHeader className="pb-2 p-4 sm:p-6">
              <CardDescription>Views Per Post</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">
                {totalStats.avgViewsPerPost.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <Badge
                  variant="outline"
                  className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium mr-2"
                >
                  <ArrowUp className="h-3 w-3 mr-1" />
                  8%
                </Badge>
                <span className="truncate">vs. previous month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            <div className="p-1 absolute right-3 top-3 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-full">
              <MessageSquare className="h-4 w-4" />
            </div>
            <CardHeader className="pb-2 p-4 sm:p-6">
              <CardDescription>Engagement Rate</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">
                {totalStats.engagementRate}%
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <Badge
                  variant="outline"
                  className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium mr-2"
                >
                  <ArrowUp className="h-3 w-3 mr-1" />
                  5%
                </Badge>
                <span className="truncate">vs. previous month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-1 lg:grid-cols-3">
        <motion.div
          className="col-span-full lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">
                Views & Likes Over Time
              </CardTitle>
              <CardDescription>
                Daily metrics for the past {isMobile ? 14 : 30} days
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={viewsData}
                    margin={{
                      top: 5,
                      right: isMobile ? 5 : 20,
                      left: isMobile ? 0 : 10,
                      bottom: isMobile ? 50 : 25,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="colorViews"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--accent-color)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--accent-color)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorLikes"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--accent-color-bright)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--accent-color-bright)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      tickFormatter={(value) =>
                        isMobile ? value.split(" ")[0] : value
                      }
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={isMobile ? 2 : 1} // Show fewer ticks on mobile
                    />
                    <YAxis
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      width={isMobile ? 30 : 40}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="var(--accent-color)"
                      fill="url(#colorViews)"
                      strokeWidth={2}
                      activeDot={{ r: isMobile ? 4 : 6 }}
                      animationDuration={1500}
                      name="Views"
                    />
                    <Area
                      type="monotone"
                      dataKey="likes"
                      stroke="var(--accent-color-bright)"
                      fill="url(#colorLikes)"
                      strokeWidth={2}
                      activeDot={{ r: isMobile ? 3 : 5 }}
                      animationDuration={1500}
                      name="Likes"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="h-full">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">
                Engagement Breakdown
              </CardTitle>
              <CardDescription>
                Distribution of user interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              <div className="h-[180px] sm:h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      innerRadius={isMobile ? 40 : 60}
                      outerRadius={isMobile ? 60 : 80}
                      paddingAngle={3}
                      dataKey="value"
                      animationDuration={1000}
                      animationBegin={200}
                      stroke="rgba(0,0,0,0.05)"
                      strokeWidth={1}
                    >
                      {engagementData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          style={{
                            filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.1))",
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        `${value.toLocaleString()}`,
                        name,
                      ]}
                      contentStyle={tooltipStyle}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-4">
                {engagementData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center text-xs sm:text-sm"
                  >
                    <span
                      className="w-3 h-3 rounded-full mr-1 sm:mr-2 flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-1 whitespace-nowrap overflow-hidden">
                        {!isMobile && item.icon}
                        <span className="truncate">{item.name}</span>
                      </span>
                      <span className="font-medium text-xs sm:text-sm ml-1">
                        {isMobile
                          ? item.value > 999
                            ? (item.value / 1000).toFixed(1) + "k"
                            : item.value
                          : item.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-full lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">
                Top Performing Blogs
              </CardTitle>
              <CardDescription>
                Based on views, likes, and comments
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-2">
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-medium">
                        Title
                      </th>
                      <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-medium">
                        Views
                      </th>
                      <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-medium">
                        Likes
                      </th>
                      <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-medium">
                        Comments
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topBlogs.map((blog, index) => (
                      <motion.tr
                        key={blog.id}
                        className="border-b last:border-b-0 hover:bg-muted/40 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      >
                        <td className="py-2 px-2 sm:py-3 sm:px-4 max-w-[120px] sm:max-w-[300px] truncate">
                          <a
                            href={`/blog/${blog.slug}`}
                            className="hover:text-[var(--accent-color)] transition-colors"
                          >
                            {isMobile && blog.title.length > 20
                              ? blog.title.substring(0, 20) + "..."
                              : blog.title}
                          </a>
                        </td>
                        <td className="text-right py-2 px-2 sm:py-3 sm:px-4">
                          {isMobile
                            ? blog.views > 999
                              ? (blog.views / 1000).toFixed(1) + "k"
                              : blog.views
                            : blog.views.toLocaleString()}
                        </td>
                        <td className="text-right py-2 px-2 sm:py-3 sm:px-4">
                          {blog.likes.toLocaleString()}
                        </td>
                        <td className="text-right py-2 px-2 sm:py-3 sm:px-4">
                          {blog.comments.toLocaleString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-full lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">
                Traffic Sources
              </CardTitle>
              <CardDescription>Where your readers come from</CardDescription>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              <div className="h-[180px] sm:h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={referrerData}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: isMobile ? 10 : 20,
                      left: isMobile ? 5 : 10,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                      opacity={0.3}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      width={isMobile ? 60 : 100}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Traffic"]}
                      contentStyle={tooltipStyle}
                    />
                    <Bar
                      dataKey="value"
                      fill="var(--accent-color)"
                      radius={[0, 4, 4, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
