import React from "react";
import { useTheme } from "./hooks/useTheme";
import { useTerminal } from "./hooks/useTerminal";

import { TerminalHeader } from "./components/TerminalHeader";
import { TerminalBody } from "./components/TerminalBody";
import { Autocomplete } from "./components/Autocomplete";
import { TerminalInput } from "./components/TerminalInput";
import { StatusBar } from "./components/StatusBar";

export default function AIPortfolioTerminal() {
  const { theme, setTheme, currentTheme } = useTheme();
  const {
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
  } = useTerminal(theme, setTheme);

  const terminalStyle: React.CSSProperties = {
    "--background": currentTheme.bg,
    "--foreground": currentTheme.text,
    "--primary": currentTheme.primary,
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground font-mono p-4 flex flex-col"
      style={terminalStyle}
    >
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
