/**
 * StatusBar - Enhanced terminal status bar with animations
 * Shows typing status, command count, keyboard shortcuts, and theme name
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentTheme, useHistory, useInput } from "../store/terminalStore";
import { prefersReducedMotion } from "../lib/motion";

export const StatusBar: React.FC = () => {
  const currentTheme = useCurrentTheme();
  const history = useHistory();
  const input = useInput();
  const reducedMotion = prefersReducedMotion();

  const isTyping = input.length > 0;
  const commandCount = history.filter((h) => h.command).length;

  // Status indicator animation variants
  const statusVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  // Pulse animation for status dot
  const pulseVariants = {
    ready: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.8, 1],
    },
    typing: {
      scale: [1, 1.15, 1],
      opacity: [1, 0.9, 1],
    },
  };

  return (
    <div
      className="text-xs px-3 py-2 flex justify-between items-center border-t backdrop-blur-sm"
      style={{
        backgroundColor: `${currentTheme.colors.bgSecondary}dd`,
        color: currentTheme.colors.textMuted,
        borderColor: currentTheme.colors.border,
      }}
    >
      {/* Left section: Status and command count */}
      <div className="flex items-center gap-4">
        {/* Animated status indicator */}
        <div className="flex items-center gap-2">
          <motion.span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: isTyping
                ? currentTheme.colors.warning
                : currentTheme.colors.success,
              boxShadow: `0 0 4px ${isTyping ? currentTheme.colors.warning : currentTheme.colors.success}`,
            }}
            animate={reducedMotion ? {} : pulseVariants[isTyping ? "typing" : "ready"]}
            transition={{
              duration: isTyping ? 0.6 : 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={isTyping ? "typing" : "ready"}
              variants={statusVariants}
              initial={reducedMotion ? false : "initial"}
              animate="animate"
              exit={reducedMotion ? undefined : "exit"}
              transition={{ duration: 0.15 }}
              className="font-medium tracking-wider"
              style={{
                color: isTyping
                  ? currentTheme.colors.warning
                  : currentTheme.colors.success,
              }}
            >
              {isTyping ? "TYPING" : "READY"}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Command count with subtle animation on change */}
        <motion.div
          key={commandCount}
          initial={reducedMotion ? false : { opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1.5"
        >
          <span style={{ color: currentTheme.colors.textMuted }}>
            <span style={{ color: currentTheme.colors.accent }}>{commandCount}</span>
            {" "}cmd{commandCount !== 1 ? "s" : ""}
          </span>
        </motion.div>
      </div>

      {/* Right section: Shortcuts and theme */}
      <div className="flex items-center gap-3">
        {/* Keyboard shortcuts - hidden on small screens */}
        <div className="hidden sm:flex items-center gap-3 text-[10px] opacity-70">
          <ShortcutHint keys="TAB" label="complete" />
          <ShortcutHint keys="↑↓" label="history" />
          <span className="hidden md:inline">
            <ShortcutHint keys="⌘K" label="palette" />
          </span>
          <span className="hidden md:inline">
            <ShortcutHint keys="⌘T" label="theme" />
          </span>
        </div>

        {/* Separator */}
        <span
          className="hidden sm:block w-px h-3"
          style={{ backgroundColor: currentTheme.colors.border }}
        />

        {/* Theme name with glow */}
        <motion.span
          className="font-medium tracking-wide text-glow-sm"
          style={{ color: currentTheme.colors.accent }}
          whileHover={reducedMotion ? {} : { scale: 1.05 }}
          transition={{ duration: 0.1 }}
        >
          {currentTheme.name}
        </motion.span>
      </div>
    </div>
  );
};

// Small helper component for keyboard shortcuts
const ShortcutHint: React.FC<{ keys: string; label: string }> = ({ keys, label }) => (
  <span className="flex items-center gap-1">
    <kbd
      className="px-1 py-0.5 rounded text-[9px] font-mono"
      style={{
        backgroundColor: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {keys}
    </kbd>
    <span>{label}</span>
  </span>
);
