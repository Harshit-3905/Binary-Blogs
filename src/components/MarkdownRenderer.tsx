import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import Prism from "prismjs";
import "./prism-theme.css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-sass";
import "prismjs/components/prism-less";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-docker";
import "prismjs/components/prism-git";
import "./markdown-styles.css";

/** Map common aliases to Prism grammar names. */
const LANGUAGE_ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  html: "markup",
  xml: "markup",
  py: "python",
  rb: "ruby",
  rs: "rust",
  sh: "bash",
  shell: "bash",
  cs: "csharp",
  yml: "yaml",
};

function resolveLang(raw: string): string {
  const key = raw.toLowerCase();
  return LANGUAGE_ALIASES[key] || key;
}

/** Small React component for the copy button inside code blocks. */
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      className="copy-code-button"
      onClick={handleCopy}
    >
      {copied ? (
        "Copied!"
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

/**
 * Sanitization schema — extends the default to allow `class` on `code` and
 * `span` (needed for Prism token spans injected via `dangerouslySetInnerHTML`
 * inside our custom `code` component).  Everything else (script, iframe,
 * onerror, javascript: urls, etc.) is stripped by rehype-sanitize.
 */
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), "className"],
    span: [...(defaultSchema.attributes?.span || []), "className"],
  },
};

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  /**
   * Custom `code` component for react-markdown.
   *
   * react-markdown renders fenced code blocks as `<pre><code className="language-xxx">`.
   * When the `code` element is inside a `pre` (i.e. it's a block, not inline),
   * we apply Prism.highlight() synchronously — no timeouts, no useEffect, no
   * DOM queries.
   */
  const components = useMemo(
    () => ({
      code({
        className,
        children,
        ...props
      }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
        const langMatch = /language-(\w+)/.exec(className || "");
        const rawLang = langMatch?.[1] || "";
        const lang = resolveLang(rawLang);
        const codeString = String(children).replace(/\n$/, "");

        // Fenced code block with a Prism grammar → highlight synchronously
        if (lang && Prism.languages[lang]) {
          const highlighted = Prism.highlight(
            codeString,
            Prism.languages[lang],
            lang
          );
          return (
            <div className="code-block-wrapper" data-language={lang}>
              <CopyButton code={codeString} />
              <pre className={`language-${lang}`}>
                <code
                  className={`language-${lang}`}
                  dangerouslySetInnerHTML={{ __html: highlighted }}
                />
              </pre>
            </div>
          );
        }

        // Fenced block without a known grammar → plain text block
        if (rawLang || !className) {
          const isBlock =
            codeString.includes("\n") || (!className && rawLang !== "");
          if (isBlock && !className) {
            return (
              <div className="code-block-wrapper" data-language="text">
                <CopyButton code={codeString} />
                <pre>
                  <code>{codeString}</code>
                </pre>
              </div>
            );
          }
        }

        // Inline code
        return (
          <code
            className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
            {...props}
          >
            {children}
          </code>
        );
      },

      // Wrap pre to avoid double-wrapping when our code component already
      // renders a <pre> inside a wrapper div.
      pre({ children }: { children?: React.ReactNode }) {
        // If the child is our code-block-wrapper div, render children directly
        // to avoid <pre><div class="code-block-wrapper"><pre>...
        return <>{children}</>;
      },

      a({
        href,
        children,
        ...props
      }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        children?: React.ReactNode;
      }) {
        return (
          <a
            href={href}
            className="text-[var(--accent-color)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            {children}
          </a>
        );
      },

      img({
        src,
        alt,
        ...props
      }: React.ImgHTMLAttributes<HTMLImageElement>) {
        return (
          <img
            src={src}
            alt={alt}
            className="rounded-md max-w-full my-4"
            {...props}
          />
        );
      },

      blockquote({ children }: { children?: React.ReactNode }) {
        return (
          <blockquote className="border-l-4 border-[var(--accent-color)]/40 pl-4 py-1 my-4 text-muted-foreground italic">
            {children}
          </blockquote>
        );
      },

      h1({ children }: { children?: React.ReactNode }) {
        return (
          <h1 className="text-3xl font-bold my-4 text-foreground">
            {children}
          </h1>
        );
      },
      h2({ children }: { children?: React.ReactNode }) {
        return (
          <h2 className="text-2xl font-bold my-3 text-foreground">
            {children}
          </h2>
        );
      },
      h3({ children }: { children?: React.ReactNode }) {
        return (
          <h3 className="text-xl font-bold my-2 text-foreground">
            {children}
          </h3>
        );
      },
      h4({ children }: { children?: React.ReactNode }) {
        return (
          <h4 className="text-lg font-bold my-2 text-foreground">
            {children}
          </h4>
        );
      },
      h5({ children }: { children?: React.ReactNode }) {
        return (
          <h5 className="text-base font-bold my-2 text-foreground">
            {children}
          </h5>
        );
      },
      h6({ children }: { children?: React.ReactNode }) {
        return (
          <h6 className="text-sm font-bold my-2 text-foreground">
            {children}
          </h6>
        );
      },

      hr() {
        return <hr className="my-6 border-t border-border" />;
      },

      ul({ children }: { children?: React.ReactNode }) {
        return <ul className="my-4 ml-6 list-disc space-y-1">{children}</ul>;
      },
      ol({ children }: { children?: React.ReactNode }) {
        return (
          <ol className="my-4 ml-6 list-decimal space-y-1">{children}</ol>
        );
      },

      p({ children }: { children?: React.ReactNode }) {
        return (
          <p className="my-4 text-foreground">{children}</p>
        );
      },

      table({ children }: { children?: React.ReactNode }) {
        return (
          <div className="my-4 overflow-x-auto">
            <table className="min-w-full border-collapse border border-border">
              {children}
            </table>
          </div>
        );
      },
      th({ children }: { children?: React.ReactNode }) {
        return (
          <th className="border border-border bg-muted px-4 py-2 text-left font-bold">
            {children}
          </th>
        );
      },
      td({ children }: { children?: React.ReactNode }) {
        return (
          <td className="border border-border px-4 py-2">{children}</td>
        );
      },
    }),
    []
  );

  return (
    <div className="max-w-none text-foreground markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
