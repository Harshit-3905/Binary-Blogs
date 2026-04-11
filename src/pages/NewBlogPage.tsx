import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogEditor from "@/components/BlogEditor";
import { useBlogStore } from "@/store/useBlogStore";
import { useToast } from "@/hooks/use-toast";

export default function NewBlogPage() {
  const [title] = useState("");
  const [content] = useState("");
  const [coverImage] = useState("");
  const [tags] = useState<string[]>([]);
  const [excerpt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addBlog } = useBlogStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveBlog = async (blogData: {
    title: string;
    content: string;
    coverImage: string;
    tags: string[];
    excerpt: string;
  }) => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Generate slug from title
      const slug = blogData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");

      const created = await addBlog({
        title: blogData.title,
        slug,
        content: blogData.content,
        excerpt:
          blogData.excerpt || blogData.content.substring(0, 150) + "...",
        coverImage: blogData.coverImage,
        tags: blogData.tags,
      });

      toast({
        title: "Blog published!",
        description: "Your blog has been successfully published.",
      });

      navigate(`/blog/${created.slug}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish blog. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-custom py-8">
      <BlogEditor
        initialTitle={title}
        initialContent={content}
        initialCoverImage={coverImage}
        initialTags={tags}
        initialExcerpt={excerpt}
        onSave={handleSaveBlog}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
