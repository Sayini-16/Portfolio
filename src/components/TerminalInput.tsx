import React from "react";
import { themes } from "../../themes";
import type { ThemeKey } from "../../themes";
import { commands } from "../../commands";

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
  theme,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className={`${currentTheme.termBg} border ${currentTheme.border} rounded-b-lg p-3`}
    >
      <div className="flex items-center gap-2">
        <span className={currentTheme.prompt}>$</span>
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
          className={`flex-1 bg-transparent outline-none ${currentTheme.text}`}
          placeholder="Type a command or ask me anything..."
          autoFocus
        />
      </div>
      <div className={`mt-2 text-xs ${currentTheme.secondaryText}`}>
        TAB: autocomplete | ↑/↓: history | ESC: clear suggestions | Theme:{" "}
        {themes[theme].name}
      </div>
    </form>
  );
};
