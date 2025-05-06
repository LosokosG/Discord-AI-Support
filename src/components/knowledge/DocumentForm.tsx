import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileType } from "lucide-react";

interface DocumentFormProps {
  action: string;
  method?: "POST" | "PATCH";
  serverId: string;
  initialData?: {
    id?: string;
    title?: string;
    content?: string;
    fileType?: string;
  };
}

export default function DocumentForm({ action, method = "POST", serverId, initialData }: DocumentFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [fileType, setFileType] = useState(initialData?.fileType || "md");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(initialData?.id);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = e.target as HTMLFormElement;
      form.submit();
    } catch (error) {
      console.error("Form submission error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      action={action}
      method={method === "PATCH" ? "post" : method}
      encType="multipart/form-data"
      className="space-y-6"
    >
      {/* Document Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Document Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter document title"
          required
        />
      </div>

      {/* Document Type */}
      <div className="space-y-2">
        <Label htmlFor="fileType">
          Document Type <span className="text-destructive">*</span>
        </Label>
        <Select
          name="fileType"
          value={fileType}
          onValueChange={setFileType}
          disabled={isEditing} // Can't change document type when editing
        >
          <SelectTrigger id="fileType" className="w-full">
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="md">
              <div className="flex items-center">
                <FileType className="h-4 w-4 mr-2" />
                <span>Markdown (.md)</span>
              </div>
            </SelectItem>
            <SelectItem value="txt">
              <div className="flex items-center">
                <FileType className="h-4 w-4 mr-2" />
                <span>Plain Text (.txt)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Document Content */}
      <div className="space-y-2">
        <Label htmlFor="content">
          Content <span className="text-destructive">*</span>
        </Label>
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview" disabled={!content}>
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-2">
            <Textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={fileType === "md" ? "# Markdown content here..." : "Enter document content..."}
              className="min-h-[300px] font-mono"
              required
            />
          </TabsContent>
          <TabsContent value="preview" className="mt-2">
            <div className="border rounded-md p-4 min-h-[300px] prose prose-slate max-w-none">
              {fileType === "md" ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <pre className="whitespace-pre-wrap">{content}</pre>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => (window.location.href = `/servers/${serverId}/knowledge`)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Document"
          ) : (
            "Create Document"
          )}
        </Button>
      </div>
    </form>
  );
}
