import React from "react";
import { Terminal } from "lucide-react";
import { themes } from "../lib/themes";
import type { ThemeKey } from "../lib/themes";
import { commands } from "../lib/commands";

interface TerminalHeaderProps {
  currentTheme: (typeof themes)[ThemeKey];
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
  runCommand: (value: string) => void;
  showToast?: (msg: string) => void;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  currentTheme,
  theme,
  setTheme,
  runCommand,
  showToast,
}) => {
  const all = Object.keys(commands) as Array<keyof typeof commands>;
  const hide: string[] = ["clear", "history", "resume", "theme", "themes"]; // curated list for header
  const commandKeys = all.filter((k) => !hide.includes(String(k)));

  return (
    <div className={`${currentTheme.termBg} border-b ${currentTheme.border}`}>
      <div className="px-3 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex items-center gap-2">
            <Terminal size={16} className={currentTheme.accent} />
            <span className={`${currentTheme.secondaryText} text-sm`}>
              Portfolio Terminal
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const themeKeys = Object.keys(themes);
              const currentIndex = themeKeys.indexOf(theme);
              const nextIndex = (currentIndex + 1) % themeKeys.length;
              setTheme(themeKeys[nextIndex] as ThemeKey);
              if (showToast) {
                const nextName = themes[themeKeys[nextIndex] as ThemeKey].name;
                showToast(`Theme changed to ${nextName}`);
              }
            }}
            className={`${currentTheme.secondaryText} ${currentTheme.hoverText} text-xs px-2 py-1 rounded transition-colors`}
          >
            Theme: {themes[theme].name}
          </button>
          {/* Pure terminal mode: no AI badge */}
        </div>
      </div>
      <div
        className={`px-3 py-2 border-t ${currentTheme.border} overflow-x-auto whitespace-nowrap`}
      >
        {commandKeys.map((ck) => (
          <button
            key={ck as string}
            onClick={() => runCommand(String(ck))}
            className={`inline-block text-[11px] mr-2 mb-1 px-2 py-1 rounded border ${currentTheme.border} ${currentTheme.secondaryText} ${currentTheme.hoverText} transition-colors`}
            title={commands[ck].description}
          >
            {ck}
          </button>
        ))}
      </div>
    </div>
  );
};
