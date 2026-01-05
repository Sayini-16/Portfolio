import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentTheme, useTerminalActions } from "./store/terminalStore";

import { TerminalBody } from "./components/TerminalBody";
import { StatusBar } from "./components/StatusBar";
import { TerminalHeader } from "./components/TerminalHeader";
import { LazyModelViewer } from "./components/LazyModelViewer";
import { EmptyModelState } from "./components/EmptyModelState";
import { Model3DErrorBoundary } from "./components/ErrorBoundary";
import { CommandPalette } from "./components/CommandPalette";
import { Toast } from "./components/Toast";
import { AnimatedOnMount } from "./components/Animated";
import { CRTEffect } from "./components/CRTEffect";
import { prefersReducedMotion, durations } from "./lib/motion";
import { useMediaQuery } from "./hooks/useMediaQuery";
// Note: 3D model preloading now happens inside LazyModelViewer for better code splitting

const setFaviconColors = (primary: string, accent: string) => {
  if (typeof document === "undefined") return;
  const link = document.getElementById("dynamic-favicon") as HTMLLinkElement | null;
  if (!link) return;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <path fill="${primary}" d="M8 8 L16 16 L8 24 L11 24 L19 16 L11 8 Z" />
  <rect fill="${accent}" x="20" y="22" width="8" height="2" />
</svg>
`.trim();

  link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

function App() {
  const currentTheme = useCurrentTheme();
  const { runCommand, initializeWelcome, cycleTheme } = useTerminalActions();

  const prevThemeRef = React.useRef(currentTheme);
  const [showThemeFlash, setShowThemeFlash] = React.useState(false);
  const [flashColor, setFlashColor] = React.useState("#000");
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const showModel = useMediaQuery("(min-width: 768px)");

  // Initialize welcome message on mount
  React.useEffect(() => {
    initializeWelcome();
  }, [initializeWelcome]);

  // Extract RGB values from primary color for glow effects
  const primaryRgb = currentTheme.colors.primary
    .replace("#", "")
    .match(/.{2}/g)
    ?.map((hex) => parseInt(hex, 16))
    .join(", ") || "74, 222, 128";

  const terminalStyle: React.CSSProperties = {
    "--background": currentTheme.colors.bg,
    "--foreground": currentTheme.colors.text,
    "--primary": currentTheme.colors.primary,
    "--glow-rgb": primaryRgb,
    "--scrollbar-track": `rgba(${primaryRgb}, 0.08)`,
    "--scrollbar-thumb": `rgba(${primaryRgb}, 0.35)`,
    "--scrollbar-thumb-hover": `rgba(${primaryRgb}, 0.55)`,
  } as React.CSSProperties;

  // Keyboard shortcuts
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "t") {
        e.preventDefault();
        cycleTheme();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycleTheme]);

  // Theme transition effect
  React.useEffect(() => {
    // Skip on initial render
    if (prevThemeRef.current === currentTheme) return;

    if (!prefersReducedMotion()) {
      setFlashColor(prevThemeRef.current.colors.bg);
      setShowThemeFlash(true);
      setTimeout(() => setShowThemeFlash(false), 400);
    }

    prevThemeRef.current = currentTheme;
  }, [currentTheme]);

  React.useEffect(() => {
    setFaviconColors(currentTheme.colors.primary, currentTheme.colors.accent);
  }, [currentTheme.colors.primary, currentTheme.colors.accent]);

  return (
    <>
      {/* Theme transition overlay */}
      <AnimatePresence>
        {showThemeFlash && (
          <motion.div
            className="fixed inset-0 z-[100] pointer-events-none"
            style={{ backgroundColor: flashColor }}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durations.slow, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* CRT Effect overlay - controlled by theme settings */}
      <CRTEffect
        enabled={currentTheme.effects?.crt ?? true}
        scanlines={currentTheme.effects?.scanlines ?? true}
        scanlineOpacity={0.06}
        vignette={true}
        vignetteIntensity={0.35}
        flicker={currentTheme.effects?.flicker ?? false}
        glowColor={currentTheme.colors.primary}
      />

      <div
        className="themed-scrollbars h-screen w-screen overflow-hidden bg-background text-foreground font-mono"
        style={terminalStyle}
      >
        <div className="h-full w-full flex flex-col md:flex-row">
          {/* Right on desktop, first on mobile: Terminal panel */}
          <AnimatedOnMount
            as="div"
            className="order-1 md:order-2 flex w-full md:w-1/2 h-full md:border-l md:border-white/10"
            anime={{ delay: 100 }}
          >
            <div
              className="flex flex-col h-full w-full m-2 sm:m-3 rounded-lg border border-white/10 shadow-xl"
              style={{ background: "rgba(0,0,0,0.35)" }}
            >
              <div className="sticky top-0 z-10">
                <TerminalHeader />
              </div>
              <TerminalBody />
              <div className="sticky bottom-0 z-10">
                <StatusBar />
              </div>
            </div>
          </AnimatedOnMount>

          {/* Left on desktop, second on mobile: Local model */}
          {showModel && (
            <AnimatedOnMount
              as="div"
              className="order-2 md:order-1 flex w-full md:w-1/2 h-64 md:h-full"
              anime={{ delay: 0 }}
            >
              <Model3DErrorBoundary accentColor={currentTheme.colors.accent}>
                {import.meta.env.VITE_MODEL_URL ? (
                  <LazyModelViewer
                    url={import.meta.env.VITE_MODEL_URL as string}
                    tintColor={String(currentTheme.colors.primary)}
                    anchor="center"
                    centerAxes="xyz"
                    scale={0.8}
                    position={[0, -0.27, 0]}
                    loadDelay={100}
                    licenseHtml={`<p>3D_Model: Cyber Samurai by KhoaMinh, <a href="https://sketchfab.com/3d-models/cyber-samurai-26ccafaddb2745ceb56ae5cfc65bfed5">source</a>, licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p>`}
                  />
                ) : (
                  <EmptyModelState
                    message="Set VITE_MODEL_URL to load a model"
                    previewSrc={(import.meta as any).env.VITE_MODEL_PREVIEW as string}
                  />
                )}
              </Model3DErrorBoundary>
            </AnimatedOnMount>
          )}
        </div>
      </div>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onRun={(cmd) => runCommand(cmd)}
        currentTheme={currentTheme}
      />
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast}
            onClose={() => setToast(null)}
            currentTheme={currentTheme}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
