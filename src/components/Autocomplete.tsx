/**
 * Autocomplete - Touch-friendly command suggestions
 * Features larger touch targets for mobile and smooth animations
 */

import React from "react";
import { motion } from "framer-motion";
import type { Theme } from "../lib/themes";
import { prefersReducedMotion } from "../lib/motion";

interface AutocompleteProps {
  suggestions: string[];
  currentTheme: Theme;
  setInput: (value: string) => void;
  setSuggestions: (suggestions: string[]) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  suggestions,
  currentTheme,
  setInput,
  setSuggestions,
  inputRef,
}) => {
  const reducedMotion = prefersReducedMotion();

  if (suggestions.length === 0) return null;

  const handleSelect = (cmd: string) => {
    setInput(cmd + " ");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div
      className="border-x px-3 py-2 sm:px-4"
      style={{
        backgroundColor: `${currentTheme.colors.bgSecondary}f0`,
        borderColor: currentTheme.colors.border,
      }}
    >
      <div
        className="text-xs mb-2 opacity-70"
        style={{ color: currentTheme.colors.textMuted }}
      >
        <span className="hidden sm:inline">Press TAB to autocomplete • Click to select</span>
        <span className="sm:hidden">Tap to select</span>
      </div>

      {/* Suggestion chips - larger touch targets on mobile */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((cmd, i) => (
          <motion.button
            key={i}
            onClick={() => handleSelect(cmd)}
            className="
              px-3 py-2 sm:px-2 sm:py-1
              min-h-[40px] sm:min-h-0
              border rounded-lg sm:rounded
              text-sm sm:text-xs
              font-medium
              touch-manipulation
              active:scale-95 sm:active:scale-100
            "
            style={{
              backgroundColor: currentTheme.colors.bgTertiary,
              borderColor: currentTheme.colors.border,
              color: currentTheme.colors.accent,
            }}
            whileHover={
              reducedMotion
                ? {}
                : {
                    borderColor: currentTheme.colors.accent,
                    boxShadow: `0 0 6px ${currentTheme.colors.accent}30`,
                    y: -1,
                  }
            }
            whileTap={reducedMotion ? {} : { scale: 0.97 }}
            transition={{ duration: 0.1 }}
          >
            {cmd}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
