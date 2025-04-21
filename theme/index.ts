/**
 * Main theme definition file that exports all theme elements
 */

import { colors, semanticColors } from './colors';
import { spacing } from './spacing';
import { fontFamily, fontWeight, fontSize, lineHeight, textStyles } from './typography';

export const theme = {
  colors,
  semanticColors,
  spacing,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  textStyles,
  
  // Global style constants
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    circle: 999,
  },
  
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  
  // Animation timing
  animation: {
    fast: 200,
    medium: 300,
    slow: 500,
  },
};

export default theme;