import React from "react";
import { themes } from "../../themes";
import type { ThemeKey } from "../../themes";
import { HistoryLine } from "./HistoryLine";

interface HistoryEntry {
  command?: string;
  output?: {
    type: string;
    content: string;
  };
  timestamp: string;
}

interface TerminalBodyProps {
  history: HistoryEntry[];
  isTyping: boolean;
  currentTheme: (typeof themes)[ThemeKey];
  terminalRef: React.Ref<HTMLDivElement>;
  inputRef: React.Ref<HTMLInputElement>;
}

export const TerminalBody: React.FC<TerminalBodyProps> = ({
  history,
  isTyping,
  currentTheme,
  terminalRef,
  inputRef,
}) => {
  return (
    <div
      ref={terminalRef}
      className={`flex-1 ${currentTheme.bg} border-x ${currentTheme.border} p-4 overflow-y-auto`}
      style={{ maxHeight: "calc(100vh - 180px)" }}
      onClick={() => {
        if (inputRef && "current" in inputRef && inputRef.current) {
          inputRef.current.focus();
        }
      }}
    >
      {history.map((entry, index) => (
        <HistoryLine key={index} entry={entry} currentTheme={currentTheme} />
      ))}
      {isTyping && (
        <div className={`flex items-center gap-2 ${currentTheme.ai} ml-4`}>
          <div className="flex gap-1">
            <span className="animate-pulse">.</span>
            <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>
              .
            </span>
            <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>
              .
            </span>
          </div>
          <span className="text-xs">AI is thinking</span>
        </div>
      )}
    </div>
  );
};
