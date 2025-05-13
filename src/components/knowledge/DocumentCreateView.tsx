import { useState } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import DocumentForm from "@/components/knowledge/DocumentForm";

interface DocumentCreateViewProps {
  serverId: string;
  error?: string | null;
}

export function DocumentCreateView({ serverId, error }: DocumentCreateViewProps) {
  const [localError] = useState<string | null>(error || null);

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <a
          href={`/servers/${serverId}/knowledge`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </a>
      </div>

      {localError && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Error</h3>
              <p className="text-sm">{localError}</p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add New Document</CardTitle>
          <CardDescription>
            Create a new document for your knowledge base. This document will be used by the AI to answer user
            questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentForm serverId={serverId} />
        </CardContent>
      </Card>
    </div>
  );
}
