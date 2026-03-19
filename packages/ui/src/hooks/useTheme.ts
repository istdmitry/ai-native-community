/**
 * useTheme Hook
 *
 * Access theme context for runtime theme switching.
 * Token source: 8Hats Lab Design System (style1-teal-gold.json)
 */

import { useContext, createContext } from 'react';

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    primaryForeground: string;
    secondary: string;
    secondaryHover: string;
    secondaryLight: string;
    secondaryForeground: string;
    background: string;
    backgroundAlt: string;
    surface: string;
    foreground: string;
    foregroundSecondary: string;
    mutedForeground: string;
    success: string;
    successForeground: string;
    warning: string;
    warningForeground: string;
    error: string;
    errorForeground: string;
    info: string;
    infoForeground: string;
    primaryLighter: string;
    border: string;
    borderLight: string;
    borderFocus: string;
    input: string;
    ring: string;
  };
  fonts: {
    display: string;
    sans: string;
  };
  radius: {
    card: string;
    button: string;
    input: string;
  };
}

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
