import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileTextIcon,
  BookOpenIcon,
  SearchIcon,
  FilePlusIcon,
  SortAscIcon,
  ArrowUpDown,
  Clock,
  Sparkles,
  Pencil,
  Trash,
} from "lucide-react";
import type { DocumentList, KnowledgeDocument } from "@/types";
import { getDocumentsByServerId } from "@/lib/services/documents";
import { documentService } from "@/lib/services/documentService";
import { useSupabase } from "@/components/hooks/useSupabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface KnowledgeListProps {
  initialDocuments: DocumentList | null;
  serverId: string;
  onEditDocument?: (documentId: string) => void;
}

export default function DiscordKnowledgeList({ initialDocuments, serverId, onEditDocument }: KnowledgeListProps) {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(initialDocuments?.data || []);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "updatedAt">("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
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

  // Toggle sort order
  const toggleSort = (field: "title" | "updatedAt") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await documentService.deleteDocument(serverId, id);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || response.statusText || "Failed to delete document");
      }

      setDocuments((docs) => docs.filter((doc) => doc.id !== id));
      toast.success("Document deleted successfully", {
        style: { background: "#2d7d46", color: "white" },
        position: "top-center",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete document", {
        style: { background: "#da373c", color: "white" },
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit document
  const handleEdit = (documentId: string) => {
    setActiveDocId(documentId); // Set active document for animation

    if (onEditDocument) {
      setTimeout(() => {
        onEditDocument(documentId);
        setActiveDocId(null);
      }, 150); // Small delay for animation
    } else {
      // Fallback to redirect if no callback provided
      window.open(`/dashboard/servers/${serverId}/knowledge/${documentId}/edit`, "_self");
    }
  };

  // Filter and sort documents
  const processedDocuments = useMemo(() => {
    // First filter by search term
    const filtered = search.trim()
      ? documents.filter((doc) => doc.title.toLowerCase().includes(search.toLowerCase()))
      : documents;

    // Then sort
    return [...filtered].sort((a, b) => {
      if (sortBy === "title") {
        const comparison = a.title.localeCompare(b.title);
        return sortOrder === "asc" ? comparison : -comparison;
      } else {
        const comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        return sortOrder === "asc" ? comparison : -comparison;
      }
    });
  }, [documents, search, sortBy, sortOrder]);

  return (
    <div className="w-full h-full flex flex-col bg-discord-main/90 rounded-lg shadow-lg border border-discord-border">
      {/* Search */}
      <div className="px-4 pt-4 pb-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-discord-text-muted" />
          <Input
            className="pl-9 bg-discord-sidebar border-discord-border focus-visible:ring-discord-blurple/30 focus-visible:ring-offset-0 placeholder:text-discord-text-muted"
            placeholder="Search documents..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Sorting Controls */}
      <div className="px-4 pb-2 flex items-center gap-2 text-discord-text-muted text-xs font-medium">
        <span>Sort by:</span>
        <button
          onClick={() => toggleSort("title")}
          className={cn(
            "flex items-center px-2 py-1 rounded hover:bg-discord-sidebar/50 transition-colors",
            sortBy === "title" && "text-discord-blurple"
          )}
        >
          Name
          {sortBy === "title" && <ArrowUpDown className="ml-1 h-3 w-3" />}
        </button>
        <button
          onClick={() => toggleSort("updatedAt")}
          className={cn(
            "flex items-center px-2 py-1 rounded hover:bg-discord-sidebar/50 transition-colors",
            sortBy === "updatedAt" && "text-discord-blurple"
          )}
        >
          Date
          {sortBy === "updatedAt" && <ArrowUpDown className="ml-1 h-3 w-3" />}
        </button>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-40 space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-discord-blurple border-t-transparent"></div>
            <p className="text-discord-text-muted text-sm">Loading documents...</p>
          </div>
        ) : processedDocuments.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-40 space-y-3 text-discord-text-muted">
            {search ? (
              <>
                <SearchIcon className="h-12 w-12 text-discord-text-muted/50" />
                <div className="text-center">
                  <p className="font-medium">No matching documents</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              </>
            ) : (
              <>
                <BookOpenIcon className="h-12 w-12 text-discord-text-muted/50" />
                <div className="text-center">
                  <p className="font-medium">Knowledge base empty</p>
                  <p className="text-sm">Create your first document to get started</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => window.open(`/dashboard/servers/${serverId}/knowledge/new`, "_self")}
                  className="mt-2 bg-discord-blurple hover:bg-discord-blurple-hover text-white"
                >
                  <FilePlusIcon className="h-4 w-4 mr-2" />
                  Create Document
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3 pb-2">
            {/* Recently Updated Section - tylko gdy są więcej niż 3 dokumenty */}
            {sortBy === "updatedAt" && sortOrder === "desc" && processedDocuments.length > 3 && (
              <div className="pt-1">
                <div className="flex items-center mb-2">
                  <Clock className="w-3 h-3 mr-1 text-discord-text-muted" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-discord-text-muted">
                    Recently Updated
                  </span>
                </div>
                {processedDocuments.slice(0, 3).map((document) => (
                  <DocumentItem
                    key={document.id}
                    document={document}
                    serverId={serverId}
                    onDelete={() => handleDelete(document.id)}
                    onEdit={() => handleEdit(document.id)}
                    isActive={activeDocId === document.id}
                  />
                ))}
              </div>
            )}

            {/* All Documents */}
            <div>
              <div className="flex items-center mb-2">
                <Sparkles className="w-3 h-3 mr-1 text-discord-text-muted" />
                <span className="text-xs font-semibold uppercase tracking-wider text-discord-text-muted">
                  {sortBy === "updatedAt" && sortOrder === "desc" && processedDocuments.length > 3
                    ? "All Documents"
                    : "Documents"}
                </span>
              </div>
              {(sortBy === "updatedAt" && sortOrder === "desc" && processedDocuments.length > 3
                ? processedDocuments.slice(3)
                : processedDocuments
              ).map((document) => (
                <DocumentItem
                  key={document.id}
                  document={document}
                  serverId={serverId}
                  onDelete={() => handleDelete(document.id)}
                  onEdit={() => handleEdit(document.id)}
                  isActive={activeDocId === document.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface DocumentItemProps {
  document: KnowledgeDocument;
  serverId: string;
  onDelete: () => void;
  onEdit: () => void;
  isActive?: boolean;
}

function DocumentItem({ document, serverId, onDelete, onEdit, isActive = false }: DocumentItemProps) {
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

  // Format file type for display
  const getFileType = (type: string) => {
    switch (type.toLowerCase()) {
      case "md":
        return "Markdown";
      case "txt":
        return "Plain Text";
      default:
        return type.toUpperCase();
    }
  };

  return (
    <div
      className={cn(
        "p-3 rounded-lg flex items-start justify-between transition-all duration-300 ease-in-out transform border border-transparent",
        isHovered && "bg-discord-background-secondary/70 border-discord-blurple/30",
        isActive && "scale-95 opacity-90",
        "hover:shadow-lg"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button onClick={onEdit} className="flex-1 flex items-start text-left">
        <div
          className={cn(
            "w-8 h-8 rounded-md flex items-center justify-center transition-all duration-300 mr-3 mt-0.5",
            isHovered
              ? "bg-gradient-to-br from-discord-blurple/20 to-discord-blurple/10"
              : "bg-discord-background-secondary"
          )}
        >
          <FileTextIcon
            className={cn(
              "h-4 w-4 transition-all duration-300",
              isHovered ? "text-discord-blurple" : "text-discord-text-muted"
            )}
          />
        </div>

        <div className="flex-1 overflow-hidden">
          <h3
            className={cn(
              "font-medium truncate transition-all duration-300",
              isHovered ? "text-white" : "text-discord-text-normal"
            )}
          >
            {document.title}
          </h3>

          <div className="flex items-center mt-1 text-xs text-discord-text-muted">
            <span>{getFileType(document.fileType)}</span>
            <span className="mx-1.5">•</span>
            <span>Updated {formatDate(document.updatedAt)}</span>
          </div>
        </div>
      </button>

      {/* Action buttons */}
      <div
        className={cn(
          "flex items-center space-x-1 transition-all duration-300 ease-in-out",
          isHovered ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-2 scale-95"
        )}
      >
        <button
          onClick={() => window.open(`/dashboard/servers/${serverId}/knowledge/${document.id}`, "_self")}
          className="p-1.5 rounded-full text-discord-text-muted hover:text-white hover:bg-discord-background-secondary transition-colors"
          aria-label="View"
        >
          <BookOpenIcon className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 rounded-full text-discord-text-muted hover:text-white hover:bg-discord-background-secondary transition-colors"
          aria-label="Edit"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete "${document.title}"?`)) {
              onDelete();
            }
          }}
          className="p-1.5 rounded-full text-discord-text-muted hover:text-discord-red hover:bg-discord-background-secondary transition-colors"
          aria-label="Delete"
        >
          <Trash className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
