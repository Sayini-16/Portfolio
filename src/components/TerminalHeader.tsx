import React from "react";
import { Terminal, Sparkles } from "lucide-react";
import { themes } from "../../themes";
import type { ThemeKey } from "../../themes";

interface TerminalHeaderProps {
  currentTheme: (typeof themes)[ThemeKey];
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  currentTheme,
  theme,
  setTheme,
}) => {
  return (
    <div
      className={`${currentTheme.termBg} border ${currentTheme.border} rounded-t-lg p-3 flex items-center justify-between`}
    >
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex items-center gap-2">
          <Terminal size={16} className={currentTheme.accent} />
          <span className={`${currentTheme.secondaryText} text-sm`}>
            GameHub
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
          }}
          className={`${currentTheme.secondaryText} ${currentTheme.hoverText} text-xs px-2 py-1 rounded transition-colors`}
        >
          🎨 {themes[theme].name}
        </button>
        <div className="flex items-center gap-2">
          <Sparkles
            size={16}
            className={`${currentTheme.accent} animate-pulse`}
          />
          <span className={`text-xs ${currentTheme.accent}`}>AI POWERED</span>
        </div>
      </div>
    </div>
  );
};
