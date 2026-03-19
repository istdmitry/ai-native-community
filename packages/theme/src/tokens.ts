/**
 * Design tokens from org design system (style1-dark.json)
 * Single source of truth for all theme values.
 */

export interface CommunityTokens {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryLighter: string;
  secondary: string;
  secondaryHover: string;
  secondaryLight: string;
  bgMain: string;
  bgAlt: string;
  bgSurface: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  textMain: string;
  textSecondary: string;
  textMuted: string;
  textLight: string;
  border: string;
  borderLight: string;
  borderFocus: string;
  shadowCard: string;
  shadowButton: string;
  radiusCard: string;
  radiusButton: string;
  radiusInput: string;
  glassBg: string;
  glassBorder: string;
  glassBlur: string;
  glassGlow: string;
  swipeYesColor: string;
  swipeYesBg: string;
  swipeNoColor: string;
  swipeNoBg: string;
  swipeCardShadow: string;
  progressBarBg: string;
  progressBarFill: string;
  progressBadgeBg: string;
  progressBadgeText: string;
  resultLevelColor: string;
  resultPillarBarBg: string;
  resultPillarBarFill: string;
  resultLowConfidenceBg: string;
  resultLowConfidenceBorder: string;
  resultLowConfidenceText: string;
}

export const tokens: CommunityTokens = {
  primary: '#0D9E8F',
  primaryHover: '#0BB5A4',
  primaryLight: 'rgba(13, 158, 143, 0.12)',
  primaryLighter: 'rgba(13, 158, 143, 0.06)',
  secondary: '#E0BF4A',
  secondaryHover: '#EDD06B',
  secondaryLight: 'rgba(224, 191, 74, 0.12)',
  bgMain: '#0F1419',
  bgAlt: '#1A1F2E',
  bgSurface: '#252A38',
  bgGradientStart: '#0F1419',
  bgGradientEnd: '#1A1F2E',
  textMain: '#E8E9ED',
  textSecondary: '#B8B9BD',
  textMuted: '#8890A4',
  textLight: '#6B7280',
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.12)',
  borderFocus: '#0D9E8F',
  shadowCard: '0 8px 32px rgba(0, 0, 0, 0.24)',
  shadowButton: '0 4px 24px rgba(13, 158, 143, 0.15)',
  radiusCard: '20px',
  radiusButton: '12px',
  radiusInput: '12px',
  glassBg: 'rgba(37, 42, 56, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassBlur: '14px',
  glassGlow: '0 2px 24px rgba(13, 158, 143, 0.1), 0 0 0 0.5px rgba(255, 255, 255, 0.1)',
  swipeYesColor: '#0D9E8F',
  swipeYesBg: 'rgba(13, 158, 143, 0.15)',
  swipeNoColor: '#F87171',
  swipeNoBg: 'rgba(248, 113, 113, 0.15)',
  swipeCardShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  progressBarBg: '#374151',
  progressBarFill: '#0D9E8F',
  progressBadgeBg: 'rgba(13, 158, 143, 0.15)',
  progressBadgeText: '#0D9E8F',
  resultLevelColor: '#E0BF4A',
  resultPillarBarBg: '#374151',
  resultPillarBarFill: '#0D9E8F',
  resultLowConfidenceBg: 'rgba(224, 191, 74, 0.12)',
  resultLowConfidenceBorder: 'rgba(224, 191, 74, 0.25)',
  resultLowConfidenceText: '#E0BF4A',
};

/**
 * Maps tokens to CSS custom properties.
 * These are set on :root in globals.css.
 */
export function tokensToCSSVariables(t: CommunityTokens): Record<string, string> {
  return {
    '--skin-primary': t.primary,
    '--skin-primary-hover': t.primaryHover,
    '--skin-primary-light': t.primaryLight,
    '--skin-primary-lighter': t.primaryLighter,
    '--skin-secondary': t.secondary,
    '--skin-secondary-hover': t.secondaryHover,
    '--skin-secondary-light': t.secondaryLight,
    '--skin-bg-main': t.bgMain,
    '--skin-bg-alt': t.bgAlt,
    '--skin-bg-surface': t.bgSurface,
    '--skin-bg-gradient-start': t.bgGradientStart,
    '--skin-bg-gradient-end': t.bgGradientEnd,
    '--skin-text-main': t.textMain,
    '--skin-text-secondary': t.textSecondary,
    '--skin-text-muted': t.textMuted,
    '--skin-text-light': t.textLight,
    '--skin-border': t.border,
    '--skin-border-light': t.borderLight,
    '--skin-border-focus': t.borderFocus,
    '--skin-shadow-card': t.shadowCard,
    '--skin-shadow-button': t.shadowButton,
    '--skin-radius-card': t.radiusCard,
    '--skin-radius-button': t.radiusButton,
    '--skin-radius-input': t.radiusInput,
    '--skin-glass-bg': t.glassBg,
    '--skin-glass-border': t.glassBorder,
    '--skin-glass-blur': t.glassBlur,
    '--skin-glass-glow': t.glassGlow,
    '--skin-swipe-yes-color': t.swipeYesColor,
    '--skin-swipe-yes-bg': t.swipeYesBg,
    '--skin-swipe-no-color': t.swipeNoColor,
    '--skin-swipe-no-bg': t.swipeNoBg,
    '--skin-swipe-card-shadow': t.swipeCardShadow,
    '--skin-progress-bar-bg': t.progressBarBg,
    '--skin-progress-bar-fill': t.progressBarFill,
    '--skin-progress-badge-bg': t.progressBadgeBg,
    '--skin-progress-badge-text': t.progressBadgeText,
    '--skin-result-level-color': t.resultLevelColor,
    '--skin-result-pillar-bar-bg': t.resultPillarBarBg,
    '--skin-result-pillar-bar-fill': t.resultPillarBarFill,
    '--skin-result-low-confidence-bg': t.resultLowConfidenceBg,
    '--skin-result-low-confidence-border': t.resultLowConfidenceBorder,
    '--skin-result-low-confidence-text': t.resultLowConfidenceText,
  };
}
