import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, ArrowLeft, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { getDocumentById } from "@/lib/services/documents";
import { useSupabase } from "@/components/hooks/useSupabase";
import type { KnowledgeDocumentWithContent } from "@/types/knowledge";

interface DocumentViewProps {
  serverId: string;
  documentId: string;
  initialDocument?: KnowledgeDocumentWithContent | null;
  reindexed?: boolean;
  reindexError?: boolean;
}

export function DocumentView({ serverId, documentId, initialDocument, reindexed, reindexError }: DocumentViewProps) {
  const [document, setDocument] = useState<KnowledgeDocumentWithContent | null>(initialDocument || null);
  const [isLoading, setIsLoading] = useState(!initialDocument);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabase();

  useEffect(() => {
    if (!initialDocument && supabase) {
      loadDocument();
    }

    if (reindexed) {
      toast.success("Document is being reindexed. This may take a few moments.");
    }

    if (reindexError) {
      toast.error("Failed to reindex document. Please try again later.");
    }
  }, [supabase]);

  async function loadDocument() {
    if (!supabase) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getDocumentById(serverId, documentId, supabase);
      setDocument(result as KnowledgeDocumentWithContent);
    } catch (err) {
      console.error("Error loading document:", err);
      setError(err instanceof Error ? err.message : "Failed to load document. Please try again later.");
      toast.error("Failed to load document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Format content based on file type
  const getFormattedContent = () => {
    if (!document) return "";

    if (document.fileType === "md") {
      // For markdown, we'd ideally use a proper markdown renderer
      // For now, we'll just render it as HTML
      return <div dangerouslySetInnerHTML={{ __html: document.content }} />;
    } else {
      // Plain text
      return <pre className="whitespace-pre-wrap">{document.content}</pre>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <a
            href={`/servers/${serverId}/knowledge`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Documents
          </a>
        </div>

        {document && (
          <div className="flex gap-2">
            <form method="POST" action={`/servers/${serverId}/knowledge/${documentId}/reindex`}>
              <Button type="submit" variant="outline">
                <RefreshCw className="h-4 w-4 mr-1" />
                Reindex
              </Button>
            </form>
            <a
              href={`/servers/${serverId}/knowledge/${documentId}/edit`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </a>
          </div>
        )}
      </div>

      {reindexed && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-800">
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <div>
              <h3 className="font-medium">Reindexing in progress</h3>
              <p className="text-sm">Document is being reindexed. This may take a few moments.</p>
            </div>
          </div>
        </div>
      )}

      {reindexError && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <div>
              <h3 className="font-medium">Reindexing failed</h3>
              <p className="text-sm">There was an error reindexing the document. Please try again later.</p>
            </div>
          </div>
        </div>
      )}

      {error ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <div>
              <h3 className="font-medium">Error</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <Card>
          <CardContent className="p-6 flex justify-center items-center h-24">
            <div className="animate-spin h-6 w-6 rounded-full border-t-2 border-b-2 border-primary"></div>
            <span className="ml-2">Loading document...</span>
          </CardContent>
        </Card>
      ) : document ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{document.title}</CardTitle>
              <CardDescription>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <div>
                    Type: <span className="uppercase font-medium">{document.fileType}</span>
                  </div>
                  <div>Created: {new Date(document.createdAt).toLocaleString()}</div>
                  <div>Updated: {new Date(document.updatedAt).toLocaleString()}</div>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardContent>{getFormattedContent()}</CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 flex justify-center items-center h-24">
            <div className="animate-spin h-6 w-6 rounded-full border-t-2 border-b-2 border-primary"></div>
            <span className="ml-2">Loading document...</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
