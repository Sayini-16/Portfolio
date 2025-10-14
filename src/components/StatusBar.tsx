import React from "react";
import { themes } from "../lib/themes";
import type { ThemeKey } from "../lib/themes";

interface StatusBarProps {
  currentTheme: (typeof themes)[ThemeKey];
  theme: ThemeKey;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  currentTheme,
  theme,
}) => {
  return (
    <div
      className={`bg-background text-foreground text-xs p-1 flex justify-between items-center`}
      style={{
        "--background": currentTheme.bg,
        "--foreground": currentTheme.text,
      }}
    >
      <div>
        <span>TAB: autocomplete</span>
        <span className="mx-2">|</span>
        <span>↑/↓: history</span>
        <span className="mx-2">|</span>
        <span>ESC: clear suggestions</span>
      </div>
      <div>
        <span>Theme: {themes[theme].name}</span>
      </div>
    </div>
  );
};