import React from "react";
import { useCurrentTheme } from "../store/terminalStore";
import type { HistoryEntry } from "../store/terminalStore";

interface HistoryLineProps {
  entry: HistoryEntry;
}

export const HistoryLine: React.FC<HistoryLineProps> = ({ entry }) => {
  const currentTheme = useCurrentTheme();

  // Determine output color based on type
  const getOutputColor = () => {
    switch (entry.output?.type) {
      case "error":
        return currentTheme.colors.error;
      case "success":
        return currentTheme.colors.success;
      case "welcome":
        return currentTheme.colors.accent;
      default:
        return currentTheme.colors.textMuted;
    }
  };

  // If the entry has been marked `updated`, add a short highlight class.
  const highlightClass = entry.updated ? "animate-welcome-highlight" : "";

  return (
    <div className="mb-4" data-line>
      {entry.command && (
        <div className="flex gap-2 mb-1">
          <span style={{ color: currentTheme.colors.primary }}>$</span>
          <span style={{ color: currentTheme.colors.text }}>{entry.command}</span>
          <span
            className="text-xs ml-auto"
            style={{ color: currentTheme.colors.textMuted }}
          >
            {entry.timestamp}
          </span>
        </div>
      )}
      {entry.output && (
        <div
          className={`ml-4 whitespace-pre-wrap ${highlightClass}`}
          style={{ color: getOutputColor() }}
        >
          {entry.output.content}
        </div>
      )}
    </div>
  );
};
