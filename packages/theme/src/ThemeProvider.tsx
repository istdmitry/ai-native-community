'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { tokens, tokensToCSSVariables } from './tokens';
import type { CommunityTokens } from './tokens';

interface ThemeContextValue {
  tokens: CommunityTokens;
}

const ThemeContext = createContext<ThemeContextValue>({ tokens });

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Simplified ThemeProvider for AI-Native Community.
 * Single dark theme — no multi-skin, no partner resolution.
 * Applies CSS variables from org design system tokens.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    const cssVars = tokensToCSSVariables(tokens);
    const root = document.documentElement;

    for (const [key, value] of Object.entries(cssVars)) {
      root.style.setProperty(key, value);
    }

    root.classList.add('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ tokens }}>
      {children}
    </ThemeContext.Provider>
  );
}
