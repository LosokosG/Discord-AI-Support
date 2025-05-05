import { useState } from "react";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";

interface LoginButtonProps {
  redirectTo?: string;
}

export function LoginButton({ redirectTo }: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      // Prepare the login URL with any redirect parameters
      const searchParams = new URLSearchParams();
      if (redirectTo) {
        searchParams.set("redirect_to", redirectTo);
      }

      // Przekierowanie do endpoint API logowania przez Discord OAuth
      const loginUrl = `/api/auth/login?${searchParams.toString()}`;
      window.location.href = loginUrl;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleLogin} disabled={isLoading} className="w-full">
      {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.discord className="mr-2 h-4 w-4" />}
      Zaloguj przez Discord
    </Button>
  );
}
