import React, { useEffect } from "react";
import { motion } from "framer-motion";
import type { Theme } from "../lib/themes";
import { toastVariants } from "../lib/motion";

interface ToastProps {
  message: string;
  onClose: () => void;
  currentTheme: Theme;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  onClose,
  currentTheme,
  duration = 2500,
}) => {
  // Auto-dismiss after duration
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div
        className="px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm"
        style={{
          background: `${currentTheme.colors.bgSecondary}ee`,
          borderColor: currentTheme.colors.border,
        }}
      >
        <span style={{ color: currentTheme.colors.text }}>{message}</span>

        {/* Progress bar */}
        <div className="mt-2 h-0.5 w-full bg-white/10 overflow-hidden rounded-full">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: currentTheme.colors.accent }}
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
};
