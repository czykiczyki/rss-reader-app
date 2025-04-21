/**
 * Typography styles for the application
 */

import { Platform } from 'react-native';

// Font families
export const fontFamily = {
  regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
  medium: Platform.OS === 'ios' ? 'System' : 'Roboto',
  bold: Platform.OS === 'ios' ? 'System' : 'Roboto',
};

// Font weights
export const fontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

// Font sizes
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

// Line heights
export const lineHeight = {
  xs: 18,
  sm: 21,
  md: 24,
  lg: 27,
  xl: 24,
  xxl: 29,
  xxxl: 36,
};

// Text styles
export const textStyles = {
  // Headlines
  h1: {
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold as any,
    fontSize: fontSize.xxxl,
    lineHeight: lineHeight.xxxl,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold as any,
    fontSize: fontSize.xxl,
    lineHeight: lineHeight.xxl,
  },
  h3: {
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.semiBold as any,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
  },
  h4: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.semiBold as any,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
  },
  
  // Body text
  body1: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular as any,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
  },
  body2: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular as any,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
  },
  
  // Captions and smaller text
  caption: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular as any,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
  },
  
  // Button text
  button: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium as any,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
  },
  
  // Link text
  link: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.medium as any,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    textDecorationLine: 'underline',
  },
};

export default { fontFamily, fontWeight, fontSize, lineHeight, textStyles };