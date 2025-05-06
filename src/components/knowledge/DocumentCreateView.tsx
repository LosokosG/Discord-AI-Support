import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Add Document</h1>
        <a
          href={`/servers/${serverId}/knowledge`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Documents
        </a>
      </div>

      {localError && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
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
        </CardHeader>
        <CardContent>
          <DocumentForm action={`/servers/${serverId}/knowledge/new`} method="POST" serverId={serverId} />
        </CardContent>
      </Card>
    </div>
  );
}
