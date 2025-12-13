import React from "react";
import { motion } from "framer-motion";
import { useCurrentTheme, useInput, useTerminalActions } from "../store/terminalStore";
import { commands } from "../lib/commands";

interface TerminalInputProps {
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({ inputRef }) => {
  const currentTheme = useCurrentTheme();
  const input = useInput();
  const { setInput, setSuggestions, runCommand, navigateHistoryUp, navigateHistoryDown, handleTabComplete } = useTerminalActions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabComplete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistoryUp();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistoryDown();
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value.length > 0) {
      const matchingCommands = Object.keys(commands).filter((cmd) =>
        cmd.startsWith(e.target.value.toLowerCase())
      );
      setSuggestions(matchingCommands.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <motion.div
        className="flex items-center"
        whileFocus={{ scale: 1.005 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <motion.span
          style={{ color: currentTheme.colors.primary }}
          className="font-bold text-lg"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          $
        </motion.span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent outline-none ml-2"
          style={{ color: currentTheme.colors.text }}
          placeholder="Type a command (try 'help')"
          autoFocus
        />
      </motion.div>
    </form>
  );
};
