import React, { useEffect, useMemo, useState } from "react";
import { commands } from "../lib/commands";
import { themes } from "../lib/themes";
import type { ThemeKey } from "../lib/themes";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onRun: (cmd: string) => void;
  currentTheme: (typeof themes)[ThemeKey];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  onRun,
  currentTheme,
}) => {
  const all = useMemo(() => {
    return Object.entries(commands).map(([k, v]) => ({ key: k, description: v.description }));
  }, []);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[index];
        if (item) {
          onRun(item.key);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, onClose]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setIndex(0);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((c) => c.key.includes(q) || c.description.toLowerCase().includes(q));
  }, [all, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-1/2 top-24 -translate-x-1/2 w-[92%] max-w-xl">
        <div className={`rounded-lg border ${currentTheme.border} shadow-xl overflow-hidden`} style={{ background: `rgba(0,0,0,0.7)` }}>
          <div className="p-3 border-b border-white/10">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command (e.g., projects)"
              className={`w-full bg-transparent outline-none ${currentTheme.text}`}
            />
          </div>
          <div className="max-h-72 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className={`p-3 ${currentTheme.secondaryText}`}>No matches</div>
            ) : (
              filtered.map((c, i) => (
                <button
                  key={c.key}
                  onClick={() => {
                    onRun(c.key);
                    onClose();
                  }}
                  className={`w-full text-left px-3 py-2 border-b border-white/5 ${
                    i === index ? currentTheme.accent : currentTheme.secondaryText
                  } hover:${currentTheme.hoverText}`}
                >
                  <div className="text-sm">
                    <span className={`mr-2 ${currentTheme.text}`}>{c.key}</span>
                    <span className="opacity-75">{c.description}</span>
                  </div>
                </button>
              ))
            )}
          </div>
          <div className={`flex justify-between items-center text-[11px] px-3 py-2 ${currentTheme.secondaryText}`}>
            <div>↑/↓ select • Enter run • Esc close</div>
            <div>Tip: Press Ctrl/Cmd+K to open</div>
          </div>
        </div>
      </div>
    </div>
  );
};

