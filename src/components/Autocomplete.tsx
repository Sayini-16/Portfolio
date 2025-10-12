import React from "react";
import { themes } from "../lib/themes";
import type { ThemeKey } from "../lib/themes";

interface AutocompleteProps {
  suggestions: string[];
  currentTheme: (typeof themes)[ThemeKey];
  setInput: (value: string) => void;
  setSuggestions: (suggestions: string[]) => void;
  inputRef: React.Ref<HTMLInputElement>;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  suggestions,
  currentTheme,
  setInput,
  setSuggestions,
  inputRef,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div
      className={`${currentTheme.termBg} border-x ${currentTheme.border} px-4 py-2`}
    >
      <div className={`text-xs ${currentTheme.secondaryText} mb-1`}>
        Suggestions (press TAB):
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((cmd, i) => (
          <button
            key={i}
            onClick={() => {
              setInput(cmd + " ");
              setSuggestions([]);
              // Type guard to ensure ref is a RefObject with a 'current' property
              if (inputRef && "current" in inputRef) {
                inputRef.current?.focus();
              }
            }}
            className={`px-2 py-1 ${currentTheme.termBg} border ${currentTheme.border} rounded text-xs ${currentTheme.accent} ${currentTheme.hoverText} transition-colors`}
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};
