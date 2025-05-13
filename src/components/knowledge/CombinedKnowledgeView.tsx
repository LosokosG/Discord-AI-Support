import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  FilePlus,
  RefreshCw,
  Search,
  Eye,
  Pencil,
  Trash,
  Clock,
  Save,
  X,
  Clipboard,
  Plus,
  Upload,
} from "lucide-react";
import { documentService } from "@/lib/services/documentService";
import { DocumentPreview } from "./DocumentPreview";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { DocumentList, KnowledgeDocument } from "@/types";
import type { DocumentFormData } from "@/types/knowledge";

interface CombinedKnowledgeViewProps {
  serverId: string;
  initialDocuments: DocumentList | null;
}

export function CombinedKnowledgeView({ serverId, initialDocuments }: CombinedKnowledgeViewProps) {
  // State for document management
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<DocumentFormData | undefined>(undefined);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(initialDocuments?.data || []);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload progress tracking
  const [uploadProgress, setUploadProgress] = useState<{ total: number; processed: number; current: string }>({
    total: 0,
    processed: 0,
    current: "",
  });

  // UI state
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "updatedAt">("updatedAt");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Editor state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [editingFileType, setEditingFileType] = useState("md");
  const [isSaving, setIsSaving] = useState(false);
  const [isPasting, setIsPasting] = useState(false);

  // Drag and drop state
  const [dragActive, setDragActive] = useState(false);

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      const isSmall = window.innerWidth < 1024;
      setIsSmallScreen(isSmall);
      if (isSmall) {
        setIsSidebarCollapsed(true);
      }
    };

    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Function to refresh documents list
  const refreshDocuments = useCallback(async () => {
    setRefreshing(true);
    try {
      const updatedDocs = await documentService.getDocuments(serverId);
      setDocuments(updatedDocs.data || []);
      setRefreshKey((prevKey) => prevKey + 1);
      toast.success("Documents refreshed", {
        position: "top-center",
        style: { background: "#2d7d46", color: "white" },
        duration: 2000,
      });
    } catch (error) {
      console.error("Error refreshing documents:", error);
      toast.error("Failed to refresh documents", {
        position: "top-center",
        style: { background: "#da373c", color: "white" },
        duration: 2000,
      });
    } finally {
      setTimeout(() => setRefreshing(false), 500); // Show refresh indicator for at least 500ms
    }
  }, [serverId]);

  // Select a document to view/edit
  const handleSelectDocument = async (documentId: string) => {
    if (selectedDocumentId === documentId) return;

    setIsLoading(true);
    try {
      const documentData = await documentService.getDocument(serverId, documentId);

      setDocumentData({
        id: documentData.id,
        title: documentData.title,
        content: documentData.content,
        fileType: documentData.fileType,
      });

      setEditingTitle(documentData.title);
      setEditingContent(documentData.content);
      setEditingFileType(documentData.fileType);
      setSelectedDocumentId(documentId);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error loading document:", error);
      toast.error("Failed to load document", {
        position: "top-center",
        style: { background: "#da373c", color: "white" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new document
  const handleNewDocument = () => {
    setDocumentData(undefined);
    setEditingTitle("");
    setEditingContent("");
    setEditingFileType("md");
    setSelectedDocumentId(null);
    setIsEditMode(true);
  };

  // Toggle between edit and preview modes
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Function to paste from clipboard
  const handlePasteFromClipboard = async () => {
    setIsPasting(true);
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setEditingContent(clipboardText);
        toast.success("Content pasted from clipboard", {
          position: "top-center",
          style: { background: "#2d7d46", color: "white" },
        });
      } else {
        toast.error("Clipboard is empty", {
          position: "top-center",
          style: { background: "#da373c", color: "white" },
        });
      }
    } catch (error) {
      console.error("Error pasting from clipboard:", error);
      toast.error("Failed to paste from clipboard. Make sure you've granted clipboard permission.", {
        position: "top-center",
        style: { background: "#da373c", color: "white" },
        duration: 4000,
      });
    } finally {
      setIsPasting(false);
    }
  };

  // Save document (create or update)
  const saveDocument = async () => {
    if (!editingTitle.trim() || !editingContent.trim()) {
      toast.error("Title and content are required", {
        position: "top-center",
        style: { background: "#da373c", color: "white" },
      });
      return;
    }

    setIsSaving(true);
    try {
      const documentData = {
        title: editingTitle,
        content: editingContent,
        fileType: editingFileType,
      };

      let response;
      if (selectedDocumentId) {
        // Update existing document
        response = await documentService.updateDocument(serverId, selectedDocumentId, documentData);
      } else {
        // Create new document
        response = await documentService.createDocument(serverId, documentData);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || response.statusText || "An error occurred");
      }

      await refreshDocuments();
      setIsEditMode(false);

      toast.success(`Document ${selectedDocumentId ? "updated" : "created"} successfully`, {
        position: "top-center",
        style: { background: "#2d7d46", color: "white" },
      });

      if (!selectedDocumentId) {
        // If this was a new document, try to select it from the refreshed list
        const newDocumentData = await response.json();
        if (newDocumentData?.id) {
          handleSelectDocument(newDocumentData.id);
        }
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("Failed to save document", {
        position: "top-center",
        style: { background: "#da373c", color: "white" },
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a document
  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    setIsLoading(true);
    try {
      const response = await documentService.deleteDocument(serverId, documentId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || response.statusText || "Failed to delete document");
      }

      setDocuments((docs) => docs.filter((doc) => doc.id !== documentId));

      if (selectedDocumentId === documentId) {
        setSelectedDocumentId(null);
        setDocumentData(undefined);
      }

      toast.success("Document deleted successfully", {
        position: "top-center",
        style: { background: "#2d7d46", color: "white" },
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document", {
        position: "top-center",
        style: { background: "#da373c", color: "white" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Format relative time for document dates
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
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
        const comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        return sortOrder === "asc" ? -comparison : comparison;
      }
    });
  }, [documents, search, sortBy, sortOrder]);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Helper function for handling file uploads (shared between drag-drop and input)
  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      setIsUploading(true);
      setUploadProgress({
        total: fileArray.length,
        processed: 0,
        current: fileArray[0].name,
      });

      let successCount = 0;
      let errorCount = 0;

      try {
        // Process each file
        for (const file of fileArray) {
          setUploadProgress((prev) => ({
            ...prev,
            processed: prev.processed + 1,
            current: file.name,
          }));

          const fileName = file.name;
          const fileExt = fileName.split(".").pop()?.toLowerCase() || "";

          // Check file type
          if (fileExt !== "md" && fileExt !== "txt") {
            errorCount++;
            toast.error(`Unsupported file type: ${fileName}. Only .md and .txt files are supported.`, {
              position: "top-center",
              style: { background: "#da373c", color: "white" },
            });
            continue;
          }

          // Read file contents
          const fileContent = await readFileContent(file);

          // Create document title from filename without extension
          const title = fileName.replace(/\.[^/.]+$/, "");

          // Create document
          const documentData = {
            title,
            content: fileContent,
            fileType: fileExt,
          };

          const response = await documentService.createDocument(serverId, documentData);

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
            toast.error(`Failed to upload ${fileName}`, {
              position: "top-center",
              style: { background: "#da373c", color: "white" },
            });
          }
        }

        if (successCount > 0) {
          await refreshDocuments();
          toast.success(
            `Successfully uploaded ${successCount} ${successCount === 1 ? "document" : "documents"}${
              errorCount > 0 ? ` (${errorCount} failed)` : ""
            }`,
            {
              position: "top-center",
              style: { background: "#2d7d46", color: "white" },
            }
          );
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error("An error occurred while uploading files", {
          position: "top-center",
          style: { background: "#da373c", color: "white" },
        });
      } finally {
        setIsUploading(false);
        setUploadProgress({
          total: 0,
          processed: 0,
          current: "",
        });
      }
    },
    [refreshDocuments, serverId]
  );

  // Handle file upload from input
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    await processFiles(files);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

      await processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  // Helper function to read file content
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Failed to read file content"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      reader.readAsText(file);
    });
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top navbar with actions - fixed height */}
      <div className="flex-none py-3 px-4 bg-discord-background-secondary border-b border-[#202225] shadow-md z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-discord-blurple" />
            <h1 className="text-xl font-bold text-white">Knowledge Base</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={refreshDocuments}
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-md hover:bg-discord-background-tertiary"
              disabled={refreshing}
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
            </Button>

            {/* File upload input (hidden) */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".md,.txt"
              multiple
              className="hidden"
              disabled={isUploading}
            />

            {/* Upload button */}
            <Button
              onClick={triggerFileUpload}
              variant="outline"
              className="bg-[#1e1f22]/30 border-[#3f4147] hover:bg-[#383a40] h-10 px-5 text-white rounded-md font-semibold"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Files
                </>
              )}
            </Button>

            <Button
              onClick={handleNewDocument}
              className="bg-discord-blurple hover:bg-discord-blurple-hover h-10 px-5 text-white rounded-md font-semibold"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Document
            </Button>
          </div>
        </div>
      </div>

      {/* Main content area - takes remaining height */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left sidebar - document list */}
        <div
          className={cn(
            "h-full transition-all duration-300 max-h-full",
            isSmallScreen ? (isSidebarCollapsed ? "w-0" : "w-full") : "w-80"
          )}
        >
          <div
            className="h-full flex flex-col bg-[#2b2d31] border-r border-[#202225] shadow-lg"
            onDragEnter={handleDrag}
          >
            {/* Document list header */}
            <div className="flex-none p-3 bg-[#232428] border-b border-[#202225]">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wide px-2">Documents</h2>
            </div>

            {/* Search input */}
            <div className="flex-none p-3 bg-[#2b2d31] border-b border-[#202225]">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-discord-text-muted" />
                <Input
                  className="pl-9 bg-[#1e1f22]/80 border-[#3f4147] rounded-md focus:border-discord-blurple focus:ring-discord-blurple/20"
                  placeholder="Search documents..."
                  value={search}
                  onChange={handleSearch}
                />
              </div>
            </div>

            {/* Document list - scrollable */}
            <div
              className={cn(
                "flex-1 overflow-y-auto p-4 space-y-3 bg-[#2b2d31] relative",
                dragActive && "bg-discord-blurple/10"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {/* Drag overlay */}
              {dragActive && (
                <div className="absolute inset-0 bg-discord-blurple/10 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                  <Upload className="h-14 w-14 text-discord-blurple/70 mb-3" />
                  <p className="text-xl font-medium text-white">Drop files to upload</p>
                  <p className="text-discord-text-muted">Supported formats: .md, .txt</p>
                </div>
              )}

              {/* Upload progress indicator */}
              {isUploading && (
                <div className="sticky top-0 z-20 bg-[#1e1f22] border border-[#3f4147] rounded-md p-3 mb-4 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white">Uploading files...</span>
                    <span className="text-xs text-discord-text-muted">
                      {uploadProgress.processed} of {uploadProgress.total} files
                    </span>
                  </div>
                  <div className="h-2 bg-[#3f4147] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-discord-blurple transition-all duration-300 ease-out"
                      style={{ width: `${(uploadProgress.processed / uploadProgress.total) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-discord-text-muted mt-2 truncate">{uploadProgress.current}</p>
                </div>
              )}

              {/* Documents list content */}
              {isLoading && documents.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-40 space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-discord-blurple border-t-transparent"></div>
                  <p className="text-discord-text-muted text-sm">Loading documents...</p>
                </div>
              ) : processedDocuments.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-40 space-y-3 text-discord-text-muted">
                  {search ? (
                    <>
                      <Search className="h-12 w-12 text-discord-text-muted/50" />
                      <div className="text-center">
                        <p className="font-medium">No matching documents</p>
                        <p className="text-sm">Try a different search term</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-12 w-12 text-discord-text-muted/50" />
                      <div className="text-center">
                        <p className="font-medium">Knowledge base empty</p>
                        <p className="text-sm">Create your first document</p>
                        <p className="text-xs text-discord-text-muted mt-2">
                          Tip: You can also drag and drop .md or .txt files here
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleNewDocument}
                        className="mt-2 bg-discord-blurple hover:bg-discord-blurple-hover text-white h-10 px-4"
                      >
                        <FilePlus className="h-5 w-5 mr-2" />
                        Create Document
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                processedDocuments.map((document) => (
                  <button
                    key={document.id}
                    onClick={() => handleSelectDocument(document.id)}
                    className={cn(
                      "w-full text-left p-0 transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-discord-blurple focus:ring-offset-1 focus:ring-offset-[#2b2d31]"
                    )}
                  >
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-md transition-all duration-200",
                        selectedDocumentId === document.id
                          ? "bg-discord-blurple/20 border border-discord-blurple/80 shadow-[0_0_8px_rgba(88,101,242,0.2)]"
                          : "bg-[#313338] border border-[#3f4147] hover:border-[#5c5e66] hover:bg-[#383a40] shadow-md"
                      )}
                    >
                      {/* Colored indicator on the left */}
                      <div
                        className={cn(
                          "absolute left-0 top-0 bottom-0 w-1.5",
                          selectedDocumentId === document.id ? "bg-discord-blurple" : "bg-[#5c5e66]"
                        )}
                      />

                      <div className="flex items-center px-4 py-3 pl-5">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <FileText
                              className={cn(
                                "h-5 w-5 mr-2 flex-shrink-0 transition-colors duration-200",
                                selectedDocumentId === document.id ? "text-discord-blurple" : "text-discord-text-muted"
                              )}
                            />
                            <h3
                              className={cn(
                                "font-semibold truncate transition-colors duration-200",
                                selectedDocumentId === document.id ? "text-white" : "text-discord-text-normal"
                              )}
                            >
                              {document.title}
                            </h3>
                          </div>
                          <div className="flex items-center mt-1.5 text-xs text-discord-text-muted pl-7">
                            <span className="px-1.5 py-0.5 bg-discord-blurple/10 rounded-md text-discord-blurple/90 font-medium">
                              {getFileType(document.fileType)}
                            </span>
                            <span className="mx-2 text-discord-text-muted/50">•</span>
                            <Clock className="h-3 w-3 mr-1 text-discord-text-muted/70" />
                            <span>{formatRelativeTime(document.updatedAt)}</span>
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDocument(document.id);
                          }}
                          className="p-2 ml-2 text-discord-text-muted/70 hover:text-discord-red transition-colors duration-200 rounded-md hover:bg-[#232428]/60"
                          aria-label="Delete document"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main document view/editor area */}
        <div
          className={cn(
            "h-full flex-1 flex flex-col overflow-hidden",
            !selectedDocumentId && !isEditMode && isSmallScreen && "hidden"
          )}
        >
          {selectedDocumentId || isEditMode ? (
            <>
              {/* Document editor header */}
              <div className="flex-none flex items-center justify-between p-4 border-b border-[#202225] bg-[#2b2d31] shadow-md">
                <div className="flex-1">
                  {isEditMode ? (
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      placeholder="Document title"
                      className="h-10 text-lg font-medium bg-[#1e1f22]/80 border-[#3f4147] focus:border-discord-blurple rounded-md"
                    />
                  ) : (
                    <h2 className="text-lg font-semibold text-white px-1 truncate">{documentData?.title}</h2>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {isSmallScreen && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setIsSidebarCollapsed(false);
                        setSelectedDocumentId(null);
                      }}
                      className="h-10 w-10 lg:hidden rounded-md hover:bg-[#383a40]"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}

                  <Button
                    onClick={toggleEditMode}
                    variant="outline"
                    size="sm"
                    className="h-10 px-4 bg-[#1e1f22]/30 border-[#3f4147] hover:bg-[#383a40] font-medium"
                  >
                    {isEditMode ? (
                      <>
                        <Eye className="h-5 w-5 mr-2" />
                        Preview
                      </>
                    ) : (
                      <>
                        <Pencil className="h-5 w-5 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>

                  {isEditMode && (
                    <>
                      <Button
                        onClick={handlePasteFromClipboard}
                        variant="outline"
                        size="sm"
                        className="h-10 px-4 bg-[#1e1f22]/30 border-[#3f4147] hover:bg-[#383a40] font-medium"
                        disabled={isPasting}
                      >
                        {isPasting ? (
                          <>
                            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                            Pasting...
                          </>
                        ) : (
                          <>
                            <Clipboard className="h-5 w-5 mr-2" />
                            Paste from Clipboard
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={saveDocument}
                        className="h-10 px-5 bg-discord-blurple hover:bg-discord-blurple-hover text-white font-semibold"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Document content area - scrollable */}
              <div className="flex-1 overflow-auto p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-discord-blurple border-t-transparent"></div>
                  </div>
                ) : isEditMode ? (
                  <div className="bg-[#2b2d31] border border-[#3f4147] rounded-md shadow-lg h-full overflow-hidden">
                    <div className="border-b border-[#3f4147] px-4 py-2 bg-[#232428] flex items-center">
                      <span className="text-sm text-white font-medium">
                        {editingFileType === "md" ? "Markdown Editor" : "Text Editor"}
                      </span>
                    </div>
                    <Textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      placeholder={
                        editingFileType === "md" ? "# Markdown content here..." : "Enter document content..."
                      }
                      className="min-h-[calc(100%-40px)] w-full resize-none border-0 bg-[#2b2d31] font-mono p-5 rounded-b-md focus:border-0 focus:ring-0 text-white"
                    />
                  </div>
                ) : (
                  <div className="prose prose-slate dark:prose-invert max-w-none bg-[#2b2d31] border border-[#3f4147] rounded-md p-8 shadow-lg">
                    <DocumentPreview content={documentData?.content || ""} fileType={documentData?.fileType || "txt"} />
                  </div>
                )}
              </div>
            </>
          ) : (
            // Empty state - No document selected
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-[#2b2d31] border border-[#3f4147] rounded-md p-8 shadow-lg max-w-md">
                <BookOpen className="h-16 w-16 mb-4 text-discord-text-muted/30 mx-auto" />
                <h2 className="text-xl font-semibold mb-2 text-white">No document selected</h2>
                <p className="text-discord-text-muted mb-6">
                  Select a document from the list or create a new one to get started. Documents help your AI answer user
                  questions more accurately.
                </p>
                <Button
                  onClick={handleNewDocument}
                  className="bg-discord-blurple hover:bg-discord-blurple-hover h-10 px-5 text-white font-semibold"
                >
                  <FilePlus className="h-5 w-5 mr-2" />
                  Create New Document
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
