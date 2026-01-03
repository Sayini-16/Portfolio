import React, { useState, useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";

interface TypewriterTextProps {
  text: string;
  speed?: number; // characters per second
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
  respectReducedMotion?: boolean;
  onProgress?: (displayedLength: number) => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 10, // default: visible typing pace
  className = "",
  style = {},
  onComplete,
  respectReducedMotion = true,
  onProgress,
}) => {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Skip animation if user prefers reduced motion
  const skipAnimation = respectReducedMotion && prefersReducedMotion();

  useEffect(() => {
    if (skipAnimation) {
      setDisplayedLength(text.length);
      setIsComplete(true);
      onProgress?.(text.length);
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
        onProgress?.(next);
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
      {showCursor && <span className="typewriter-cursor" />}
    </span>
  );
};
