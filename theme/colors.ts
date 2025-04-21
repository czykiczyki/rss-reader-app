/**
 * Global color definitions for the app
 */

// Main palette
export const colors = {
  // Primary colors
  primary: {
    lightest: '#EFF6FF',
    lighter: '#DBEAFE',
    light: '#93C5FD',
    main: '#3B82F6',
    dark: '#2563EB',
    darker: '#1D4ED8',
    darkest: '#1E3A8A',
  },

  // Secondary/accent colors
  accent: {
    lightest: '#FFF7ED',
    lighter: '#FFEDD5',
    light: '#FED7AA',
    main: '#F97316',
    dark: '#EA580C',
    darker: '#C2410C',
    darkest: '#7C2D12',
  },

  // Success states
  success: {
    lightest: '#ECFDF5',
    lighter: '#D1FAE5',
    light: '#6EE7B7',
    main: '#10B981',
    dark: '#059669',
    darker: '#047857',
    darkest: '#064E3B',
  },

  // Warning states
  warning: {
    lightest: '#FFFBEB',
    lighter: '#FEF3C7',
    light: '#FCD34D',
    main: '#F59E0B',
    dark: '#D97706',
    darker: '#B45309',
    darkest: '#78350F',
  },

  // Error states
  error: {
    lightest: '#FEF2F2',
    lighter: '#FEE2E2',
    light: '#FCA5A5',
    main: '#EF4444',
    dark: '#DC2626',
    darker: '#B91C1C',
    darkest: '#7F1D1D',
  },

  // Neutrals/Grays
  neutral: {
    white: '#FFFFFF',
    lightest: '#F9FAFB',
    lighter: '#F3F4F6',
    light: '#E5E7EB',
    medium: '#D1D5DB',
    main: '#9CA3AF',
    dark: '#6B7280',
    darker: '#4B5563',
    darkest: '#1F2937',
    black: '#111827',
  },

  // Transparent colors
  transparent: {
    light: 'rgba(255, 255, 255, 0.85)',
    medium: 'rgba(255, 255, 255, 0.6)',
    dark: 'rgba(0, 0, 0, 0.5)',
    darker: 'rgba(0, 0, 0, 0.7)',
  },
};

// Semantic color mapping
export const semanticColors = {
  background: {
    primary: colors.neutral.white,
    secondary: colors.neutral.lightest,
    tertiary: colors.neutral.lighter,
  },
  text: {
    primary: colors.neutral.black,
    secondary: colors.neutral.darker,
    tertiary: colors.neutral.dark,
    inverse: colors.neutral.white,
    accent: colors.primary.main,
    error: colors.error.dark,
    success: colors.success.dark,
    warning: colors.warning.dark,
    disabled: colors.neutral.main,
  },
  border: {
    light: colors.neutral.light,
    medium: colors.neutral.medium,
    dark: colors.neutral.dark,
    accent: colors.primary.light,
  },
  status: {
    read: colors.neutral.light,
    unread: colors.primary.lightest,
    favorite: colors.accent.lightest,
    readLater: colors.success.lightest,
  },
  button: {
    primary: colors.primary.main,
    primaryPressed: colors.primary.dark,
    secondary: colors.neutral.white,
    secondaryPressed: colors.neutral.lightest,
    danger: colors.error.main,
    dangerPressed: colors.error.dark,
  },
};

export default { colors, semanticColors };
