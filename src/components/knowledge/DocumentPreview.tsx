import React from "react";

interface DocumentPreviewProps {
  content: string;
  fileType: string;
}

/**
 * Document preview component that renders different formats
 * Currently supports Markdown and plain text
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
    <div className="border rounded-md p-4 min-h-[300px] prose prose-slate max-w-none overflow-auto">
      {fileType === "md" ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <pre className="whitespace-pre-wrap">{content}</pre>
      )}
    </div>
  );
}
