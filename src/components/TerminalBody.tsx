import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory, useCurrentTheme, useSuggestions, useTerminalActions } from "../store/terminalStore";
import { HistoryLine } from "./HistoryLine";
import { Autocomplete } from "./Autocomplete";
import { TerminalInput } from "./TerminalInput";
import { terminalLineVariants, durations, prefersReducedMotion } from "../lib/motion";
import type { HistoryEntry } from "../store/terminalStore";

export const TerminalBody: React.FC = () => {
  const history = useHistory();
  const currentTheme = useCurrentTheme();
  const suggestions = useSuggestions();
  const { setInput, setSuggestions } = useTerminalActions();

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null!);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const latestEntryRef = useRef<HTMLDivElement | null>(null);
  const [isOutputTyping, setIsOutputTyping] = useState(false);
  const typingRef = useRef(false);

  // Auto-scroll when new history entries are added - scroll to START of new content
  const prevLenRef = useRef<number>(0);
  useEffect(() => {
    const reduce = prefersReducedMotion();
    const prev = prevLenRef.current;
    const cur = history.length;
    const appended = cur > prev;

    if (appended && latestEntryRef.current) {
      // Scroll to the START of the new entry so user can watch typing animation
      latestEntryRef.current.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'start',
      });
    }

    prevLenRef.current = cur;
  }, [history]);

  useEffect(() => {
    if (history.length === 0) {
      typingRef.current = false;
      setIsOutputTyping(false);
      return;
    }

    const latest = history[history.length - 1];
    if (!latest.output) {
      typingRef.current = false;
      setIsOutputTyping(false);
    }
  }, [history]);

  // Scroll to keep typing content visible - use 'nearest' to avoid jarring jumps
  const scrollToTypingContent = (behavior: ScrollBehavior) => {
    if (latestEntryRef.current) {
      latestEntryRef.current.scrollIntoView({ behavior, block: "nearest" });
    }
  };

  return (
    <div
      ref={terminalRef}
      className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 scroll-smooth"
      onClick={() => {
        if (inputRef.current) {
          try {
            inputRef.current.focus({ preventScroll: true });
          } catch {
            inputRef.current.focus();
          }
        }
      }}
    >
      <AnimatePresence mode="popLayout">
        {history.map((entry: HistoryEntry, index: number) => {
          const isLatest = index === history.length - 1;
          return (
            <motion.div
              key={`history-${index}`}
              ref={isLatest ? latestEntryRef : null}
              variants={terminalLineVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                duration: durations.fast,
                ease: [0, 0, 0.2, 1],
              }}
              layout
            >
              <HistoryLine
                entry={entry}
                isLatest={isLatest}
                onTyping={() => scrollToTypingContent("auto")}
                onTypingStart={() => {
                  if (!typingRef.current) {
                    typingRef.current = true;
                    setIsOutputTyping(true);
                  }
                }}
                onTypingComplete={() => {
                  if (typingRef.current) {
                    typingRef.current = false;
                    setIsOutputTyping(false);
                  }
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="relative mb-8 sm:mb-4">
        <TerminalInput inputRef={inputRef} hidden={isOutputTyping} />
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: durations.fast }}
            >
              <Autocomplete
                suggestions={suggestions}
                currentTheme={currentTheme}
                setInput={setInput}
                setSuggestions={setSuggestions}
                inputRef={inputRef}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Sentinel to ensure the newest content is visible */}
      <div ref={bottomRef} className="h-2" />
    </div>
  );
};
