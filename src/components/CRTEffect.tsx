/**
 * CRT Effect - Retro terminal visual effects
 * Adds scanlines, vignette, and optional flicker for that authentic terminal feel
 */

import React from "react";
import { motion } from "framer-motion";
import { prefersReducedMotion } from "../lib/motion";

interface CRTEffectProps {
  /** Enable/disable the entire effect */
  enabled?: boolean;
  /** Show horizontal scanlines */
  scanlines?: boolean;
  /** Scanline opacity (0-1) */
  scanlineOpacity?: number;
  /** Show vignette (darkened edges) */
  vignette?: boolean;
  /** Vignette intensity (0-1) */
  vignetteIntensity?: number;
  /** Subtle screen flicker effect */
  flicker?: boolean;
  /** RGB color shift on edges */
  chromatic?: boolean;
  /** Glow color for the screen edge */
  glowColor?: string;
}

export const CRTEffect: React.FC<CRTEffectProps> = ({
  enabled = true,
  scanlines = true,
  scanlineOpacity = 0.08,
  vignette = true,
  vignetteIntensity = 0.4,
  flicker = false,
  chromatic = false,
  glowColor,
}) => {
  if (!enabled) return null;

  const reducedMotion = prefersReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Scanlines - horizontal lines across the screen */}
      {scanlines && (
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, ${scanlineOpacity}) 2px,
              rgba(0, 0, 0, ${scanlineOpacity}) 4px
            )`,
            // Subtle animation for scanline movement
            animation: reducedMotion ? 'none' : 'scanlines 8s linear infinite',
          }}
        />
      )}

      {/* Vignette - darkened corners/edges */}
      {vignette && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse at center,
              transparent 40%,
              rgba(0, 0, 0, ${vignetteIntensity * 0.5}) 80%,
              rgba(0, 0, 0, ${vignetteIntensity}) 100%
            )`,
          }}
        />
      )}

      {/* Screen glow - subtle colored glow around edges */}
      {glowColor && (
        <div
          className="absolute inset-0"
          style={{
            boxShadow: `inset 0 0 100px ${glowColor}15, inset 0 0 50px ${glowColor}10`,
          }}
        />
      )}

      {/* Chromatic aberration - RGB shift on edges */}
      {chromatic && (
        <div
          className="absolute inset-0 mix-blend-screen opacity-30"
          style={{
            background: `
              linear-gradient(90deg, rgba(255,0,0,0.03) 0%, transparent 5%, transparent 95%, rgba(0,0,255,0.03) 100%),
              linear-gradient(0deg, rgba(0,255,0,0.02) 0%, transparent 5%, transparent 95%, rgba(255,0,255,0.02) 100%)
            `,
          }}
        />
      )}

      {/* Flicker effect - subtle brightness variation */}
      {flicker && !reducedMotion && (
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.015, 0, 0.01, 0, 0.02, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Add CSS keyframes for scanline animation */}
      <style>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
      `}</style>
    </div>
  );
};

export default CRTEffect;
