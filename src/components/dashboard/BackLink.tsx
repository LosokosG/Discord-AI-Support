import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackLinkProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackLink({ href = "/dashboard", label = "Powrót do Dashboard", className }: BackLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 transition-colors",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{label}</span>
    </a>
  );
}
