/**
 * @community/ui — 8Hats Lab Design System
 *
 * Production-grade React components with Warm Editorial (Teal/Gold) aesthetic.
 * Token source: ai-native-organization/design-system/
 *
 * 30 components across 5 categories:
 * - Primitives: Button, Badge, Avatar, Tag, Link
 * - Form Controls: Input, Textarea, Select, Checkbox, Switch, SearchInput, FormField, DateInput, RadioGroup
 * - Feedback: Dialog, Toast, Alert, Spinner, Skeleton, Tooltip, Progress
 * - Layout: Stack, Grid, Box, Divider, Accordion
 * - Navigation: Tabs, Breadcrumb, Pagination
 * - Data Display: Card
 */

// ==================== Primitives ====================

export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';

export { Badge } from './components/Badge';
export type { BadgeProps } from './components/Badge';

export { Avatar } from './components/Avatar';
export type { AvatarProps } from './components/Avatar';

export { Tag } from './components/Tag';
export type { TagProps } from './components/Tag';

export { Link } from './components/Link';
export type { LinkProps } from './components/Link';

// ==================== Form Controls ====================

export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';

export { Select } from './components/Select';
export type { SelectProps, SelectOption } from './components/Select';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

export { Switch } from './components/Switch';
export type { SwitchProps } from './components/Switch';

export { SearchInput } from './components/SearchInput';
export type { SearchInputProps } from './components/SearchInput';

export { FormField } from './components/FormField';
export type { FormFieldProps } from './components/FormField';

export { DateInput } from './components/DateInput';
export type { DateInputProps } from './components/DateInput';

export { RadioGroup } from './components/RadioGroup';
export type { RadioGroupProps, RadioOption } from './components/RadioGroup';

// ==================== Feedback ====================

export { Dialog } from './components/Dialog';
export type { DialogProps } from './components/Dialog';

export { Toast } from './components/Toast';
export type { ToastProps } from './components/Toast';

export { Alert } from './components/Alert';
export type { AlertProps } from './components/Alert';

export { Spinner } from './components/Spinner';
export type { SpinnerProps } from './components/Spinner';

export { Skeleton } from './components/Skeleton';
export type { SkeletonProps } from './components/Skeleton';

export { Tooltip } from './components/Tooltip';
export type { TooltipProps } from './components/Tooltip';

export { Progress } from './components/Progress';
export type { ProgressProps } from './components/Progress';

// ==================== Layout ====================

export { Stack } from './components/Stack';
export type { StackProps } from './components/Stack';

export { Grid } from './components/Grid';
export type { GridProps } from './components/Grid';

export { Box } from './components/Box';
export type { BoxProps } from './components/Box';

export { Divider } from './components/Divider';
export type { DividerProps } from './components/Divider';

export { Accordion } from './components/Accordion';
export type { AccordionProps, AccordionItem } from './components/Accordion';

// ==================== Navigation ====================

export { Tabs } from './components/Tabs';
export type { TabsProps, TabItem } from './components/Tabs';

export { Breadcrumb } from './components/Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from './components/Breadcrumb';

export { Pagination } from './components/Pagination';
export type { PaginationProps } from './components/Pagination';

// ==================== Data Display ====================

export { Card, CardHeader, CardBody, CardFooter } from './components/Card';
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps } from './components/Card';

// ==================== Hooks ====================

export { useTheme, ThemeContext } from './hooks/useTheme';
export type { Theme, ThemeContextValue } from './hooks/useTheme';

export { useLocale, LocaleContext } from './hooks/useLocale';
export type { SupportedLocale, LocaleContextValue } from './hooks/useLocale';

// ==================== Types ====================

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
} from './types';

// ==================== Styles ====================

// Import in your app: import '@community/ui/src/styles/globals.css';
