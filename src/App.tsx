import React from "react";
import { useTheme } from "./hooks/useTheme";
import { useTerminal } from "./hooks/useTerminal";

import { TerminalBody } from "./components/TerminalBody";
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
      className="min-h-screen bg-background text-foreground font-mono flex flex-col"
      style={terminalStyle}
    >
      <TerminalBody
        history={history}
        isTyping={isTyping}
        currentTheme={currentTheme}
        terminalRef={terminalRef}
        inputRef={inputRef}
        input={input}
        setInput={setInput}
        setSuggestions={setSuggestions}
        handleKeyDown={handleKeyDown}
        handleSubmit={handleSubmit}
        suggestions={suggestions}
        theme={theme}
        commandHistory={commandHistory}
      />
      <StatusBar currentTheme={currentTheme} theme={theme} />
    </div>
  );
}
