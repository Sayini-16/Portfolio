import { useState, useEffect, useRef } from 'react';
import { processCommand } from '../lib/commandProcessor';
import { themes } from '../lib/themes';
import { commands } from '../lib/commands';
import type { ThemeKey } from '../lib/themes';

export interface HistoryEntry {
  command?: string;
  output?: {
    type: string;
    content: string;
  };
  updated?: boolean;
  timestamp: string;
}

export const useTerminal = (theme: ThemeKey, setTheme: (theme: ThemeKey) => void) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping] = useState(false); // pure terminal: no typing animation
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const runCommand = (cmd: string) => {
    const value = cmd.trim();
    if (!value) return;

    const commandContext = {
      commandHistory,
      theme,
      setTheme,
      setHistory,
    };

    const output = processCommand(value, commandContext);
    if (output) {
      const newEntry = {
        command: value,
        output,
        timestamp: new Date().toLocaleTimeString(),
      };
      setHistory([...history, newEntry]);
    }
    setCommandHistory([...commandHistory, value]);
    setHistoryIndex(-1);
    setInput('');
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (input.trim()) {
        const matchingCommands = Object.keys(commands).filter((cmd) =>
          cmd.startsWith(input.toLowerCase().trim())
        );
        if (matchingCommands.length === 1) {
          setInput(matchingCommands[0] + ' ');
          setSuggestions([]);
        } else if (matchingCommands.length > 1) {
          setSuggestions(matchingCommands);
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    } else {
      if (input.length > 0) {
        const matchingCommands = Object.keys(commands).filter((cmd) =>
          cmd.startsWith(input.toLowerCase())
        );
        setSuggestions(matchingCommands.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    const makeWelcome = (themeName: string) =>  `╔═══════════════════════════════════════════════════════════╗
║     Welcome to Portfolio Terminal v2.0                    ║
║                                                           ║
║  Type 'help' for commands                                 ║
║  Press TAB for autocomplete • Use ↑/↓ for history         ║
╚═══════════════════════════════════════════════════════════╝

Current theme: ${themeName}
Type 'themes' to list color schemes.`;

    if (history.length === 0) {
      setHistory([
        {
          output: { type: 'welcome', content: makeWelcome(themes[theme].name) },
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      return;
    }

    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const first = prev[0];
      if (first.output?.type !== 'welcome') return prev;
      const updatedFirst = {
        ...first,
        output: { ...first.output, content: makeWelcome(themes[theme].name) },
        updated: true,
      };
      setTimeout(() => {
        setHistory((cur) => {
          if (cur.length === 0) return cur;
          const f = cur[0];
          if (f.output?.type !== 'welcome' || !f.updated) return cur;
          const cleared = { ...f, updated: false };
          return [cleared, ...cur.slice(1)];
        });
      }, 300);

      return [updatedFirst, ...prev.slice(1)];
    });
  }, [theme]);

  return {
    input,
    setInput,
    history,
    commandHistory,
    isTyping,
    suggestions,
    setSuggestions,
    inputRef,
    terminalRef,
    handleSubmit,
    handleKeyDown,
    runCommand,
  };
};

