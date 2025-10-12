import React from "react";
import { themes } from "../lib/themes";
import type { ThemeKey } from "../lib/themes";
import { commands } from "../lib/commands";

interface StatusBarProps {
  commandHistory: string[];
  currentTheme: (typeof themes)[ThemeKey];
  theme: ThemeKey;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  commandHistory,
  currentTheme,
  theme,
}) => {
  return (
    <div
      className={`mt-2 flex items-center justify-between text-xs ${currentTheme.secondaryText}`}
    >
      <div className="flex items-center gap-4">
        <span>Commands: {Object.keys(commands).length}</span>
        <span>History: {commandHistory.length}</span>
        <span>Theme: {themes[theme].name}</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${currentTheme.success} animate-pulse`}
        ></div>
        <span>System Online</span>
      </div>
    </div>
  );
};
