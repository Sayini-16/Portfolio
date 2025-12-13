/**
 * LoadingOverlay - Progress indicator for 3D model loading
 */

import React from "react";
import { motion } from "framer-motion";

interface LoadingOverlayProps {
  progress: number;
  tintColor?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  progress,
  tintColor = "#60a5fa",
}) => {
  return (
    <motion.div
      className="absolute inset-0 z-10 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.35)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col items-center gap-3 px-4 py-3 rounded-md border border-white/10 backdrop-blur-sm">
        {/* Animated spinner */}
        <svg
          className="animate-spin"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="4"
          />
          <path
            d="M22 12a10 10 0 0 0-10-10"
            stroke={tintColor}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        {/* Progress text */}
        <div className="text-xs" style={{ color: tintColor }}>
          Loading model… {Math.round(progress)}%
        </div>

        {/* Progress bar */}
        <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: tintColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};
