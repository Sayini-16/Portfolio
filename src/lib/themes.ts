/**
 * Theme System - Pure color values for terminal themes
 * No Tailwind class strings - these are raw values for maximum flexibility
 */

export interface ThemeColors {
  // Backgrounds
  bg: string;
  bgSecondary: string;
  bgTertiary: string;

  // Text
  text: string;
  textMuted: string;
  textDim: string;

  // Primary accent
  primary: string;

  // Semantic colors
  accent: string;
  error: string;
  success: string;
  warning: string;
  info: string;

  // Borders
  border: string;
  borderHover: string;
}

export interface ThemeEffects {
  glow: boolean;
  scanlines: boolean;
  crt: boolean;
  flicker: boolean;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  effects: ThemeEffects;
}

export const themes: Record<string, Theme> = {
  matrix: {
    name: 'Matrix',
    colors: {
      bg: '#030712',
      bgSecondary: '#0a1628',
      bgTertiary: '#111827',
      text: '#4ade80',
      textMuted: '#6b7280',
      textDim: '#374151',
      primary: '#4ade80',
      accent: '#a855f7',
      error: '#f87171',
      success: '#4ade80',
      warning: '#fbbf24',
      info: '#22d3ee',
      border: '#1f2937',
      borderHover: '#374151',
    },
    effects: {
      glow: true,
      scanlines: true,
      crt: false,
      flicker: false,
    },
  },

  dracula: {
    name: 'Dracula',
    colors: {
      bg: '#282a36',
      bgSecondary: '#1e1f29',
      bgTertiary: '#343746',
      text: '#f8f8f2',
      textMuted: '#6272a4',
      textDim: '#44475a',
      primary: '#bd93f9',
      accent: '#ff79c6',
      error: '#ff5555',
      success: '#50fa7b',
      warning: '#f1fa8c',
      info: '#8be9fd',
      border: '#44475a',
      borderHover: '#6272a4',
    },
    effects: {
      glow: true,
      scanlines: false,
      crt: false,
      flicker: false,
    },
  },

  monokai: {
    name: 'Monokai',
    colors: {
      bg: '#272822',
      bgSecondary: '#1e1e1e',
      bgTertiary: '#3e3d32',
      text: '#f8f8f2',
      textMuted: '#75715e',
      textDim: '#49483e',
      primary: '#ae81ff',
      accent: '#f92672',
      error: '#f92672',
      success: '#a6e22e',
      warning: '#e6db74',
      info: '#66d9ef',
      border: '#3e3d32',
      borderHover: '#75715e',
    },
    effects: {
      glow: false,
      scanlines: false,
      crt: false,
      flicker: false,
    },
  },

  cyberpunk: {
    name: 'Cyberpunk',
    colors: {
      bg: '#0a0e27',
      bgSecondary: '#05081d',
      bgTertiary: '#141833',
      text: '#00ff9f',
      textMuted: '#5b6ad0',
      textDim: '#2a3366',
      primary: '#ff2a6d',
      accent: '#00d9ff',
      error: '#ff2a6d',
      success: '#00ff9f',
      warning: '#ffe66d',
      info: '#00d9ff',
      border: '#ff2a6d40',
      borderHover: '#ff2a6d',
    },
    effects: {
      glow: true,
      scanlines: true,
      crt: true,
      flicker: true,
    },
  },

  hacker: {
    name: 'Hacker',
    colors: {
      bg: '#000000',
      bgSecondary: '#0a0a0a',
      bgTertiary: '#141414',
      text: '#00ff00',
      textMuted: '#008800',
      textDim: '#004400',
      primary: '#00ff00',
      accent: '#00ffff',
      error: '#ff0000',
      success: '#00ff00',
      warning: '#ffff00',
      info: '#00ffff',
      border: '#00ff0030',
      borderHover: '#00ff00',
    },
    effects: {
      glow: true,
      scanlines: true,
      crt: true,
      flicker: true,
    },
  },
};

export type ThemeKey = keyof typeof themes;

// Helper to get CSS custom properties from a theme
export const getThemeCSSVars = (theme: Theme): Record<string, string> => ({
  '--color-bg': theme.colors.bg,
  '--color-bg-secondary': theme.colors.bgSecondary,
  '--color-bg-tertiary': theme.colors.bgTertiary,
  '--color-text': theme.colors.text,
  '--color-text-muted': theme.colors.textMuted,
  '--color-text-dim': theme.colors.textDim,
  '--color-primary': theme.colors.primary,
  '--color-accent': theme.colors.accent,
  '--color-error': theme.colors.error,
  '--color-success': theme.colors.success,
  '--color-warning': theme.colors.warning,
  '--color-info': theme.colors.info,
  '--color-border': theme.colors.border,
  '--color-border-hover': theme.colors.borderHover,
});

// Get all theme keys for iteration
export const themeKeys = Object.keys(themes) as ThemeKey[];
