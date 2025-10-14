import React from "react";
import { themes } from "../lib/themes";
import type { ThemeKey } from "../lib/themes";
import { HistoryLine } from "./HistoryLine";
import { Autocomplete } from "./Autocomplete";
import { TerminalInput } from "./TerminalInput";

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
  input: string;
  setInput: (input: string) => void;
  setSuggestions: (suggestions: string[]) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  suggestions: string[];
  theme: ThemeKey;
  commandHistory: string[];
}

export const TerminalBody: React.FC<TerminalBodyProps> = ({
  history,
  isTyping,
  currentTheme,
  terminalRef,
  inputRef,
  input,
  setInput,
  setSuggestions,
  handleKeyDown,
  handleSubmit,
  suggestions,
  theme,
}) => {
  return (
    <div
      ref={terminalRef}
      className={`flex-1 ${currentTheme.bg} overflow-y-auto p-4`}
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
      <div className="relative">
        <TerminalInput
          handleSubmit={handleSubmit}
          input={input}
          setInput={setInput}
          setSuggestions={setSuggestions}
          handleKeyDown={handleKeyDown}
          inputRef={inputRef}
          currentTheme={currentTheme}
          theme={theme}
        />
        <Autocomplete
          suggestions={suggestions}
          currentTheme={currentTheme}
          setInput={setInput}
          setSuggestions={setSuggestions}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
};
