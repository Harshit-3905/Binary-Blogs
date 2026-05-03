import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  Bookmark,
  MessageSquare,
  Share2,
  Edit,
  Calendar,
  Eye,
  ArrowLeft,
  Clock,
  ThumbsUp,
  Loader2,
} from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { useBlogStore } from "@/store/useBlogStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { blogService } from "@/services";
import type { Blog, BlogSummary } from "@/types/blogTypes";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    toggleBookmark,
    toggleLike,
    isLikedByUser,
    isBookmarkedByUser,
  } = useBlogStore();
  const { user, isLoggedIn } = useAuthStore();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reference to content div for scrolling
  const contentRef = useRef<HTMLDivElement>(null);
  const viewIncremented = useRef(false);

  // Fetch the blog directly by slug so we always hit it regardless of what
  // the paginated listing currently holds.
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setIsLoading(true);

    blogService
      .getBySlug(slug)
      .then(async (found) => {
        if (cancelled) return;
        setBlog(found);
        if (found) {
          const related = await blogService
            .list({ tags: found.tags, limit: 4 })
            .then((r) =>
              r.items.filter((b) => b.id !== found.id).slice(0, 3)
            )
            .catch(() => []);
          if (!cancelled) setRelatedBlogs(related);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!blog) return;

    // Track scroll progress
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [blog]);

  // Fire-and-forget view increment once per mount.
  useEffect(() => {
    if (blog && !viewIncremented.current) {
      viewIncremented.current = true;
      blogService.incrementView(blog.id).catch(() => undefined);
    }
  }, [blog]);

  // Scroll to comments section
  const scrollToComments = () => {
    if (contentRef.current) {
      setShowCommentForm(true);
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container-custom py-20 flex flex-col items-center justify-center min-h-[90vh]">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--accent-color)] mb-4" />
        <p className="text-muted-foreground">Loading blog content...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog not found</h1>
        <p className="text-muted-foreground mb-6">
          The blog you're looking for doesn't exist or has been removed.
        </p>
        <Button
          variant="default"
          asChild
          className="bg-[var(--accent-color)] text-white hover:bg-background hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] border-2 border-transparent"
        >
          <Link to="/blogs">Browse all blogs</Link>
        </Button>
      </div>
    );
  }

  const handleLike = () => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please login to like this blog.",
        variant: "destructive",
      });
      return;
    }

    const wasLiked = isLikedByUser(blog.id);
    // Optimistic: update local blog count so the UI reflects the change.
    setBlog((b) => (b ? { ...b, likes: b.likes + (wasLiked ? -1 : 1) } : b));
    toggleLike(blog.id).catch((err: unknown) => {
      setBlog((b) => (b ? { ...b, likes: b.likes + (wasLiked ? 1 : -1) } : b));
      toast({
        title: "Failed to update like",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
      return;
    });
    toast({
      title: wasLiked ? "Blog unliked" : "Blog liked!",
      description: wasLiked
        ? "You have unliked this blog."
        : "Thank you for your appreciation.",
    });
  };

  const handleBookmark = () => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please login to bookmark this blog.",
        variant: "destructive",
      });
      return;
    }
    const wasBookmarked = isBookmarkedByUser(blog.id);
    toggleBookmark(blog.id).catch((err: unknown) =>
      toast({
        title: "Failed to update bookmark",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      })
    );
    toast({
      title: wasBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: wasBookmarked
        ? "The blog has been removed from your bookmarks."
        : "The blog has been added to your bookmarks for later reading.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Blog link has been copied to clipboard.",
    });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please login to comment on this blog.",
        variant: "destructive",
      });
      return;
    }

    if (!commentText.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something before submitting.",
        variant: "destructive",
      });
      return;
    }

    blogService
      .addComment(blog.id, { content: commentText })
      .then((comment) => {
        setBlog((b) =>
          b ? { ...b, comments: [...b.comments, comment] } : b
        );
        setCommentText("");
        toast({
          title: "Comment added",
          description: "Your comment has been posted successfully.",
        });
      })
      .catch((err: unknown) =>
        toast({
          title: "Failed to post comment",
          description: err instanceof Error ? err.message : "Please try again.",
          variant: "destructive",
        })
      );
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  // Get reading time
  const readingTime = blog.readingTime;

  return (
    <div className="min-h-screen relative pb-12">
      {/* Scroll Progress Bar */}
      <div className="fixed top-14 left-0 right-0 z-50">
        <Progress
          value={scrollProgress}
          className="h-1 rounded-none bg-muted"
          style={
            {
              "--progress-background": "var(--accent-color)",
            } as React.CSSProperties
          }
        />
      </div>

      {/* Back Button */}
      <div className="container-custom py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-1 hover:gap-2 transition-all hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to blogs</span>
        </Button>
      </div>

      {/* Blog Header */}
      <div className="relative">
        <div className="aspect-video sm:aspect-[3/1] relative overflow-hidden rounded-none sm:rounded-lg mx-0 sm:mx-4">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-70"></div>

          {/* Floating action buttons for mobile */}
          <div className="absolute bottom-4 right-4 flex gap-2 sm:hidden">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={handleLike}
                className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isLikedByUser(blog.id)
                      ? "fill-[var(--accent-color)] text-[var(--accent-color)]"
                      : ""
                  }`}
                />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={handleBookmark}
                className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
              >
                <Bookmark
                  className={`h-4 w-4 ${
                    isBookmarkedByUser(blog.id)
                      ? "fill-[var(--accent-color)] text-[var(--accent-color)]"
                      : ""
                  }`}
                />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="container-custom relative -mt-16 sm:-mt-24 mb-8">
          <motion.div
            className="bg-background border rounded-lg shadow-lg p-4 md:p-8"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag, index) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)]/20 text-[var(--accent-color)] border-2 border-[var(--accent-color)]/20"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {blog.title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-[var(--accent-color)]/20">
                  <AvatarImage
                    src={blog.author.avatar}
                    alt={blog.author.name}
                  />
                  <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{blog.author.name}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{readingTime} min read</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{blog.views} views</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop action buttons */}
              <div className="hidden sm:flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    className="rounded-full flex items-center gap-1 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10"
                  >
                    <ThumbsUp
                      className={`h-4 w-4 ${
                        isLikedByUser(blog.id)
                          ? "fill-[var(--accent-color)] text-[var(--accent-color)]"
                          : ""
                      }`}
                    />
                    <span>{blog.likes}</span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBookmark}
                    className="rounded-full flex items-center gap-1 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10"
                  >
                    <Bookmark
                      className={`h-4 w-4 ${
                        isBookmarkedByUser(blog.id)
                          ? "fill-[var(--accent-color)] text-[var(--accent-color)]"
                          : ""
                      }`}
                    />
                    <span>{isBookmarkedByUser(blog.id) ? "Saved" : "Save"}</span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="rounded-full flex items-center gap-1 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={scrollToComments}
                    className="rounded-full flex items-center gap-1 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{blog.comments.length}</span>
                  </Button>
                </motion.div>
                {isLoggedIn && user?.id === blog.author.id && (
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/edit-blog/${blog.id}`)}
                      className="rounded-full bg-[var(--accent-color)] text-white hover:bg-background hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] border-2 border-transparent px-2 flex items-center shrink-0 cursor-pointer transition-colors text-sm"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container-custom mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="col-span-1 lg:col-span-3">
            <div className="bg-background rounded-lg border p-4 md:p-6 lg:p-8 shadow-sm">
              {/* FIX: Enhanced styling for markdown content to ensure visibility */}
              <div
                className="markdown-content w-full max-w-none text-foreground inline-block
                  prose dark:prose-invert min-h-[200px]"
              >
                {blog?.content && <MarkdownRenderer content={blog.content} />}
              </div>
            </div>

            {/* Author Bio - moved inside the main content column */}
            <div className="mt-8 bg-muted/30 border rounded-lg p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <Avatar className="h-16 w-16 border-2 border-[var(--accent-color)]/20">
                  <AvatarImage
                    src={blog.author.avatar}
                    alt={blog.author.name}
                  />
                  <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">
                    About {blog.author.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {blog.author.bio ||
                      "Tech enthusiast and avid writer sharing insights on the latest technologies and development practices."}
                  </p>
                </div>
              </div>
            </div>

            {/* Comments Section - moved inside the main content column */}
            <div className="mt-8" ref={contentRef}>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5" />
                Comments ({blog.comments.length})
              </h3>

              <AnimatePresence>
                {(showCommentForm || blog.comments.length > 0) && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSubmitComment}
                    className="mb-6"
                  >
                    <Textarea
                      placeholder={
                        isLoggedIn ? "Write a comment..." : "Login to comment"
                      }
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="mb-2 focus-visible:ring-[var(--accent-color)] border-[var(--accent-color)]/20"
                      disabled={!isLoggedIn}
                    />
                    <Button
                      type="submit"
                      disabled={!isLoggedIn || !commentText.trim()}
                      className="bg-[var(--accent-color)] text-white hover:bg-background hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] border-2 border-transparent h-10 px-4 rounded-md flex items-center shrink-0 font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    >
                      {isLoggedIn ? "Post Comment" : "Login to Comment"}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>

              {!showCommentForm && blog.comments.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-dashed rounded-lg p-6 text-center mb-6"
                >
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    No comments yet. Start the conversation!
                  </p>
                  <Button onClick={() => setShowCommentForm(true)}>
                    Write a Comment
                  </Button>
                </motion.div>
              )}

              {blog.comments.length > 0 && (
                <div className="space-y-4">
                  {blog.comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      className="border rounded-lg p-4 hover:border-[var(--accent-color)]/20 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={comment.userAvatar}
                            alt={comment.userName}
                          />
                          <AvatarFallback>
                            {comment.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{comment.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="pl-11">{comment.content}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:sticky lg:top-20 space-y-8 col-span-1 h-fit">
            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedBlogs.map((relatedBlog) => (
                    <BlogCard key={relatedBlog.id} blog={relatedBlog} />
                  ))}
                </div>
              </div>
            )}

            {/* Article Tagcloud on desktop */}
            <div>
              <h3 className="text-lg font-medium mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-[var(--accent-color)]/10 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Related Blogs for Mobile */}
          {relatedBlogs.length > 0 && (
            <div className="lg:hidden col-span-1">
              <h3 className="text-lg font-medium mb-4">Related Articles</h3>
              <div className="space-y-4">
                {relatedBlogs.map((relatedBlog) => (
                  <BlogCard key={relatedBlog.id} blog={relatedBlog} />
                ))}
              </div>
            </div>
          )}

          {/* Mobile Tags */}
          <div className="lg:hidden col-span-1">
            <h3 className="text-lg font-medium mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-[var(--accent-color)]/10 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/20"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Floating action bar for smaller screens */}
          <div className="sticky bottom-4 lg:hidden flex justify-center mt-4 col-span-1">
            <div className="bg-background/90 backdrop-blur border rounded-full shadow-lg p-1 flex items-center space-x-1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className="rounded-full flex items-center gap-1 h-9 hover:bg-[var(--accent-color)]/20 hover:text-[var(--accent-color)]"
                >
                  <ThumbsUp
                    className={`h-4 w-4 ${
                      isLikedByUser(blog.id)
                        ? "fill-[var(--accent-color)] text-[var(--accent-color)]"
                        : ""
                    }`}
                  />
                  <span className="text-sm">{blog.likes}</span>
                </Button>
              </motion.div>

              <Separator orientation="vertical" className="h-6" />

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={scrollToComments}
                  className="rounded-full flex items-center gap-1 h-9 hover:bg-[var(--accent-color)]/20 hover:text-[var(--accent-color)]"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">{blog.comments.length}</span>
                </Button>
              </motion.div>

              <Separator orientation="vertical" className="h-6" />

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className="rounded-full h-9 hover:bg-[var(--accent-color)]/20 hover:text-[var(--accent-color)]"
                >
                  <Bookmark
                    className={`h-4 w-4 ${
                      isBookmarkedByUser(blog.id)
                        ? "fill-[var(--accent-color)] text-[var(--accent-color)]"
                        : ""
                    }`}
                  />
                  <span className="text-sm ml-1">
                    {isBookmarkedByUser(blog.id) ? "Saved" : "Save"}
                  </span>
                </Button>
              </motion.div>

              {isLoggedIn && user?.id === blog.author.id && (
                <>
                  <Separator orientation="vertical" className="h-6" />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/edit-blog/${blog.id}`)}
                      className="rounded-full h-9 hover:bg-[var(--accent-color)]/20 hover:text-[var(--accent-color)]"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </>
              )}

              <Separator orientation="vertical" className="h-6" />

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="rounded-full h-9 hover:bg-[var(--accent-color)]/20 hover:text-[var(--accent-color)]"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
