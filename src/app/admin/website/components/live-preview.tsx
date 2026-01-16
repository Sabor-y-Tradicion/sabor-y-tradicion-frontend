"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Tablet, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

type DeviceMode = "desktop" | "tablet" | "mobile";

interface LivePreviewProps {
  children: React.ReactNode;
  className?: string;
}

export function LivePreview({ children, className }: LivePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const deviceConfig = {
    desktop: { width: "100%", icon: Monitor },
    tablet: { width: "768px", icon: Tablet },
    mobile: { width: "375px", icon: Smartphone },
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700",
        isFullscreen && "fixed inset-0 z-50",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
        <div className="flex items-center gap-1">
          {(Object.keys(deviceConfig) as DeviceMode[]).map((mode) => {
            const Icon = deviceConfig[mode].icon;
            return (
              <Button
                key={mode}
                size="sm"
                variant={deviceMode === mode ? "default" : "ghost"}
                onClick={() => setDeviceMode(mode)}
                className="h-8 px-3"
              >
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Vista Previa
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-4 flex justify-center">
        <div
          className={cn(
            "bg-white dark:bg-gray-950 rounded-lg shadow-lg transition-all duration-300 overflow-hidden",
            deviceMode === "mobile" && "rounded-[2rem]"
          )}
          style={{
            width: deviceConfig[deviceMode].width,
            maxWidth: "100%",
            minHeight: isFullscreen ? "calc(100vh - 80px)" : "600px",
          }}
        >
          {/* Browser chrome effect */}
          {deviceMode === "desktop" && (
            <div className="h-8 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-3 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="h-5 bg-white dark:bg-gray-700 rounded-md px-3 text-xs text-gray-400 flex items-center">
                  mirestaurante.james.pe
                </div>
              </div>
            </div>
          )}

          {/* Mobile notch */}
          {deviceMode === "mobile" && (
            <div className="h-7 bg-black flex justify-center pt-2">
              <div className="w-20 h-5 bg-black rounded-b-xl" />
            </div>
          )}

          {/* Content */}
          <div className="overflow-y-auto" style={{ maxHeight: isFullscreen ? "calc(100vh - 150px)" : "550px" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

