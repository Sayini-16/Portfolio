import React, { useRef } from "react";
import { themes } from "../lib/themes";
import type { ThemeKey } from "../lib/themes";
import { MatrixRain } from "./MatrixRain";

interface Hero3DProps {
  currentTheme: (typeof themes)[ThemeKey];
}

export const Hero3D: React.FC<Hero3DProps> = ({ currentTheme }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const randomize = () => {
    const pick = (min: number, max: number) => +(min + Math.random() * (max - min)).toFixed(1);
    const root = rootRef.current;
    if (!root) return;
    root.style.setProperty("--cube-speed", `${pick(10, 26)}s`);
    root.style.setProperty("--ring-speed", `${pick(10, 26)}s`);
    root.style.setProperty("--orb1-speed", `${pick(8, 18)}s`);
    root.style.setProperty("--orb2-speed", `${pick(10, 22)}s`);
    root.style.setProperty("--orb3-speed", `${pick(6, 14)}s`);
  };

  const cubeDuration = (rootRef.current?.style.getPropertyValue("--cube-speed") || "16s") as string;
  const ringDuration = (rootRef.current?.style.getPropertyValue("--ring-speed") || "18s") as string;
  const orb1Duration = (rootRef.current?.style.getPropertyValue("--orb1-speed") || "12s") as string;
  const orb2Duration = (rootRef.current?.style.getPropertyValue("--orb2-speed") || "16s") as string;
  const orb3Duration = (rootRef.current?.style.getPropertyValue("--orb3-speed") || "9s") as string;

  return (
    <div ref={rootRef} className="relative h-full w-full overflow-hidden select-none">
      {/* Animated gradient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.25),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(34,197,94,0.25),transparent_60%)] animate-pulse-slow" />

      {/* Matrix rain overlay (always running) */}
      <MatrixRain currentTheme={currentTheme} />

      {/* Controls */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <button
          onClick={randomize}
          className={`text-[11px] px-2 py-1 rounded border ${currentTheme.border} ${currentTheme.secondaryText} ${currentTheme.hoverText}`}
          title="Randomize visuals"
        >
          Randomize
        </button>
      </div>

      {/* Glow orbs */}
      <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[rgba(99,102,241,0.35)] blur-3xl" />
      <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-[rgba(34,197,94,0.35)] blur-3xl" />

      {/* Theme-colored flares */}
      <div className="flares color-cycle" aria-hidden>
        <span className="flare lg" style={{ left: "20%", top: "28%", color: currentTheme.primary as string }} />
        <span className="flare" style={{ left: "78%", top: "42%", color: currentTheme.primary as string, animationDelay: "1.2s" }} />
        <span className="flare sm" style={{ left: "50%", top: "16%", color: currentTheme.primary as string, animationDelay: "2s" }} />
      </div>

      {/* 3D Cube */}
      <div className="relative h-full w-full flex items-center justify-center perspective-1000">
        <div className="cube rotate-3d" style={{ animationDuration: cubeDuration }}>
          {/* Rotating binary ring */}
          <div className="binary-ring" aria-hidden style={{ animationDuration: ringDuration }}>
            0101 1010 1100 1001 0110 0011 1110 0001
          </div>
          {/* Orbiters */}
          <div className="orbiters" aria-hidden>
            <div className="orbiter" style={{ animationDuration: orb1Duration }} />
            <div className="orbiter" style={{ animationDuration: orb2Duration }} />
            <div className="orbiter" style={{ animationDuration: orb3Duration }} />
          </div>
          <div className="face face--front" style={{ borderColor: "var(--primary)", color: "var(--foreground)" }} title="lambda" aria-label="lambda">&lambda;</div>
          <div className="face face--back" style={{ borderColor: "var(--primary)", color: "var(--foreground)" }} title="braces" aria-label="braces">{"{}"}</div>
          <div className="face face--right" style={{ borderColor: "var(--primary)", color: "var(--foreground)" }} title="pi" aria-label="pi">&pi;</div>
          <div className="face face--left" style={{ borderColor: "var(--primary)", color: "var(--foreground)" }} title="sigma" aria-label="sigma">&Sigma;</div>
          <div className="face face--top" style={{ borderColor: "var(--primary)", color: "var(--foreground)" }} title="function" aria-label="function">&#402;</div>
          <div className="face face--bottom" style={{ borderColor: "var(--primary)", color: "var(--foreground)" }} title="partial" aria-label="partial">&part;</div>
        </div>
        {/* Soft floor shadow */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-72 h-10 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(0,0,0,0.35), rgba(0,0,0,0))" }} />
      </div>

      {/* Caption */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <div className={`text-sm tracking-widest ${currentTheme.accent}`}>Interactive Playground</div>
        <div className={`text-xs ${currentTheme.secondaryText}`}>Matrix rain is always on. Click Randomize to play with the visuals.</div>
      </div>
    </div>
  );
};

