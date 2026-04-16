import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  ListOrdered,
  List,
  Image as ImageIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Link,
  Minus,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useToast } from "@/hooks/use-toast";
import { DragDropImageUpload } from "@/components/DragDropImageUpload";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { useAuthStore } from "@/store/useAuthStore";

interface BlogEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialCoverImage?: string;
  initialTags?: string[];
  initialExcerpt?: string;
  onSave?: (data: {
    title: string;
    content: string;
    coverImage: string;
    tags: string[];
    excerpt: string;
  }) => void;
  isSubmitting?: boolean;
}

export default function BlogEditor({
  initialTitle = "",
  initialContent = "",
  initialCoverImage = "/images/placeholder.jpg",
  initialTags = [],
  initialExcerpt = "",
  onSave,
  isSubmitting = false,
}: BlogEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [currentTag, setCurrentTag] = useState("");
  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [isLivePreview, setIsLivePreview] = useState(true);
  const { toast } = useToast();
  const { isLoggedIn } = useAuthStore();

  const editorRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Insert markdown syntax around the current selection (or at the cursor).
   * For "wrap" operations (bold, italic, inline code) it wraps the selected
   * text.  For "line-prefix" operations (headings, quote, list) it prepends
   * the prefix at the start of the current line.
   */
  const insertMarkdown = useCallback(
    (before: string, after: string = "") => {
      const textarea = editorRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end);

      const replacement = before + selected + after;
      const newContent =
        content.substring(0, start) + replacement + content.substring(end);

      setContent(newContent);

      // Restore cursor position after React re-renders the textarea value
      requestAnimationFrame(() => {
        textarea.focus();
        const cursorPos = start + before.length + selected.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      });
    },
    [content]
  );

  /** Insert a prefix at the beginning of the current line. */
  const insertLinePrefix = useCallback(
    (prefix: string) => {
      const textarea = editorRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      // Walk backwards to find the start of the current line
      const lineStart = content.lastIndexOf("\n", start - 1) + 1;
      const newContent =
        content.substring(0, lineStart) + prefix + content.substring(lineStart);

      setContent(newContent);

      requestAnimationFrame(() => {
        textarea.focus();
        const cursorPos = start + prefix.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      });
    },
    [content]
  );

  const handleBold = () => insertMarkdown("**", "**");
  const handleItalic = () => insertMarkdown("*", "*");
  const handleInlineCode = () => insertMarkdown("`", "`");
  const handleCodeBlock = () => insertMarkdown("```\n", "\n```");
  const handleH1 = () => insertLinePrefix("# ");
  const handleH2 = () => insertLinePrefix("## ");
  const handleH3 = () => insertLinePrefix("### ");
  const handleQuote = () => insertLinePrefix("> ");
  const handleUnorderedList = () => insertLinePrefix("- ");
  const handleOrderedList = () => insertLinePrefix("1. ");
  const handleLink = () => insertMarkdown("[", "](url)");
  const handleImage = () => insertMarkdown("![alt](", ")");
  const handleHorizontalRule = () => insertMarkdown("\n---\n");

  // Handle tags
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your blog post.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please add some content to your blog post.",
        variant: "destructive",
      });
      return;
    }

    if (tags.length === 0) {
      toast({
        title: "Tags Required",
        description:
          "Please add at least one tag to categorize your blog post.",
        variant: "destructive",
      });
      return;
    }

    if (!coverImage || coverImage === "/images/placeholder.jpg") {
      toast({
        title: "Cover Image Required",
        description: "Please add a cover image for your blog post.",
        variant: "destructive",
      });
      return;
    }

    if (onSave) {
      onSave({
        title,
        content,
        coverImage,
        tags,
        excerpt: excerpt || content.slice(0, 150) + "...",
      });
    }
  };

  // Auto-resize excerpt textarea
  const excerptRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (excerptRef.current) {
      excerptRef.current.style.height = "0px";
      excerptRef.current.style.height = excerptRef.current.scrollHeight + "px";
    }
  }, [excerpt]);

  /** Handle Tab key inside the editor to insert spaces instead of moving focus. */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      insertMarkdown("  ");
    }
  };

  return (
    <div className="editor-container max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center">
          {initialContent ? "Edit Blog Post" : "Create New Blog Post"}
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          {initialContent
            ? "Update your knowledge and ideas"
            : "Share your knowledge and ideas with the world"}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Heading1 className="h-4 w-4 text-[var(--accent-color)]" />
              <Label>Blog Title</Label>
            </div>
            <Input
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl py-6 font-semibold border border-[var(--accent-color)]/20 focus-visible:ring-[var(--accent-color)]"
            />
          </div>

          {/* Cover Image */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="h-4 w-4 text-[var(--accent-color)]" />
              <Label>Cover Image</Label>
            </div>
            <DragDropImageUpload
              onImageSelected={(imageUrl) => setCoverImage(imageUrl)}
              currentImage={coverImage}
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <ListOrdered className="h-4 w-4 text-[var(--accent-color)]" />
              <Label>Tags</Label>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag (e.g., React, Tutorial)"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="flex-1 border border-[var(--accent-color)]/20 focus-visible:ring-[var(--accent-color)]"
              />
              <Button
                type="button"
                onClick={addTag}
                className="bg-[var(--accent-color)] text-white hover:bg-background hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] border-2 border-transparent"
              >
                Add
              </Button>
            </div>

            {/* Tags display */}
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="rounded-full bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 px-3 py-1 text-sm flex items-center gap-1"
                >
                  <span className="text-[var(--accent-color-text)]">{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-500 hover:text-red-500 ml-1 focus:outline-none"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Excerpt */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Quote className="h-4 w-4 text-[var(--accent-color)]" />
              <Label>Excerpt (optional)</Label>
            </div>
            <Textarea
              placeholder="Brief summary of your blog post (if left empty, first few lines will be used)"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              ref={excerptRef}
              className="resize-none"
            />
          </div>

          {/* Live Preview Toggle */}
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id="live-preview"
              checked={isLivePreview}
              onCheckedChange={setIsLivePreview}
              className="data-[state=checked]:bg-[var(--accent-color)]"
            />
            <Label htmlFor="live-preview">Live Preview</Label>
          </div>

          {/* Markdown Toolbar */}
          <div className="bg-muted rounded-t-md p-2 flex flex-wrap gap-1 border border-[var(--accent-color)]/20 border-b-0">
            <Button type="button" size="sm" variant="ghost" onClick={handleBold} title="Bold" className="h-8 px-2 hover:bg-[var(--accent-color)]/10">
              <Bold className="h-4 w-4" />
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={handleItalic} title="Italic" className="h-8 px-2 hover:bg-[var(--accent-color)]/10">
              <Italic className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button type="button" size="sm" variant="ghost" onClick={handleH1} title="Heading 1" className="h-8 px-2 hover:bg-[var(--accent-color)]/10">
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={handleH2} title="Heading 2" className="h-8 px-2 hover:bg-[var(--accent-color)]/10">
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={handleH3} title="Heading 3" className="h-8 px-2 hover:bg-[var(--accent-color)]/10">
              <Heading3 className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button type="button" size="sm" variant="ghost" onClick={handleInlineCode} title="Inline Code" className="h-8 px-2 hover:bg-[var(--accent-color)]/10">
              <Code className="h-4 w-4" />
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={handleCodeBlock} title="Code Block" className="h-8 px-2 hover:bg-[var(--accent-color)]/10 text-xs font-mono">
              {"</>"}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={handleQuote} title="Blockquote" className="h-8 px-2 hover:bg-[var(--accent-color)]/10">
              <Quote className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button type="button" size="sm" variant="ghost" onClick={handleUnorderedList} title="Bullet List" className="h-8 px-2 hover:bg-[var(--accent-color)]/10">
              <List className="h-4 w-4" />
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={handleOrderedList} title="Numbered List" className="h-8 px-2 hover:bg-[var(--accent-color)]/10">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button type="button" size="sm" variant="ghost" onClick={handleLink} title="Link" className="h-8 px-2 hover:bg-[var(--accent-color)]/10">
              <Link className="h-4 w-4" />
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={handleImage} title="Image" className="h-8 px-2 hover:bg-[var(--accent-color)]/10">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={handleHorizontalRule} title="Horizontal Rule" className="h-8 px-2 hover:bg-[var(--accent-color)]/10">
              <Minus className="h-4 w-4" />
            </Button>
          </div>

          {/* Editor Area */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className={`w-full ${isLivePreview ? "lg:w-1/2" : "lg:w-full"}`}>
              <textarea
                ref={editorRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write your blog content in Markdown..."
                className="min-h-[500px] w-full p-4 border border-[var(--accent-color)]/20 rounded-b-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] font-mono text-sm bg-background text-foreground resize-y"
              />
            </div>

            {/* Live Preview — rendered through the same MarkdownRenderer used on BlogDetailPage */}
            {isLivePreview && (
              <div className="w-full lg:w-1/2">
                <div className="border border-[var(--accent-color)]/20 rounded-b-md p-4 min-h-[500px] max-w-none bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
                  {content ? (
                    <MarkdownRenderer content={content} />
                  ) : (
                    <p className="text-muted-foreground italic">
                      Preview will appear here...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="bg-[var(--accent-color)] text-white hover:bg-background hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] border-2 border-transparent"
              disabled={isSubmitting || !isLoggedIn}
            >
              {!isLoggedIn
                ? "Login to Create Post"
                : isSubmitting
                ? initialContent
                  ? "Updating..."
                  : "Publishing..."
                : initialContent
                ? "Update Blog Post"
                : "Publish Blog Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
