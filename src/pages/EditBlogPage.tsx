import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogEditor from "@/components/BlogEditor";
import { useBlogStore } from "@/store/useBlogStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { blogService } from "@/services";
import type { Blog } from "@/types/blogTypes";
import { Loader2 } from "lucide-react";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const { updateBlog } = useBlogStore();
  const { user, isLoggedIn } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!id) return;

    let cancelled = false;
    blogService
      .getById(id)
      .then((found) => {
        if (cancelled) return;
        if (!found) {
          toast({
            title: "Blog not found",
            description: "The blog you're trying to edit doesn't exist.",
            variant: "destructive",
          });
          navigate("/blogs");
          return;
        }
        if (user?.id !== found.author.id) {
          toast({
            title: "Unauthorized",
            description: "You don't have permission to edit this blog.",
            variant: "destructive",
          });
          navigate(`/blog/${found.slug}`);
          return;
        }
        setBlog(found);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isLoggedIn, user, navigate, toast]);

  const handleUpdateBlog = async (blogData: {
    title: string;
    content: string;
    excerpt: string;
    coverImage: string;
    tags: string[];
  }) => {
    if (!blog) return;
    setIsSubmitting(true);

    try {
      const slug = blogData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");

      const updated = await updateBlog(blog.id, {
        ...blogData,
        slug,
        excerpt:
          blogData.excerpt || blogData.content.slice(0, 150) + "...",
      });

      toast({
        title: "Blog updated!",
        description: "Your blog has been successfully updated.",
      });
      navigate(`/blog/${updated.slug}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update blog. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="container-custom py-8">
      <BlogEditor
        initialTitle={blog.title}
        initialContent={blog.content}
        initialExcerpt={blog.excerpt}
        initialCoverImage={blog.coverImage}
        initialTags={blog.tags}
        onSave={handleUpdateBlog}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
