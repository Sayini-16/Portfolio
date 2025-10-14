import React, { useEffect, useRef } from "react";
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
  // Keep the scroll container pinned to the latest output
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [history, isTyping, suggestions]);

  return (
    <div
      ref={terminalRef}
      className={`flex-1 overflow-y-auto p-4 scroll-smooth`}
      onClick={() => {
        if (inputRef && "current" in inputRef && inputRef.current) {
          inputRef.current.focus();
        }
      }}
    >
      {history.map((entry, index) => (
        <HistoryLine key={index} entry={entry} currentTheme={currentTheme} />
      ))}
      {/* Pure terminal mode: no AI typing indicator */}
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
      {/* Sentinel to ensure the newest content is visible */}
      <div ref={bottomRef} />
    </div>
  );
};
