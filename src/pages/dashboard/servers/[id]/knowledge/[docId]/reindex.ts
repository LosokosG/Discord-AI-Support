import { reindexDocument } from "@/lib/services/documents";
import type { APIContext } from "astro";

export const prerender = false;

type Context = APIContext<{
  id: string;
  docId: string;
}>;

export async function POST({ params, locals, redirect }: Context) {
  const { id, docId } = params;

  if (!id || !docId) {
    throw new Error("Missing required parameters: id or docId");
  }

  const serverId = id;
  const documentId = docId;

  try {
    const supabase = locals.supabase;

    // Call reindex function
    await reindexDocument(serverId, documentId, supabase);

    // Redirect back to document view with a success parameter
    return redirect(`/dashboard/servers/${serverId}/knowledge/${documentId}?reindexed=true`, 303);
  } catch (error) {
    console.error("Error reindexing document:", error);

    // Redirect back to document view with an error parameter
    return redirect(`/dashboard/servers/${serverId}/knowledge/${documentId}?error=reindex`, 303);
  }
}
