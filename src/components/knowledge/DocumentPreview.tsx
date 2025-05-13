import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";

interface DocumentPreviewProps {
  content: string;
  fileType: string;
}

/**
 * Document preview component that renders different formats
 * Currently supports Markdown and plain text with full formatting
 */
export function DocumentPreview({ content, fileType }: DocumentPreviewProps) {
  if (!content) {
    return (
      <div className="text-muted-foreground text-center p-4">
        No content to preview. Add some content to see the preview.
      </div>
    );
  }

  return (
    <div className="border rounded-md p-4 min-h-[300px] prose prose-slate max-w-none overflow-auto dark:prose-invert">
      {fileType === "md" ? (
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex, rehypeHighlight]}>
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <pre className="whitespace-pre-wrap font-mono text-sm p-2 bg-gray-100 dark:bg-gray-800 rounded">{content}</pre>
      )}
    </div>
  );
}
