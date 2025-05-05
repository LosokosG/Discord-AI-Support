import { useState, useEffect, ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole?: string;
}

export function AuthGuard({ children, fallback, requiredRole }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        // In a real implementation, this would call the actual auth check endpoint
        // For now, we'll simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 600));

        // For demo purposes, pretend the user is authenticated
        setIsAuthenticated(true);

        // If a required role was specified, check if the user has it
        if (requiredRole) {
          // Mock role check - always return true for the demo
          setHasRequiredRole(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setHasRequiredRole(false);
      }
    }

    checkAuth();
  }, [requiredRole]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="p-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-6 w-[300px]" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show the fallback or redirect
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // In a real implementation, this might redirect to login
    // For this demo, we'll show a simple message
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-medium mb-2">Wymagane logowanie</h2>
        <p className="text-muted-foreground mb-4">Aby zobaczyć tę treść, musisz być zalogowany.</p>
        <a
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Zaloguj się
        </a>
      </div>
    );
  }

  // If a role is required but the user doesn't have it, show an unauthorized message
  if (requiredRole && !hasRequiredRole) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-medium mb-2">Brak uprawnień</h2>
        <p className="text-muted-foreground mb-4">Nie masz uprawnień do wyświetlenia tej treści.</p>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Powrót do dashboardu
        </a>
      </div>
    );
  }

  // User is authenticated and has the required role (if any)
  return <>{children}</>;
}
