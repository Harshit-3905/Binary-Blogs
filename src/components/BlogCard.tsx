import { Bookmark, Heart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useBlogStore } from "@/store/useBlogStore";
import { type BlogSummary } from "@/types/blogTypes";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { memo } from "react";

interface BlogCardProps {
  blog: BlogSummary;
  index?: number;
}

/**
 * Derive a coarse difficulty label from the (precomputed) reading time so the
 * card can show it without fetching the full content.
 */
function readingTimeToDifficulty(minutes: number): "Easy" | "Medium" | "Advanced" {
  if (minutes >= 10) return "Advanced";
  if (minutes >= 5) return "Medium";
  return "Easy";
}

function BlogCardComponent({ blog, index = 0 }: BlogCardProps) {
  const { toggleBookmark, toggleLike, isLikedByUser, isBookmarkedByUser } =
    useBlogStore();
  const { toast } = useToast();
  const isBookmarked = isBookmarkedByUser(blog.id);

  // Get main category for the category badge
  const mainCategory = blog.tags[0] || "General";

  const readTimeMinutes = blog.readingTime;
  const difficulty = readingTimeToDifficulty(readTimeMinutes);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasBookmarked = isBookmarked;
    toggleBookmark(blog.id).catch(() => undefined);

    toast({
      title: wasBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: wasBookmarked
        ? "The blog has been removed from your bookmarks."
        : "The blog has been added to your bookmarks for later reading.",
      className: "bg-card border-[var(--accent-color)] shadow-lg",
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wasLiked = isLikedByUser(blog.id);
    toggleLike(blog.id).catch(() => undefined);

    toast({
      title: wasLiked ? "Like removed" : "Blog liked!",
      description: wasLiked
        ? "You've removed your like from this blog."
        : "Thank you for your appreciation.",
      className: "bg-card border-[var(--accent-color)] shadow-lg",
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1.0],
      },
    }),
    hover: {
      y: -5,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
  };

  // Generate tag color based on tag name
  const getTagColor = (tag: string) => {
    return "bg-[var(--accent-color)]/10 text-[var(--accent-color-text)] border-[var(--accent-color)]/20";
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      className="blog-card relative overflow-hidden rounded-xl bg-white shadow-md dark:bg-card border border-[var(--accent-color)]/10 hover:border-[var(--accent-color)]/30 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[6px] after:bg-[var(--accent-color)] after:w-full after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300"
    >
      <div className="relative">
        <Link to={`/blog/${blog.slug}`} className="block">
          <div className="relative aspect-video overflow-hidden">
            <motion.img
              src={blog.coverImage}
              alt={blog.title}
              className="h-full w-full object-cover"
              variants={imageVariants}
            />

            {/* Category Badge */}
            <div className="absolute left-3 top-3 z-10">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium bg-white hover:bg-gray-50 dark:bg-[var(--accent-color)]`}
              >
                {mainCategory}
              </span>
            </div>

            {/* Favorite Button */}
            <motion.div
              className="absolute right-3 top-3 z-10"
              variants={buttonVariants}
            >
              <button
                onClick={handleLike}
                className="rounded-full bg-white p-2 shadow-md transition hover:bg-gray-50 dark:bg-card"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isLikedByUser(blog.id)
                      ? "fill-red-600 text-red-600"
                      : "light:text-black dark:text-white"
                  }`}
                />
              </button>
            </motion.div>
          </div>
        </Link>
      </div>

      <div className="px-4 pt-4 pb-1">
        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-2">
          {blog.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs border ${getTagColor(
                tag
              )}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <Link to={`/blog/${blog.slug}`}>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white hover:text-[var(--accent-color-text)] transition-colors line-clamp-1">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="mb-4 text-sm text-gray-600 line-clamp-2 dark:text-gray-300">
            {blog.excerpt}
          </p>
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--accent-color)]/10 dark:border-[var(--accent-color)]/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Reading time */}
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="mr-1 h-4 w-4" />
            <span>{readTimeMinutes} minutes</span>
          </div>

          {/* Difficulty */}
          <div className="flex items-center text-gray-500 text-sm">
            <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-[var(--accent-color)]"></span>
            <span>{difficulty}</span>
          </div>
        </div>

        {/* Bookmark button */}
        <motion.div variants={buttonVariants}>
          <button
            onClick={handleBookmark}
            className="text-gray-400 hover:text-[var(--accent-color-text)]"
          >
            <Bookmark
              className={`h-5 w-5 ${
                isBookmarked
                  ? "fill-[var(--accent-color)] text-[var(--accent-color)]"
                  : ""
              }`}
            />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const BlogCard = memo(BlogCardComponent, (prevProps, nextProps) => {
  // Only re-render when the blog content changes, not when global state changes
  return (
    prevProps.blog.id === nextProps.blog.id &&
    prevProps.blog.bookmarked === nextProps.blog.bookmarked &&
    prevProps.blog.likes === nextProps.blog.likes
  );
});
