import React from "react";
import { useTheme } from "./hooks/useTheme";
import { useTerminal } from "./hooks/useTerminal";

import { TerminalBody } from "./components/TerminalBody";
import { StatusBar } from "./components/StatusBar";
import { TerminalHeader } from "./components/TerminalHeader";
import { Hero3D } from "./components/Hero3D";
import { CommandPalette } from "./components/CommandPalette";
import { Toast } from "./components/Toast";

export default function AIPortfolioTerminal() {
  const { theme, setTheme, currentTheme } = useTheme();
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
  };
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
    runCommand,
  } = useTerminal(theme, setTheme);

  const terminalStyle: React.CSSProperties = {
    "--background": currentTheme.bg,
    "--foreground": currentTheme.text,
    "--primary": currentTheme.primary,
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="h-screen w-screen overflow-hidden bg-background text-foreground font-mono" style={terminalStyle}>
        <div className="h-full w-full flex flex-col md:flex-row">
        {/* Right on desktop, first on mobile: Terminal panel */}
        <div className="order-1 md:order-2 flex w-full md:w-1/2 h-full md:border-l md:border-white/10">
          <div className="flex flex-col h-full w-full m-3 rounded-lg border border-white/10 shadow-xl" style={{ background: "rgba(0,0,0,0.35)" }}>
            <div className="sticky top-0 z-10">
              <TerminalHeader
                currentTheme={currentTheme}
                theme={theme}
                setTheme={setTheme}
                runCommand={runCommand}
                showToast={showToast}
              />
            </div>
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
            <div className="sticky bottom-0 z-10">
              <StatusBar currentTheme={currentTheme} theme={theme} />
            </div>
          </div>
        </div>

        {/* Left on desktop, second on mobile: 3D hero */}
        <div className="order-2 md:order-1 flex w-full md:w-1/2 h-64 md:h-full">
          <Hero3D currentTheme={currentTheme} />
        </div>
        </div>
      </div>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onRun={(cmd) => runCommand(cmd)}
        currentTheme={currentTheme}
      />
      {toast && (
        <Toast message={toast} onClose={() => setToast(null)} currentTheme={currentTheme} />
      )}
    </>
  );
}
