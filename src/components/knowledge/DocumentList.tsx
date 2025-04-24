import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Search, Filter, MoreVertical, FileType, Trash, Edit, RefreshCw } from "lucide-react";
import type { DocumentList, KnowledgeDocument } from "@/types";
import { getDocumentsByServerId, deleteDocument, reindexDocument } from "@/lib/services/documents";
import { useSupabase } from "@/components/hooks/useSupabase";
import { toast } from "@/components/ui/sonner";

interface DocumentListProps {
  initialDocuments: DocumentList | null;
  serverId: string;
}

export default function DocumentList({ initialDocuments, serverId }: DocumentListProps) {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(initialDocuments?.data || []);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [page, setPage] = useState(initialDocuments?.page || 1);
  const [totalPages, setTotalPages] = useState(
    initialDocuments ? Math.ceil(initialDocuments.total / initialDocuments.pageSize) : 1
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<KnowledgeDocument | null>(null);
  const supabase = useSupabase();

  // Load documents when page, search, or filter changes
  useEffect(() => {
    if (!supabase) return;

    async function loadDocuments() {
      setIsLoading(true);
      try {
        const params: { page: number; pageSize: number; q?: string; fileType?: string } = {
          page,
          pageSize: 20,
        };

        if (searchQuery) {
          params.q = searchQuery;
        }

        if (selectedFilter) {
          params.fileType = selectedFilter;
        }

        if (!supabase) return;

        const result = await getDocumentsByServerId(serverId, params, supabase);
        setDocuments(result.data);
        setTotalPages(Math.ceil(result.total / result.pageSize));
      } catch (error) {
        console.error("Error loading documents:", error);
        toast.error("Failed to load documents. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDocuments();
  }, [page, searchQuery, selectedFilter, serverId, supabase]);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  // Handle filter selection
  const handleFilterSelect = (fileType: string | null) => {
    setSelectedFilter(fileType);
    setPage(1); // Reset to first page when filter changes
  };

  // Handle pagination
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Handle document deletion
  const openDeleteDialog = (document: KnowledgeDocument) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete || !supabase) return;

    setIsLoading(true);
    try {
      await deleteDocument(serverId, documentToDelete.id, supabase);

      // Remove from local state
      setDocuments((docs) => docs.filter((doc) => doc.id !== documentToDelete.id));

      // Close dialog
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);

      toast.success(`Document "${documentToDelete.title}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle document reindexing
  const handleReindexDocument = async (document: KnowledgeDocument) => {
    if (!supabase) return;

    try {
      await reindexDocument(serverId, document.id, supabase);
      toast.success(`Document "${document.title}" is being reindexed`);
    } catch (error) {
      console.error("Error reindexing document:", error);
      toast.error("Failed to reindex document. Please try again later.");
    }
  };

  return (
    <div className="w-full">
      {/* Search and Filter Bar */}
      <div className="p-4 flex flex-col sm:flex-row gap-2 justify-between border-b">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-8" value={searchQuery} onChange={handleSearch} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              {selectedFilter ? `Filter: ${selectedFilter.toUpperCase()}` : "Filter"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleFilterSelect(null)}>All Documents</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterSelect("md")}>Markdown (.md)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterSelect("txt")}>Text (.txt)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterSelect("pdf")}>PDF (.pdf)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Documents Table */}
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No documents found.
                </TableCell>
              </TableRow>
            ) : (
              documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <a href={`/servers/${serverId}/knowledge/${document.id}`} className="font-medium hover:underline">
                      {document.title}
                    </a>
                  </TableCell>
                  <TableCell className="uppercase text-xs">
                    <div className="flex items-center gap-1">
                      <FileType className="h-4 w-4" />
                      {document.fileType}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(document.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(document.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => (window.location.href = `/servers/${serverId}/knowledge/${document.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReindexDocument(document)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reindex
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(document)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end p-4 border-t">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <div className="flex ml-4 gap-1">
          <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={page <= 1 || isLoading}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextPage} disabled={page >= totalPages || isLoading}>
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the document &apos;{documentToDelete?.title}&apos; and remove it from the
              knowledge base. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDocument}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
