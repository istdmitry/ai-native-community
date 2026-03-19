/**
 * Common TypeScript types for UI components
 * 8Hats Lab Design System
 */

import type { ReactNode } from 'react';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export type Size = 'sm' | 'md' | 'lg';

export type Variant = 'primary' | 'secondary' | 'gold' | 'ghost' | 'pill';

export type ValidationState = 'default' | 'error' | 'success';

export type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ColorScheme = 'light' | 'dark';

export type SemanticVariant = 'info' | 'success' | 'warning' | 'error';

export interface LoadingProps {
  loading?: boolean;
}

export interface DisabledProps {
  disabled?: boolean;
}

export interface ErrorProps {
  error?: string;
}

export interface LabelProps {
  label?: string;
}
