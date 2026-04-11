import { useEffect, useState } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { BlogCard } from "@/components/BlogCard";
import { Bookmark, BookmarkPlus, Search, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { TagFilter } from "@/components/TagFilter";
import { Badge } from "@/components/ui/badge";
import { blogService, tagService } from "@/services";
import type { BlogSummary } from "@/types/blogTypes";

export default function BookmarksPage() {
  const { bookmarkedBlogIds } = useBlogStore();
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<BlogSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [featuredTags, setFeaturedTags] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    tagService
      .listFeatured()
      .then((tags) => {
        if (!cancelled) setFeaturedTags(tags);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  // Fetch bookmarked blogs from the server whenever the set of bookmarks
  // changes (optimistic toggles in the store trigger a re-fetch for the
  // authoritative list).
  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    setIsLoading(true);
    blogService
      .listBookmarked({ limit: 50 })
      .then((res) => {
        if (!cancelled) setBookmarks(res.items);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, bookmarkedBlogIds.length]);

  // Client-side search/tag filter on the already-fetched bookmarks (the
  // bookmark list is typically small, so pagination on top of it isn't worth
  // the complexity).
  const filteredBookmarks = bookmarks.filter((blog) => {
    const matchesSearch =
      searchTerm === "" ||
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => blog.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="container-custom py-8 md:py-12">
      <AnimatedSection>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-primary" />
            Your Bookmarks
          </h1>
          <p className="text-muted-foreground">
            Access your saved blogs for later reading.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="hidden md:block">
          <TagFilter
            tags={featuredTags}
            selectedTags={selectedTags}
            onTagSelect={handleTagSelect}
          />
        </div>

        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="text-sm text-muted-foreground mr-1 flex items-center">
              <Filter className="h-3.5 w-3.5 mr-1" /> Active filters:
            </div>
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="pl-2 pr-1 py-1 flex items-center gap-1 border border-[var(--accent-color)]/20"
              >
                {tag}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1 rounded-full"
                  onClick={() => handleTagSelect(tag)}
                >
                  ✕
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </AnimatedSection>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredBookmarks.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredBookmarks.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <AnimatedSection>
          <div className="text-center py-16 bg-muted/30 rounded-lg border animate-fade-in">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <BookmarkPlus className="h-12 w-12 mx-auto mb-4 text-primary/70" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">No bookmarks yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              You haven't bookmarked any blogs yet. Browse through our
              collection and save your favorites for later reading.
            </p>
            <Button
              onClick={() => navigate("/blogs")}
              className="inline-flex items-center justify-center gap-2 bg-[var(--accent-color)] text-white hover:bg-background hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] border-2 border-transparent"
            >
              <BookmarkPlus className="h-4 w-4" />
              Explore Blogs
            </Button>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
}
