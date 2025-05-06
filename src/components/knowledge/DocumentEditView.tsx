import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import DocumentForm from "@/components/knowledge/DocumentForm";
import { getDocumentById } from "@/lib/services/documents";
import { useSupabase } from "@/components/hooks/useSupabase";
import type { KnowledgeDocumentWithContent } from "@/types/knowledge";

interface DocumentEditViewProps {
  serverId: string;
  documentId: string;
  initialDocument?: KnowledgeDocumentWithContent | null;
}

export function DocumentEditView({ serverId, documentId, initialDocument }: DocumentEditViewProps) {
  const [document, setDocument] = useState<KnowledgeDocumentWithContent | null>(initialDocument || null);
  const [isLoading, setIsLoading] = useState(!initialDocument);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabase();

  useEffect(() => {
    if (!initialDocument && supabase) {
      loadDocument();
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
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      toast.error("Failed to load document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Edit Document</h1>
        <a
          href={`/servers/${serverId}/knowledge/${documentId}`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Document
        </a>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <div>
              <h3 className="font-medium">Error</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Edit Document Content</CardTitle>
        </CardHeader>
        <CardContent>
          {document ? (
            <DocumentForm
              action={`/servers/${serverId}/knowledge/${documentId}/edit`}
              method="POST"
              serverId={serverId}
              initialData={{
                id: document.id,
                title: document.title,
                content: document.content,
                fileType: document.fileType,
              }}
            />
          ) : isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-6 w-6 rounded-full border-t-2 border-b-2 border-primary"></div>
              <span className="ml-2">Loading document...</span>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
