import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Type definition for module card props based on implementation plan
export interface ModuleCardType {
  id: string;
  title: string;
  description: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
}

interface ModuleCardProps extends ModuleCardType {
  serverId?: string;
}

export default function ModuleCard({
  title,
  description,
  href,
  icon: Icon,
  color = "bg-[#5865F2]", // Discord blurple as default
  serverId,
}: ModuleCardProps) {
  // Construct the final href with serverId if needed
  const finalHref =
    serverId && !href.includes("serverId=") ? `${href}${href.includes("?") ? "&" : "?"}serverId=${serverId}` : href;

  return (
    <a
      href={finalHref}
      className="block transition-all duration-300 hover:translate-y-[-4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5865F2] rounded-lg"
    >
      <Card className="h-full overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-none bg-[#2B2D31] hover:bg-[#383A40]">
        <div className={cn("h-2 w-full", color)} />
        <CardHeader className="p-5">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-6 w-6 text-[#B5BAC1]" />}
            <CardTitle className="text-xl font-bold text-[#FFFFFF]">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-0">
          <p className="text-base text-[#B5BAC1]">{description}</p>
        </CardContent>
      </Card>
    </a>
  );
}
