import React from "react";
import { themes } from "../lib/themes";
import type { ThemeKey } from "../lib/themes";
import { commands } from "../lib/commands";

interface TerminalInputProps {
  handleSubmit: (e: React.FormEvent) => void;
  input: string;
  setInput: (value: string) => void;
  setSuggestions: (suggestions: string[]) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.Ref<HTMLInputElement>;
  currentTheme: (typeof themes)[ThemeKey];
  theme: ThemeKey;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  handleSubmit,
  input,
  setInput,
  setSuggestions,
  handleKeyDown,
  inputRef,
  currentTheme,
}) => {
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center">
        <span className={`${currentTheme.primary} font-bold`}>$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (e.target.value.length > 0) {
              const matchingCommands = Object.keys(commands).filter((cmd) =>
                cmd.startsWith(e.target.value.toLowerCase())
              );
              setSuggestions(matchingCommands.slice(0, 5));
            } else {
              setSuggestions([]);
            }
          }}
          onKeyDown={handleKeyDown}
          className={`w-full bg-transparent outline-none ml-2 ${currentTheme.text}`}
          placeholder="Type a command or ask me anything..."
          autoFocus
        />
      </div>
    </form>
  );
};
