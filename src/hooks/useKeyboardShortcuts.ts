/**
 * useKeyboardShortcuts - Centralized keyboard shortcut handling
 * Provides a declarative way to register and manage keyboard shortcuts
 */

import { useEffect, useCallback, useRef } from "react";

interface ShortcutConfig {
  /** Key to listen for (e.g., "k", "Escape", "Enter") */
  key: string;
  /** Require Ctrl/Cmd modifier */
  ctrlOrCmd?: boolean;
  /** Require Shift modifier */
  shift?: boolean;
  /** Require Alt/Option modifier */
  alt?: boolean;
  /** Handler function */
  handler: (event: KeyboardEvent) => void;
  /** Prevent default browser behavior */
  preventDefault?: boolean;
  /** Only trigger when no input is focused */
  ignoreInputs?: boolean;
  /** Description for documentation/accessibility */
  description?: string;
}

/**
 * Hook for registering keyboard shortcuts
 * @param shortcuts - Array of shortcut configurations
 * @param enabled - Whether shortcuts are active (default: true)
 */
export function useKeyboardShortcuts(
  shortcuts: ShortcutConfig[],
  enabled: boolean = true
): void {
  // Use ref to avoid recreating handlers on every render
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Check if focus is in an input element
    const isInput =
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      (event.target as HTMLElement)?.isContentEditable;

    for (const shortcut of shortcutsRef.current) {
      // Skip if we should ignore inputs and one is focused
      if (shortcut.ignoreInputs && isInput) continue;

      // Check key match (case-insensitive)
      if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) continue;

      // Check modifiers
      const ctrlOrCmd = event.ctrlKey || event.metaKey;
      if (shortcut.ctrlOrCmd && !ctrlOrCmd) continue;
      if (!shortcut.ctrlOrCmd && ctrlOrCmd) continue;

      if (shortcut.shift && !event.shiftKey) continue;
      if (!shortcut.shift && event.shiftKey) continue;

      if (shortcut.alt && !event.altKey) continue;
      if (!shortcut.alt && event.altKey) continue;

      // Match found!
      if (shortcut.preventDefault !== false) {
        event.preventDefault();
      }
      shortcut.handler(event);
      break; // Only trigger first matching shortcut
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, enabled]);
}

/**
 * Simpler hook for a single shortcut
 */
export function useKeyboardShortcut(
  key: string,
  handler: () => void,
  options: {
    ctrlOrCmd?: boolean;
    shift?: boolean;
    alt?: boolean;
    enabled?: boolean;
    ignoreInputs?: boolean;
  } = {}
): void {
  const { enabled = true, ...shortcutOptions } = options;

  useKeyboardShortcuts(
    [
      {
        key,
        handler,
        ...shortcutOptions,
      },
    ],
    enabled
  );
}

// Common shortcut presets
export const SHORTCUT_PRESETS = {
  commandPalette: { key: "k", ctrlOrCmd: true },
  cycleTheme: { key: "t", ctrlOrCmd: true },
  escape: { key: "Escape" },
  enter: { key: "Enter" },
  arrowUp: { key: "ArrowUp" },
  arrowDown: { key: "ArrowDown" },
  tab: { key: "Tab" },
} as const;

export default useKeyboardShortcuts;
