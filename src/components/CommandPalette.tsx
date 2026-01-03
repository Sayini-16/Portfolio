  /**
 * CommandPalette - Mobile-friendly command palette
 * Appears as centered modal on desktop, bottom sheet on mobile
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command } from "lucide-react";
import { commands } from "../lib/commands";
import type { Theme } from "../lib/themes";
import {
  backdropVariants,
  durations,
  prefersReducedMotion,
} from "../lib/motion";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onRun: (cmd: string) => void;
  currentTheme: Theme;
}

// Desktop: slide down from top; Mobile: slide up from bottom
const sheetVariantsDesktop = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
};

const sheetVariantsMobile = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 },
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  onRun,
  currentTheme,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reducedMotion = prefersReducedMotion();

  // Detect mobile (simple check)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const all = useMemo(() => {
    return Object.entries(commands).map(([k, v]) => ({
      key: k,
      description: v.description,
    }));
  }, []);

  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (c) => c.key.includes(q) || c.description.toLowerCase().includes(q)
    );
  }, [all, query]);

  // Scroll selected item into view
  useEffect(() => {
    if (!open || !listRef.current) return;
    const selectedEl = listRef.current.querySelector(`[data-index="${index}"]`);
    selectedEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [index, open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[index];
        if (item) {
          onRun(item.key);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, onClose, filtered, onRun]);

  // Reset on open
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setIndex(0);
    // Focus input after animation starts
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const handleSelect = (key: string) => {
    onRun(key);
    onClose();
  };

  const sheetVariants = isMobile ? sheetVariantsMobile : sheetVariantsDesktop;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: durations.fast }}
            onClick={onClose}
          />

          {/* Sheet - positioned differently for mobile vs desktop */}
          <div
            className={`
              absolute w-full sm:w-[92%] sm:max-w-xl
              ${isMobile ? "bottom-0 left-0 right-0" : "left-1/2 top-24 -translate-x-1/2"}
            `}
          >
            <motion.div
              className={`
                border shadow-2xl overflow-hidden
                ${isMobile ? "rounded-t-2xl border-b-0" : "rounded-lg"}
              `}
              style={{
                background: currentTheme.colors.bgSecondary,
                borderColor: currentTheme.colors.border,
              }}
              variants={reducedMotion ? {} : sheetVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                duration: isMobile ? 0.3 : 0.2,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              {/* Drag handle for mobile */}
              {isMobile && (
                <div className="flex justify-center py-2">
                  <div
                    className="w-10 h-1 rounded-full"
                    style={{ backgroundColor: currentTheme.colors.border }}
                  />
                </div>
              )}

              {/* Search input */}
              <div
                className="p-3 sm:p-3 border-b flex items-center gap-2"
                style={{ borderColor: currentTheme.colors.border }}
              >
                <Search
                  size={18}
                  style={{ color: currentTheme.colors.textMuted }}
                />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIndex(0);
                  }}
                  placeholder="Search commands..."
                  className="w-full bg-transparent outline-none text-base"
                  style={{ color: currentTheme.colors.text }}
                />
              </div>

              {/* Command list */}
              <div
                ref={listRef}
                className={`overflow-y-auto ${isMobile ? "max-h-[50vh]" : "max-h-72"}`}
              >
                {filtered.length === 0 ? (
                  <div
                    className="p-4 text-center"
                    style={{ color: currentTheme.colors.textMuted }}
                  >
                    No commands found
                  </div>
                ) : (
                  filtered.map((c, i) => (
                    <motion.button
                      key={c.key}
                      data-index={i}
                      onClick={() => handleSelect(c.key)}
                      className={`
                        w-full text-left px-3 border-b transition-colors
                        ${isMobile ? "py-3.5" : "py-2.5"}
                        touch-manipulation
                      `}
                      style={{
                        borderColor: `${currentTheme.colors.border}40`,
                        color:
                          i === index
                            ? currentTheme.colors.accent
                            : currentTheme.colors.textMuted,
                        backgroundColor:
                          i === index
                            ? `${currentTheme.colors.primary}15`
                            : "transparent",
                      }}
                      whileHover={
                        reducedMotion
                          ? {}
                          : { backgroundColor: `${currentTheme.colors.primary}10` }
                      }
                      whileTap={reducedMotion ? {} : { scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${isMobile ? "text-base" : "text-sm"}`}
                          style={{ color: currentTheme.colors.text }}
                        >
                          {c.key}
                        </span>
                        <span
                          className={`opacity-60 ${isMobile ? "text-sm" : "text-xs"}`}
                        >
                          {c.description}
                        </span>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div
                className={`
                  flex justify-between items-center px-3 border-t
                  ${isMobile ? "py-3 pb-safe" : "py-2"}
                `}
                style={{
                  color: currentTheme.colors.textMuted,
                  borderColor: currentTheme.colors.border,
                  backgroundColor: currentTheme.colors.bgTertiary,
                }}
              >
                {/* Desktop: show keyboard shortcuts */}
                <div className="hidden sm:flex items-center gap-3 text-[11px]">
                  <span>↑↓ navigate</span>
                  <span>↵ select</span>
                  <span>esc close</span>
                </div>

                {/* Mobile: tap to close hint */}
                <div className="sm:hidden text-xs opacity-70">
                  Tap outside to close
                </div>

                {/* Right side */}
                <div className="flex items-center gap-1 text-xs">
                  <Command size={12} />
                  <span>K</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
