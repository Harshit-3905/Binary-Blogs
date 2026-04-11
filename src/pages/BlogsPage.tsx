import { useState, useEffect, useRef, useCallback } from "react";
import { BlogCard } from "@/components/BlogCard";
import { TagFilter } from "@/components/TagFilter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBlogStore } from "@/store/useBlogStore";
import { Search, Filter, Loader2 } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { tagService } from "@/services";

const SEARCH_DEBOUNCE_MS = 300;

export default function BlogsPage() {
  const { blogs, hasMore, isLoading, fetchBlogs } = useBlogStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [featuredTags, setFeaturedTags] = useState<string[]>([]);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Featured tag list comes from the backend so editors can curate it without
  // a frontend release.
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

  // Whenever the filters change, reset to page 1 and re-fetch from the server.
  // `searchTerm` is debounced so we don't hammer the API on every keystroke.
  useEffect(() => {
    const handle = setTimeout(() => {
      fetchBlogs({
        reset: true,
        filters: {
          search: searchTerm || undefined,
          tags: selectedTags.length ? selectedTags : undefined,
        },
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchTerm, selectedTags, fetchBlogs]);

  const handleTagSelect = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTags([]);
    setSearchTerm("");
  }, []);

  // Infinite scroll: fetch the next page whenever the sentinel becomes visible.
  useEffect(() => {
    if (!hasMore || isLoading) return;
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchBlogs();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [hasMore, isLoading, fetchBlogs, blogs.length]);

  const staggerContainer = {
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
          <h1 className="text-3xl font-bold mb-4">Explore Blogs</h1>
          <p className="text-muted-foreground">
            Discover the latest articles, tutorials, and insights from our
            community of developers.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
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

      {blogs.length > 0 ? (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {blogs.map((blog, index) => (
                <BlogCard key={blog.id} blog={blog} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>

          {(hasMore || isLoading) && (
            <div
              ref={observerTarget}
              className="h-24 flex items-center justify-center my-4"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm font-medium">
                    Loading more blogs...
                  </span>
                </div>
              ) : (
                <div className="flex space-x-2">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-primary rounded-full"
                      animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <AnimatedSection delay={0.3}>
          <div className="text-center py-12 border rounded-lg bg-background">
            <h3 className="text-xl font-medium mb-2">No blogs found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mt-2 bg-[var(--accent-color)] text-white hover:bg-background hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] border-2 border-transparent"
            >
              Clear All Filters
            </Button>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
}
