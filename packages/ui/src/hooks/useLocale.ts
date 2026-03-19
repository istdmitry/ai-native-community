/**
 * useLocale Hook
 *
 * Access locale context for internationalization.
 * Provides current locale and methods for locale switching.
 */

import { useContext, createContext } from 'react';

export type SupportedLocale = 'en' | 'ru';

export interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
}

export const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

/**
 * Hook to access locale context
 *
 * @returns Locale context value with current locale and setter
 * @throws Error if used outside LocaleProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { locale, setLocale } = useLocale();
 *
 *   return (
 *     <div>
 *       <p>Current locale: {locale}</p>
 *       <button onClick={() => setLocale('ru')}>Switch to Russian</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }

  return context;
}
