import { Button } from "./ui/button";
import type { ServerDetail } from "../types";

interface ServerSettingsHeaderProps {
  server: ServerDetail;
  onActivate: () => Promise<void>;
  onDeactivate: () => Promise<void>;
  onRefresh: () => Promise<void>;
  isLoading: boolean;
}

export const ServerSettingsHeader = ({
  server,
  onActivate,
  onDeactivate,
  onRefresh,
  isLoading,
}: ServerSettingsHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b">
      <div className="flex items-center gap-3">
        {server.iconUrl && <img src={server.iconUrl} alt={`${server.name} icon`} className="w-12 h-12 rounded-full" />}
        <div>
          <h1 className="text-2xl font-bold">{server.name}</h1>
          <p className="text-muted-foreground">Status: {server.active ? "Active" : "Inactive"}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {server.active ? (
          <Button variant="destructive" onClick={onDeactivate} disabled={isLoading}>
            Deactivate Bot
          </Button>
        ) : (
          <Button variant="default" onClick={onActivate} disabled={isLoading}>
            Activate Bot
          </Button>
        )}
        <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
          Refresh Configuration
        </Button>
      </div>
    </div>
  );
};
