/**
 * TerminalHeader - Enhanced terminal header with traffic lights and command bar
 * Features animated hover states, glowing accents, and quick command buttons
 */

import React from "react";
import { motion } from "framer-motion";
import { Terminal, Sparkles } from "lucide-react";
import { useCurrentTheme, useTerminalActions } from "../store/terminalStore";
import { commands } from "../lib/commands";
import { prefersReducedMotion } from "../lib/motion";

// Traffic light button component
const TrafficLight: React.FC<{
  color: string;
  hoverColor: string;
  glowColor: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}> = ({ color, hoverColor, glowColor, onClick, icon }) => {
  const reducedMotion = prefersReducedMotion();

  return (
    <motion.button
      className="w-3 h-3 rounded-full flex items-center justify-center group"
      style={{ backgroundColor: color }}
      onClick={onClick}
      whileHover={
        reducedMotion
          ? {}
          : {
              scale: 1.15,
              backgroundColor: hoverColor,
              boxShadow: `0 0 8px ${glowColor}`,
            }
      }
      whileTap={reducedMotion ? {} : { scale: 0.9 }}
      transition={{ duration: 0.1 }}
    >
      {icon && (
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-black/60 text-[8px]">
          {icon}
        </span>
      )}
    </motion.button>
  );
};

// Command button component
const CommandButton: React.FC<{
  command: string;
  description: string;
  onClick: () => void;
  accentColor: string;
  borderColor: string;
  textColor: string;
}> = ({ command, description, onClick, accentColor, borderColor, textColor }) => {
  const reducedMotion = prefersReducedMotion();

  return (
    <motion.button
      onClick={onClick}
      className="inline-block text-[11px] mr-2 mb-1 px-2 py-1 rounded border"
      style={{
        borderColor,
        color: textColor,
      }}
      title={description}
      whileHover={
        reducedMotion
          ? {}
          : {
              borderColor: accentColor,
              color: accentColor,
              boxShadow: `0 0 4px ${accentColor}40`,
              y: -1,
            }
      }
      whileTap={reducedMotion ? {} : { scale: 0.97 }}
      transition={{ duration: 0.1 }}
    >
      {command}
    </motion.button>
  );
};

export const TerminalHeader: React.FC = () => {
  const currentTheme = useCurrentTheme();
  const { cycleTheme, runCommand } = useTerminalActions();
  const reducedMotion = prefersReducedMotion();

  // Filter out utility commands from quick access
  const all = Object.keys(commands) as Array<keyof typeof commands>;
  const hide: string[] = ["clear", "history", "resume", "theme", "themes"];
  const commandKeys = all.filter((k) => !hide.includes(String(k)));

  return (
    <div
      style={{
        backgroundColor: `${currentTheme.colors.bgSecondary}ee`,
        borderColor: currentTheme.colors.border,
      }}
      className="border-b backdrop-blur-sm"
    >
      {/* Main header row */}
      <div className="px-3 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-2">
            <TrafficLight
              color="#ff5f57"
              hoverColor="#ff7b74"
              glowColor="#ff5f57"
              icon="×"
            />
            <TrafficLight
              color="#febc2e"
              hoverColor="#ffc94d"
              glowColor="#febc2e"
              icon="−"
            />
            <TrafficLight
              color="#28c840"
              hoverColor="#4ed964"
              glowColor="#28c840"
              icon="+"
            />
          </div>

          {/* Terminal title */}
          <div className="flex items-center gap-2">
            <motion.div
              animate={
                reducedMotion
                  ? {}
                  : {
                      filter: [
                        `drop-shadow(0 0 2px ${currentTheme.colors.accent})`,
                        `drop-shadow(0 0 4px ${currentTheme.colors.accent})`,
                        `drop-shadow(0 0 2px ${currentTheme.colors.accent})`,
                      ],
                    }
              }
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Terminal size={16} style={{ color: currentTheme.colors.accent }} />
            </motion.div>
            <span
              className="text-sm font-medium"
              style={{ color: currentTheme.colors.textMuted }}
            >
              Portfolio Terminal
            </span>
          </div>
        </div>

        {/* Theme button */}
        <motion.button
          onClick={cycleTheme}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border"
          style={{
            color: currentTheme.colors.accent,
            backgroundColor: `${currentTheme.colors.bgTertiary}80`,
            borderColor: currentTheme.colors.border,
          }}
          whileHover={
            reducedMotion
              ? {}
              : {
                  borderColor: currentTheme.colors.accent,
                  boxShadow: `0 0 8px ${currentTheme.colors.accent}30`,
                }
          }
          whileTap={reducedMotion ? {} : { scale: 0.97 }}
          transition={{ duration: 0.15 }}
        >
          <Sparkles size={12} />
          <span>{currentTheme.name}</span>
        </motion.button>
      </div>

      {/* Command bar */}
      <div
        className="px-3 py-2 border-t overflow-x-auto whitespace-nowrap scrollbar-thin"
        style={{ borderColor: `${currentTheme.colors.border}80` }}
      >
        {commandKeys.map((ck) => (
          <CommandButton
            key={ck as string}
            command={String(ck)}
            description={commands[ck].description}
            onClick={() => runCommand(String(ck))}
            accentColor={currentTheme.colors.accent}
            borderColor={currentTheme.colors.border}
            textColor={currentTheme.colors.textMuted}
          />
        ))}
      </div>
    </div>
  );
};
