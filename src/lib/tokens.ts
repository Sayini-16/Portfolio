/**
 * Design Tokens - Centralized design system values
 * These tokens provide consistent spacing, typography, and visual effects
 */

// Spacing scale (4px base unit)
export const spacing = {
  0: '0px',
  0.5: '2px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

// Typography
export const typography = {
  fontFamily: {
    mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
    system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  fontSize: {
    xs: '11px',
    sm: '13px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '24px',
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

// Border radius
export const radii = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

// Shadows (including terminal glow effects)
export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px rgba(0, 0, 0, 0.4)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.6)',
} as const;

// Glow effect generators (for terminal aesthetic)
export const glows = {
  text: (color: string) => `0 0 2px ${color}, 0 0 4px ${color}`,
  textStrong: (color: string) => `0 0 4px ${color}, 0 0 8px ${color}, 0 0 12px ${color}`,
  box: (color: string) => `0 0 4px ${color}40, 0 0 8px ${color}30`,
  boxStrong: (color: string) => `0 0 8px ${color}50, 0 0 16px ${color}30, 0 0 24px ${color}20`,
  border: (color: string) => `0 0 1px ${color}, 0 0 2px ${color}`,
  inner: (color: string) => `inset 0 0 20px ${color}15, inset 0 0 40px ${color}08`,
} as const;

// Z-index scale
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  toast: 60,
  tooltip: 70,
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Animation timing
export const durations = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
} as const;

// Easing functions
export const easings = {
  default: [0.25, 0.1, 0.25, 1.0],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 15 },
  springGentle: { type: 'spring', stiffness: 200, damping: 25 },
} as const;

// Opacity scale
export const opacity = {
  0: 0,
  5: 0.05,
  10: 0.1,
  20: 0.2,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  80: 0.8,
  90: 0.9,
  100: 1,
} as const;
