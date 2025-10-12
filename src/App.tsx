import React, { useState, useEffect, useRef } from "react";
import { themes } from "../themes";
import type { ThemeKey } from "../themes";
import { commands } from "../commands";
import type { CommandKey } from "../commands";
import { aiResponses } from "../ai";

import { TerminalHeader } from "./components/TerminalHeader";
import { TerminalBody } from "./components/TerminalBody";
import { Autocomplete } from "./components/Autocomplete";
import { TerminalInput } from "./components/TerminalInput";
import { StatusBar } from "./components/StatusBar";

interface HistoryEntry {
  command?: string;
  output?: {
    type: string;
    content: string;
  };
  // optional flag to trigger a brief highlight animation
  updated?: boolean;
  timestamp: string;
}

export default function AIPortfolioTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState<ThemeKey>("matrix");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const currentTheme = themes[theme];

  // Helper to cycle themes programmatically
  const cycleTheme = () => {
    const themeKeys = Object.keys(themes) as ThemeKey[];
    const currentIndex = themeKeys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  };

  // AI keyword mapping for cleaner command processing
  const aiCommandMap = {
    greetings: /^(hi|hello|hey|greetings|howdy|yo)/,
    technologies: /technolog|stack|language|tools/,
    unique: /unique|different|stand out|special/,
    latest: /latest project|recent project|current project|working on/,
    best: /best project|favorite project|proudest/,
    hire: /hire|job|opportunity|available|looking for/,
    passionate: /passionate|love|enjoy|motivate/,
    learning: /learn|studying|improve|education/,
    advice: /advice|tip|recommend|suggest/,
  };

  const processCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return null;

    // Split command and arguments
    const parts = trimmedCmd.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    // Check for exact command matches
    if (command in commands && commands[command as CommandKey]) {
      const commandContext = {
        commandHistory,
        theme,
        setTheme,
        setHistory,
      };
      return commands[command as CommandKey].execute(commandContext, args);
    }

    // AI-powered natural language processing
    const lowerCmd = trimmedCmd.toLowerCase();

    for (const key in aiCommandMap) {
      const keyword = key as keyof typeof aiCommandMap;
      if (lowerCmd.match(aiCommandMap[keyword])) {
        return {
          type: "ai",
          content: aiResponses[keyword](),
        };
      }
    }

    // Unknown command
    return {
      type: "error",
      content: `Command not found: ${command}\n\nType 'help' for available commands or try asking me a question!\nExample: "What technologies do you know?"`,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const newEntry = {
      command: input,
      output: processCommand(input),
      timestamp: new Date().toLocaleTimeString(),
    };

    setHistory([...history, newEntry]);
    setCommandHistory([...commandHistory, input]);
    setHistoryIndex(-1);
    setInput("");
    setSuggestions([]);
    setIsTyping(true);

    setTimeout(() => setIsTyping(false), 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (input.trim()) {
        const matchingCommands = Object.keys(commands).filter((cmd) =>
          cmd.startsWith(input.toLowerCase().trim())
        );
        if (matchingCommands.length === 1) {
          setInput(matchingCommands[0] + " ");
          setSuggestions([]);
        } else if (matchingCommands.length > 1) {
          setSuggestions(matchingCommands);
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
    } else {
      // Update suggestions as user types
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
    // Create the welcome content (so we can reuse it on theme changes)
    const makeWelcome = (
      themeName: string
    ) => `╔═══════════════════════════════════════════════════════════╗
║     Welcome to AI-Powered Portfolio Terminal v2.0         ║
║                                                           ║
║  Type 'help' for commands or chat naturally with AI       ║
║  Press TAB for autocomplete • Use ↑/↓ for history         ║
╚═══════════════════════════════════════════════════════════╝

  Current theme: ${themeName}
  Type 'themes' to see all available color schemes!
  
  Try: "What technologies do you know?" or "Tell me about your projects"`;

    if (history.length === 0) {
      setHistory([
        {
          output: {
            type: "welcome",
            content: makeWelcome(themes[theme].name),
          },
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      return;
    }

    // If we've already populated history, update the existing welcome entry
    // so the "Current theme:" line reflects the newly selected theme.
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const first = prev[0];
      if (first.output?.type !== "welcome") return prev;
      const updatedFirst = {
        ...first,
        output: {
          ...first.output,
          content: makeWelcome(themes[theme].name),
        },
        // mark as updated so HistoryLine can animate it
        updated: true,
      };
      // Clear the `updated` flag after a short delay so animation can run once
      setTimeout(() => {
        setHistory((cur) => {
          if (cur.length === 0) return cur;
          const f = cur[0];
          if (f.output?.type !== "welcome" || !f.updated) return cur;
          const cleared = { ...f, updated: false };
          return [cleared, ...cur.slice(1)];
        });
      }, 1000);

      return [updatedFirst, ...prev.slice(1)];
    });
  }, [theme, history.length]);

  // Keyboard shortcut: Ctrl+T to cycle themes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ctrl+T or Cmd+T
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "t") {
        e.preventDefault();
        cycleTheme();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [theme]);

  return (
      <div
      className="min-h-screen bg-background text-foreground font-mono p-4 flex flex-col"
      style={{
        ["--background" as any]: currentTheme.bg,
        ["--foreground" as any]: currentTheme.text,
        ["--primary" as any]: currentTheme.primary,
      }}>
      <h1 className="text-4xl font-bold italic text-center mb-4 text-primary">
        GameHub
      </h1>

      <TerminalHeader
        currentTheme={currentTheme}
        theme={theme}
        setTheme={setTheme}
      />

      <TerminalBody
        history={history}
        isTyping={isTyping}
        currentTheme={currentTheme}
        terminalRef={terminalRef}
        inputRef={inputRef}
      />

      <Autocomplete
        suggestions={suggestions}
        currentTheme={currentTheme}
        setInput={setInput}
        setSuggestions={setSuggestions}
        inputRef={inputRef}
      />

      <TerminalInput
        handleSubmit={handleSubmit}
        input={input}
        setInput={setInput}
        setSuggestions={setSuggestions}
        handleKeyDown={handleKeyDown}
        inputRef={inputRef}
        currentTheme={currentTheme}
        theme={theme}
      />

      <StatusBar
        commandHistory={commandHistory}
        currentTheme={currentTheme}
        theme={theme}
      />
    </div>
  );
}
