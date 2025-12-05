import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionLink,
  onAction
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div
        className="bg-muted/50 rounded-full p-6 mb-6 animate-scale-in"
        style={{ animationDelay: "0.1s" }}
      >
        <Icon className="h-16 w-16 text-muted-foreground" />
      </div>
      <h3
        className="text-2xl font-semibold mb-2 animate-fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        {title}
      </h3>
      <p
        className="text-muted-foreground text-center mb-6 max-w-md animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        {description}
      </p>
      {actionLabel && (actionLink || onAction) && (
        <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          {actionLink ? (
            <Button asChild className="gradient-hero shadow-soft">
              <Link to={actionLink}>{actionLabel}</Link>
            </Button>
          ) : (
            <Button onClick={onAction} className="gradient-hero shadow-soft">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
