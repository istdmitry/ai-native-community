/**
 * Type exports for @community/ui
 */

export type {
  BaseComponentProps,
  Size,
  Variant,
  ValidationState,
  Spacing,
  ColorScheme,
  SemanticVariant,
  LoadingProps,
  DisabledProps,
  ErrorProps,
  LabelProps,
} from './common';

// Re-export component prop types
export type { ButtonProps } from '../components/Button';
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps } from '../components/Card';
export type { InputProps } from '../components/Input';
export type { RadioGroupProps, RadioOption } from '../components/RadioGroup';
export type { ProgressProps } from '../components/Progress';

// Re-export hook types
export type { Theme, ThemeContextValue } from '../hooks/useTheme';
export type { SupportedLocale, LocaleContextValue } from '../hooks/useLocale';
