import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { getDocumentsByServerId } from "@/lib/services/documents";
import DocumentList from "./DocumentList";
import { useSupabase } from "@/components/hooks/useSupabase";
import type { DocumentList as DocumentListType } from "@/types";

interface KnowledgeViewProps {
  serverId: string;
  initialDocuments?: DocumentListType | null;
}

export function KnowledgeView({ serverId, initialDocuments }: KnowledgeViewProps) {
  const [documents, setDocuments] = useState<DocumentListType | null>(initialDocuments || null);
  const [isLoading, setIsLoading] = useState(!initialDocuments);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabase();

  useEffect(() => {
    if (!supabase && !initialDocuments) {
      // If we don't have initialDocuments and no supabase client, we need to load data
      loadDocuments();
    }
  }, [supabase]);

  async function loadDocuments() {
    if (!supabase) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getDocumentsByServerId(serverId, { page: 1, pageSize: 20 }, supabase);
      setDocuments(result);
    } catch (err) {
      console.error("Error loading documents:", err);
      setError("Failed to load knowledge documents. Please try again later.");
      toast.error("Failed to load documents. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">Manage documents used by AI Support Bot to answer questions</p>
        </div>
        <Button asChild>
          <a href={`/servers/${serverId}/knowledge/new`}>Add Document</a>
        </Button>
      </header>

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
          <CardTitle>Document Library</CardTitle>
          <CardDescription>
            All documents in your knowledge base. The bot uses these to answer questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents ? (
            <DocumentList initialDocuments={documents} serverId={serverId} />
          ) : isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin h-6 w-6 rounded-full border-t-2 border-b-2 border-primary"></div>
              <span className="ml-2">Loading documents...</span>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
