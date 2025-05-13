import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileType } from "lucide-react";
import { useState } from "react";
import { documentService } from "@/lib/services/documentService";
import { DocumentPreview } from "./DocumentPreview";
import type { DocumentFormData } from "@/types/knowledge";

// Define schema
const documentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  fileType: z.string(),
});

// Export the form values type for use in the document service
export type DocumentFormValues = z.infer<typeof documentSchema>;

interface DocumentFormProps {
  serverId: string;
  initialData?: DocumentFormData;
  onDocumentSaved?: () => void;
}

// Custom hook for form management
function useDocumentForm(initialData?: DocumentFormProps["initialData"]) {
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      fileType: initialData?.fileType || "md",
    },
  });

  const content = form.watch("content");
  const fileType = form.watch("fileType");

  return {
    form,
    content,
    fileType,
    isSubmitting: form.formState.isSubmitting,
  };
}

export default function DocumentForm({ serverId, initialData, onDocumentSaved }: DocumentFormProps) {
  const isEditing = Boolean(initialData?.id);
  const { form, content, fileType, isSubmitting } = useDocumentForm(initialData);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const onSubmit = async (data: DocumentFormValues) => {
    setSubmitError(null);
    setIsSubmittingForm(true);

    try {
      let response;

      if (isEditing && initialData?.id) {
        // Update existing document
        response = await documentService.updateDocument(serverId, initialData.id, data);
      } else {
        // Create new document
        response = await documentService.createDocument(serverId, data);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || response.statusText || "An error occurred");
      }

      // Wywołaj callback zamiast przekierowywać
      if (onDocumentSaved) {
        onDocumentSaved();
      } else {
        // Fallback do przekierowania, jeśli callback nie istnieje
        window.location.href = `/dashboard/servers/${serverId}/knowledge`;
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred while submitting the form. Please try again."
      );
      setIsSubmittingForm(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {submitError && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{submitError}</div>}

        {/* Document Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="title">
                Document Title <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input id="title" placeholder="Enter document title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Document Type */}
        <FormField
          control={form.control}
          name="fileType"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="fileType">
                Document Type <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger id="fileType" className="w-full">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="md">
                      <div className="flex items-center">
                        <FileType className="h-4 w-4 mr-2" />
                        <span>Markdown</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="txt">
                      <div className="flex items-center">
                        <FileType className="h-4 w-4 mr-2" />
                        <span>Plain Text</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Document Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="content">
                Content <span className="text-destructive">*</span>
              </FormLabel>
              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview" disabled={!content}>
                    Preview
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="mt-2">
                  <FormControl>
                    <Textarea
                      id="content"
                      placeholder={fileType === "md" ? "# Markdown content here..." : "Enter document content..."}
                      className="min-h-[300px] font-mono"
                      {...field}
                    />
                  </FormControl>
                </TabsContent>
                <TabsContent value="preview" className="mt-2">
                  <DocumentPreview content={content} fileType={fileType} />
                </TabsContent>
              </Tabs>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => (window.location.href = `/dashboard/servers/${serverId}/knowledge`)}
            disabled={isSubmittingForm}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmittingForm}>
            {isSubmittingForm ? (
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
    </Form>
  );
}
