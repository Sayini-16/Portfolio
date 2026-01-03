import React from "react";
import { motion } from "framer-motion";
import {
  useCurrentTheme,
  useInput,
  useTerminalActions,
} from "../store/terminalStore";
import { commands } from "../lib/commands";

interface TerminalInputProps {
  inputRef: React.RefObject<HTMLInputElement>;
  hidden?: boolean;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({ inputRef, hidden = false }) => {
  const currentTheme = useCurrentTheme();
  const input = useInput();
  const {
    setInput,
    setSuggestions,
    runCommand,
    navigateHistoryUp,
    navigateHistoryDown,
    handleTabComplete,
    resetTabCycle,
  } = useTerminalActions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      handleTabComplete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      navigateHistoryUp();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navigateHistoryDown();
    } else if (e.key === "Escape") {
      setSuggestions([]);
      resetTabCycle();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    resetTabCycle();
    if (e.target.value.length > 0) {
      const matchingCommands = Object.keys(commands).filter((cmd) =>
        cmd.startsWith(e.target.value.toLowerCase())
      );
      setSuggestions(matchingCommands.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  if (hidden) return null;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <motion.div
        className="flex items-center"
        whileFocus={{ scale: 1.005 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <motion.span
          style={{ color: currentTheme.colors.primary }}
          className="font-bold text-sm"
          animate={{ opacity: [0.7, 1, 0.7] }}
        >
          as@portfolio:~$
        </motion.span>
        <div className="relative flex-1 ml-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent outline-none terminal-input"
            style={{ color: currentTheme.colors.text }}
            autoFocus
          />
          {/* Block cursor positioned after text */}
          <span
            className="terminal-cursor absolute pointer-events-none"
            style={{
              color: currentTheme.colors.primary,
              left: `${input.length * 0.6}em`,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </div>
      </motion.div>
    </form>
  );
};
