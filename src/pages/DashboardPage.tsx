import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { DashboardCharts } from "@/components/DashboardCharts";
import { BlogCard } from "@/components/BlogCard";
import { File, Eye, BookmarkCheck, Heart, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { blogService } from "@/services";
import type { BlogSummary } from "@/types/blogTypes";

export default function DashboardPage() {
  const { user, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [userBlogs, setUserBlogs] = useState<BlogSummary[]>([]);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<BlogSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!user) return;

    let cancelled = false;
    setIsLoading(true);
    Promise.all([
      blogService.listByAuthor(user.id, { limit: 50 }),
      blogService.listBookmarked({ limit: 50 }),
    ])
      .then(([byAuthor, bookmarked]) => {
        if (cancelled) return;
        setUserBlogs(byAuthor.items);
        setBookmarkedBlogs(bookmarked.items);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, user, navigate]);

  if (!isLoggedIn || !user) return null;

  // Calculate stats
  const totalBlogs = userBlogs.length;
  const totalViews = userBlogs.reduce((sum, blog) => sum + blog.views, 0);
  const totalLikes = userBlogs.reduce((sum, blog) => sum + blog.likes, 0);
  const totalBookmarks = bookmarkedBlogs.length;

  const stats = [
    {
      title: "Total Blogs",
      value: totalBlogs,
      icon: <File className="h-5 w-5" />,
      color: "bg-[var(--accent-color)]/10 text-[var(--accent-color)]",
    },
    {
      title: "Total Views",
      value: totalViews,
      icon: <Eye className="h-5 w-5" />,
      color: "bg-[var(--accent-color-bright)]/10 text-[var(--accent-color-bright)]",
    },
    {
      title: "Total Likes",
      value: totalLikes,
      icon: <Heart className="h-5 w-5" />,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Bookmarks",
      value: totalBookmarks,
      icon: <BookmarkCheck className="h-5 w-5" />,
      color: "bg-secondary/10 text-secondary",
    },
  ];

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Here's an overview of your blog
            performance.
          </p>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Blog Analytics</h2>
            </div>
            <DashboardCharts blogs={userBlogs} />
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Recent Blogs</h2>
              {userBlogs.length > 3 && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="gap-1 hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/5"
                >
                  <Link to="/profile">
                    View All <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            {userBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userBlogs.slice(0, 3).map((blog, index) => (
                  <BlogCard key={blog.id} blog={blog} index={index} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    You haven't created any blogs yet.
                  </p>
                  <Button asChild>
                    <Link
                      to="/new-blog"
                      className="gap-2 bg-[var(--accent-color)] text-white hover:bg-background hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] border-2 border-transparent"
                    >
                      Create Your First Blog
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Bookmarked Blogs</h2>
              {bookmarkedBlogs.length > 3 && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="gap-1 hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/5"
                >
                  <Link to="/bookmarks">
                    View All <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            {bookmarkedBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedBlogs.slice(0, 3).map((blog, index) => (
                  <BlogCard key={blog.id} blog={blog} index={index} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    You don't have any bookmarked blogs yet.
                  </p>
                  <Button
                    asChild
                    className="gap-2 bg-[var(--accent-color)] text-white hover:bg-background hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] border-2 border-transparent"
                  >
                    <Link to="/blogs">Browse Blogs</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
