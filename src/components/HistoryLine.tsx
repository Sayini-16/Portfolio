import React from "react";
import { themes } from "../lib/themes";
import type { ThemeKey } from "../lib/themes";

interface HistoryEntry {
  command?: string;
  output?: {
    type: string;
    content: string;
  };
  // optional flag to trigger a brief highlight animation
  updated?: boolean;
  timestamp: string;
}

interface HistoryLineProps {
  entry: HistoryEntry;
  currentTheme: (typeof themes)[ThemeKey];
}

export const HistoryLine: React.FC<HistoryLineProps> = ({
  entry,
  currentTheme,
}) => {
  const baseClass = "ml-4 whitespace-pre-wrap";
  const stateClass =
    entry.output?.type === "error"
      ? currentTheme.error
      : entry.output?.type === "success"
      ? currentTheme.success
      : entry.output?.type === "welcome"
      ? currentTheme.accent
      : currentTheme.secondaryText;

  // If the entry has been marked `updated`, add a short highlight class.
  const highlightClass = entry.updated ? "animate-welcome-highlight" : "";

  const outputClass = `${baseClass} ${stateClass} ${highlightClass}`;

  return (
    <div className="mb-4">
      {entry.command && (
        <div className="flex gap-2 mb-1">
          <span className={currentTheme.prompt}>❯</span>
          <span className={currentTheme.text}>{entry.command}</span>
          <span className={`${currentTheme.secondaryText} text-xs ml-auto`}>
            {entry.timestamp}
          </span>
        </div>
      )}
      {entry.output && <div className={outputClass}>{entry.output.content}</div>}
    </div>
  );
};
