import { useState, useEffect, useCallback } from 'react';
import { themes } from '../lib/themes';
import type { ThemeKey } from '../lib/themes';

export const useTheme = (initialTheme: ThemeKey = 'matrix') => {
  const [theme, setTheme] = useState<ThemeKey>(initialTheme);

  const cycleTheme = useCallback(() => {
    const themeKeys = Object.keys(themes) as ThemeKey[];
    const currentIndex = themeKeys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  }, [theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        cycleTheme();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cycleTheme]);

  return { theme, setTheme, cycleTheme, currentTheme: themes[theme] };
};