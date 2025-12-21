import React, { useState } from "react";
import { useCurrentTheme } from "../store/terminalStore";
import { TypewriterText } from "./TypewriterText";
import type { HistoryEntry } from "../store/terminalStore";

interface HistoryLineProps {
  entry: HistoryEntry;
  isLatest?: boolean; // Only animate the latest entry
}

export const HistoryLine: React.FC<HistoryLineProps> = ({ entry, isLatest = false }) => {
  const currentTheme = useCurrentTheme();
  const [typingComplete, setTypingComplete] = useState(!isLatest);

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

  // Determine typing speed based on content length
  const getTypingSpeed = () => {
    const length = entry.output?.content?.length || 0;
    if (length > 1000) return 2000; // Very fast for long content
    if (length > 500) return 1500;
    if (length > 200) return 1000;
    return 600; // Slower for short content so effect is visible
  };

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
          {isLatest && !typingComplete ? (
            <TypewriterText
              text={entry.output.content}
              speed={getTypingSpeed()}
              onComplete={() => setTypingComplete(true)}
            />
          ) : (
            entry.output.content
          )}
        </div>
      )}
    </div>
  );
};
