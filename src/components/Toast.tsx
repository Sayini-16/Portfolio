import React, { useEffect } from "react";
import { themes } from "../lib/themes";
import type { ThemeKey } from "../lib/themes";

interface ToastProps {
  message: string;
  onClose: () => void;
  currentTheme: (typeof themes)[ThemeKey];
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, currentTheme }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 2200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`px-3 py-2 rounded-md border ${currentTheme.border} shadow-lg`} style={{ background: "rgba(0,0,0,0.7)" }}>
        <span className={currentTheme.text}>{message}</span>
      </div>
    </div>
  );
};

