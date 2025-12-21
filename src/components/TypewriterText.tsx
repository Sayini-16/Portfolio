import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { prefersReducedMotion } from "../lib/motion";

interface TypewriterTextProps {
  text: string;
  speed?: number; // characters per second
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 800, // default: 800 chars/sec (fast but visible)
  className = "",
  style = {},
  onComplete,
}) => {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Skip animation if user prefers reduced motion
  const skipAnimation = prefersReducedMotion();

  useEffect(() => {
    if (skipAnimation) {
      setDisplayedLength(text.length);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    // Reset on text change
    setDisplayedLength(0);
    setIsComplete(false);

    const intervalMs = 1000 / speed;

    intervalRef.current = window.setInterval(() => {
      setDisplayedLength((prev) => {
        const next = prev + 1;
        if (next >= text.length) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setIsComplete(true);
          onComplete?.();
          return text.length;
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, speed, skipAnimation, onComplete]);

  const displayedText = text.slice(0, displayedLength);
  const showCursor = !isComplete;

  return (
    <span className={className} style={style}>
      {displayedText}
      {showCursor && (
        <motion.span
          className="inline-block w-2 h-4 ml-0.5 align-middle"
          style={{ backgroundColor: "currentColor" }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
      )}
    </span>
  );
};
