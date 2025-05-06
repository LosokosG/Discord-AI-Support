import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileTextIcon, PlusIcon, UploadIcon, EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import type { DocumentList, KnowledgeDocument } from "@/types";
import { getDocumentsByServerId, deleteDocument } from "@/lib/services/documents";
import { useSupabase } from "@/components/hooks/useSupabase";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

interface KnowledgeListProps {
  initialDocuments: DocumentList | null;
  serverId: string;
}

export default function DiscordKnowledgeList({ initialDocuments, serverId }: KnowledgeListProps) {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(initialDocuments?.data || []);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const supabase = useSupabase();

  // Load documents on mount
  useEffect(() => {
    if (!supabase) return;

    async function loadDocuments() {
      setIsLoading(true);
      try {
        // Only call the function if supabase is not null
        if (supabase) {
          const result = await getDocumentsByServerId(serverId, { page: 1, pageSize: 100 }, supabase);
          setDocuments(result.data || []);
        }
      } catch (error) {
        console.error("Error loading documents:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDocuments();
  }, [serverId, supabase]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;

    try {
      await deleteDocument(serverId, id, supabase);
      setDocuments((docs) => docs.filter((doc) => doc.id !== id));
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  // Filter documents based on search
  const filteredDocuments = search.trim()
    ? documents.filter((doc) => doc.title.toLowerCase().includes(search.toLowerCase()))
    : documents;

  return (
    <div className="w-full h-full flex flex-col bg-discord-main text-discord-text-normal">
      {/* Header */}
      <div className="flex justify-between items-center p-4 pb-2">
        <h1 className="text-2xl font-bold tracking-tight">Knowledge Base</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-discord-secondary border-discord-border hover:bg-discord-main"
            onClick={() => window.open(`/dashboard/servers/${serverId}/knowledge/upload`, "_self")}
          >
            <UploadIcon className="h-4 w-4 mr-2" />
            Upload File
          </Button>
          <Button
            size="sm"
            className="bg-discord-blurple hover:bg-discord-blurple-hover text-white"
            onClick={() => window.open(`/dashboard/servers/${serverId}/knowledge/new`, "_self")}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <Input
          className="bg-discord-sidebar border-discord-border focus-visible:ring-discord-blurple/30 focus-visible:ring-offset-0 placeholder:text-discord-text-muted"
          placeholder="Search documents..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-discord-blurple"></div>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-10 text-discord-text-muted">
            {search ? "No documents matching your search" : "No documents found. Create your first document!"}
          </div>
        ) : (
          filteredDocuments.map((document) => (
            <DocumentItem
              key={document.id}
              document={document}
              serverId={serverId}
              onDelete={() => handleDelete(document.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface DocumentItemProps {
  document: KnowledgeDocument;
  serverId: string;
  onDelete: () => void;
}

function DocumentItem({ document, serverId, onDelete }: DocumentItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format the date to match Discord style (MM/DD/YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      className={cn(
        "p-4 rounded-md flex flex-col bg-discord-secondary border border-transparent",
        isHovered && "border-discord-border bg-discord-secondary/90"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="bg-discord-main rounded-md p-2 mt-0.5">
            <FileTextIcon className="h-5 w-5 text-discord-text-muted" />
          </div>
          <div>
            <h3 className="font-medium text-discord-text-normal">{document.title}</h3>
            <p className="text-xs text-discord-text-muted mt-1">Updated {formatDate(document.updatedAt)}</p>
            <p className="text-xs mt-3 line-clamp-2 text-discord-text-muted max-w-lg">
              {document.title} - {document.fileType.toUpperCase()} format
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className={cn("flex space-x-1", !isHovered && "opacity-0")}>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-discord-text-muted hover:text-discord-text-normal hover:bg-discord-main"
            onClick={() => window.open(`/dashboard/servers/${serverId}/knowledge/${document.id}`, "_self")}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-discord-text-muted hover:text-discord-text-normal hover:bg-discord-main"
            onClick={() => window.open(`/dashboard/servers/${serverId}/knowledge/${document.id}/edit`, "_self")}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-discord-text-muted hover:text-discord-red hover:bg-discord-main"
            onClick={() => {
              if (confirm(`Are you sure you want to delete "${document.title}"?`)) {
                onDelete();
              }
            }}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
