"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SectionToggleProps {
  title: string;
  description?: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function SectionToggle({
  title,
  description,
  enabled,
  onToggle,
  children,
  className,
}: SectionToggleProps) {
  return (
    <div className={cn("rounded-lg border border-gray-200 dark:border-gray-700", className)}>
      {/* Header con toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
        <div>
          <Label className="text-base font-medium">{title}</Label>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {enabled ? "Visible" : "Oculto"}
          </span>
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          "p-4 transition-all duration-200",
          !enabled && "opacity-50 pointer-events-none"
        )}
      >
        {children}
      </div>
    </div>
  );
}

