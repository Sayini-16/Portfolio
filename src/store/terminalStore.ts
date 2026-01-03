/**
 * Terminal Store - Zustand-based state management
 * Replaces useTerminal hook and TerminalContext
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';
import { themes, type ThemeKey, type Theme } from '../lib/themes';
import { processCommand } from '../lib/commandProcessor';
import { commands } from '../lib/commands';
import { trackCommandUsage } from '../lib/analytics';

// Types
export interface HistoryEntry {
  command?: string;
  output?: {
    type: string;
    content: string;
  };
  updated?: boolean;
  timestamp: string;
}

interface TerminalState {
  // Input state
  input: string;
  suggestions: string[];
  tabCycleQuery: string | null;
  tabCycleIndex: number;

  // History state
  history: HistoryEntry[];
  commandHistory: string[];
  historyIndex: number;

  // Theme state
  theme: ThemeKey;

  // Refs (not persisted, managed separately)
  isTyping: boolean;

  // Persistence
  persistHistory: boolean;
}

interface TerminalActions {
  // Input actions
  setInput: (input: string) => void;
  setSuggestions: (suggestions: string[]) => void;
  clearSuggestions: () => void;
  resetTabCycle: () => void;

  // History actions
  addHistoryEntry: (entry: HistoryEntry) => void;
  clearHistory: () => void;
  setHistoryIndex: (index: number) => void;

  // Theme actions
  setTheme: (theme: ThemeKey) => void;
  cycleTheme: () => void;

  // Persistence actions
  setPersistHistory: (persist: boolean) => void;

  // Command actions
  runCommand: (cmd: string) => void;

  // Keyboard navigation
  navigateHistoryUp: () => void;
  navigateHistoryDown: () => void;
  handleTabComplete: () => void;

  // Initialize welcome message
  initializeWelcome: () => void;
  updateWelcomeTheme: () => void;

}

type TerminalStore = TerminalState & TerminalActions;

// Welcome message generator
const makeWelcome = (themeName: string) => `╔═══════════════════════════════════════════════════╗
║     Welcome to Portfolio Terminal v2.0            ║
║                                                   ║
║  Type 'help' for commands                         ║
║  Press TAB for autocomplete • Use ↑/↓ for history ║
╚═══════════════════════════════════════════════════╝

Current theme: ${themeName}
Type 'themes' to list color schemes.`;

// Create the store
export const useTerminalStore = create<TerminalStore>()(
  persist(
    immer((set, get) => ({
      // Initial state
      input: '',
      suggestions: [],
      tabCycleQuery: null,
      tabCycleIndex: -1,
      history: [],
      commandHistory: [],
      historyIndex: -1,
      theme: 'matrix',
      isTyping: false,
      persistHistory: false,

      // Input actions
      setInput: (input) => set({ input }),

      setSuggestions: (suggestions) => set({ suggestions }),

      clearSuggestions: () => set({ suggestions: [] }),

      resetTabCycle: () => set({ tabCycleQuery: null, tabCycleIndex: -1 }),

      // History actions
      addHistoryEntry: (entry) =>
        set((state) => {
          state.history.push(entry);
        }),

      clearHistory: () =>
        set((state) => {
          state.history = [];
        }),

      setHistoryIndex: (index) => set({ historyIndex: index }),

      // Theme actions
      setTheme: (theme) => {
        set({ theme });
        // Update welcome message with new theme
        get().updateWelcomeTheme();
      },

      cycleTheme: () => {
        const state = get();
        const themeKeys = Object.keys(themes) as ThemeKey[];
        const currentIndex = themeKeys.indexOf(state.theme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        state.setTheme(themeKeys[nextIndex]);
      },

      // Persistence actions
      setPersistHistory: (persist) => set({ persistHistory: persist }),

      // Command execution
      runCommand: (cmd) => {
        const value = cmd.trim();
        if (!value) return;

        const state = get();
        const terminalState = {
          input: state.input,
          setInput: state.setInput,
          history: state.history,
          setHistory: (h: HistoryEntry[]) => set({ history: h }),
          commandHistory: state.commandHistory,
          isTyping: state.isTyping,
          suggestions: state.suggestions,
          setSuggestions: state.setSuggestions,
          inputRef: { current: null },
          terminalRef: { current: null },
          handleSubmit: () => {},
          handleKeyDown: () => {},
          runCommand: state.runCommand,
          theme: state.theme,
          setTheme: state.setTheme,
          persistHistory: state.persistHistory,
          setPersistHistory: state.setPersistHistory,
        };

        const output = processCommand(value, terminalState);
        const commandName = value.split(/\s+/)[0].toLowerCase();
        trackCommandUsage(commandName, output?.type ?? 'noop');

        if (output) {
          const newEntry: HistoryEntry = {
            command: value,
            output,
            timestamp: new Date().toLocaleTimeString(),
          };
          set((s) => {
            s.history.push(newEntry);
            s.commandHistory.push(value);
            s.historyIndex = -1;
            s.input = '';
            s.suggestions = [];
            s.tabCycleQuery = null;
            s.tabCycleIndex = -1;
          });
        } else {
          set((s) => {
            s.commandHistory.push(value);
            s.historyIndex = -1;
            s.input = '';
            s.suggestions = [];
            s.tabCycleQuery = null;
            s.tabCycleIndex = -1;
          });
        }
      },

      // Keyboard navigation
      navigateHistoryUp: () => {
        const state = get();
        if (state.commandHistory.length === 0) return;

        const newIndex = state.historyIndex + 1;
        if (newIndex < state.commandHistory.length) {
          set({
            historyIndex: newIndex,
            input: state.commandHistory[state.commandHistory.length - 1 - newIndex],
            tabCycleQuery: null,
            tabCycleIndex: -1,
          });
        }
      },

      navigateHistoryDown: () => {
        const state = get();
        if (state.historyIndex > 0) {
          const newIndex = state.historyIndex - 1;
          set({
            historyIndex: newIndex,
            input: state.commandHistory[state.commandHistory.length - 1 - newIndex],
            tabCycleQuery: null,
            tabCycleIndex: -1,
          });
        } else {
          set({ historyIndex: -1, input: '', tabCycleQuery: null, tabCycleIndex: -1 });
        }
      },

      handleTabComplete: () => {
        const state = get();
        const trimmedInput = state.input.trim();
        if (!trimmedInput) return;

        const query = state.tabCycleQuery ?? trimmedInput;
        const matchingCommands = Object.keys(commands).filter((cmd) =>
          cmd.startsWith(query.toLowerCase())
        );

        if (matchingCommands.length === 0) {
          set({ suggestions: [], tabCycleQuery: null, tabCycleIndex: -1 });
          return;
        }

        if (!state.tabCycleQuery) {
          if (matchingCommands.length === 1) {
            set({
              input: matchingCommands[0] + ' ',
              suggestions: [],
              tabCycleQuery: null,
              tabCycleIndex: -1,
            });
            return;
          }

          set({
            input: matchingCommands[0] + ' ',
            suggestions: matchingCommands,
            tabCycleQuery: query,
            tabCycleIndex: 0,
          });
          return;
        }

        const nextIndex = (state.tabCycleIndex + 1) % matchingCommands.length;
        set({
          input: matchingCommands[nextIndex] + ' ',
          suggestions: matchingCommands,
          tabCycleIndex: nextIndex,
        });
      },

      // Initialize welcome message
      initializeWelcome: () => {
        const state = get();
        if (state.history.length !== 0) return;
        set((s) => {
          s.history.push({
            output: { type: 'welcome', content: makeWelcome(themes[s.theme].name) },
            timestamp: new Date().toLocaleTimeString(),
          });
        });
      },

      // Update welcome message when theme changes
      updateWelcomeTheme: () => {
        set((state) => {
          if (state.history.length === 0) return;
          const first = state.history[0];
          if (first.output?.type !== 'welcome') return;

          state.history[0] = {
            ...first,
            output: { ...first.output, content: makeWelcome(themes[state.theme].name) },
            updated: true,
          };
        });

        // Clear updated flag after animation
        setTimeout(() => {
          set((state) => {
            if (state.history.length === 0) return;
            const first = state.history[0];
            if (first.output?.type !== 'welcome' || !first.updated) return;
            state.history[0] = { ...first, updated: false };
          });
        }, 300);
      },

    })),
    {
      name: 'terminal-storage',
      partialize: (state) => ({
        theme: state.theme,
        persistHistory: state.persistHistory,
        history: state.persistHistory ? state.history : [],
        commandHistory: state.persistHistory ? state.commandHistory : [],
      }),
    }
  )
);

// Selectors for optimized re-renders
export const useTheme = () => useTerminalStore((s) => s.theme);
export const useCurrentTheme = (): Theme => useTerminalStore((s) => themes[s.theme]);
export const useHistory = () => useTerminalStore((s) => s.history);
export const useInput = () => useTerminalStore((s) => s.input);
export const useSuggestions = () => useTerminalStore((s) => s.suggestions);

// Actions - use useShallow to prevent infinite loops when returning objects
export const useTerminalActions = () =>
  useTerminalStore(
    useShallow((s) => ({
      setInput: s.setInput,
      setSuggestions: s.setSuggestions,
      clearSuggestions: s.clearSuggestions,
      resetTabCycle: s.resetTabCycle,
      runCommand: s.runCommand,
      setTheme: s.setTheme,
      cycleTheme: s.cycleTheme,
      navigateHistoryUp: s.navigateHistoryUp,
      navigateHistoryDown: s.navigateHistoryDown,
      handleTabComplete: s.handleTabComplete,
      initializeWelcome: s.initializeWelcome,
      clearHistory: s.clearHistory,
    }))
  );
