import React, { useRef, useState } from "react";
import { useCurrentTheme } from "../store/terminalStore";
import { TypewriterText } from "./TypewriterText";
import { getTypingSpeed } from "../lib/typing";
import type { HistoryEntry } from "../store/terminalStore";

const linkifyText = (
  text: string,
  linkStyle: React.CSSProperties
): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  const pattern =
    /((?:https?:\/\/|www\.)[^\s]+)|([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})|(\+?\d[\d().\s-]{7,}\d)|((?:\.{1,2}\/|\/)[^\s]+\.(?:pdf|png|jpg|jpeg|svg))/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const matchText = match[0];
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      nodes.push(text.slice(lastIndex, matchIndex));
    }

    const isUrl = Boolean(match[1]);
    const isEmail = Boolean(match[2]);
    const isPath = Boolean(match[4]);
    const href = isUrl
      ? matchText.startsWith("http")
        ? matchText
        : `https://${matchText}`
      : isEmail
        ? `mailto:${matchText}`
        : isPath
          ? matchText
          : `tel:${matchText.replace(/[^\d+]/g, "")}`;

    const openNewTab = isUrl || isPath;

    nodes.push(
      <a
        key={`${matchIndex}-${matchText}`}
        href={href}
        target={openNewTab ? "_blank" : undefined}
        rel={openNewTab ? "noreferrer" : undefined}
        style={linkStyle}
      >
        {matchText}
      </a>
    );

    lastIndex = matchIndex + matchText.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
};

interface HistoryLineProps {
  entry: HistoryEntry;
  isLatest?: boolean; // Only animate the latest entry
  onTyping?: () => void;
  onTypingStart?: () => void;
  onTypingComplete?: () => void;
}

export const HistoryLine: React.FC<HistoryLineProps> = ({
  entry,
  isLatest = false,
  onTyping,
  onTypingStart,
  onTypingComplete,
}) => {
  const currentTheme = useCurrentTheme();
  const [typingComplete, setTypingComplete] = useState(!isLatest);
  const startedRef = useRef(false);
  const linkStyle = {
    color: "inherit",
    textDecoration: "underline",
  } as React.CSSProperties;

  // Determine output color based on type
  const getOutputColor = () => {
    switch (entry.output?.type) {
      case "error":
        return currentTheme.colors.error;
      case "success":
        return currentTheme.colors.success;
      case "welcome":
        return currentTheme.colors.accent;
      default:
        return currentTheme.colors.textMuted;
    }
  };

  // If the entry has been marked `updated`, add a short highlight class.
  const highlightClass = entry.updated ? "animate-welcome-highlight" : "";

  const typingSpeed = getTypingSpeed(entry.output?.content?.length || 0);

  return (
    <div className="mb-4" data-line>
      {entry.command && (
        <div className="flex gap-2 mb-1">
          <span style={{ color: currentTheme.colors.primary }}>$</span>
          <span style={{ color: currentTheme.colors.text }}>{entry.command}</span>
          <span
            className="text-xs ml-auto"
            style={{ color: currentTheme.colors.textMuted }}
          >
            {entry.timestamp}
          </span>
        </div>
      )}
      {entry.output && (
        <div
          className={`ml-4 whitespace-pre-wrap ${highlightClass}`}
          style={{ color: getOutputColor() }}
        >
          {isLatest && !typingComplete ? (
            <TypewriterText
              text={entry.output.content}
              speed={typingSpeed}
              onComplete={() => {
                setTypingComplete(true);
                onTypingComplete?.();
                startedRef.current = false;
              }}
              respectReducedMotion={false}
              onProgress={() => {
                if (!startedRef.current) {
                  startedRef.current = true;
                  onTypingStart?.();
                }
                onTyping?.();
              }}
            />
          ) : (
            linkifyText(entry.output.content, linkStyle)
          )}
        </div>
      )}
    </div>
  );
};
