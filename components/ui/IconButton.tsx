import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import theme from '../../theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  style,
  testID,
}) => {
  // Animation for press feedback
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 50, stiffness: 400 });
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 50, stiffness: 400 });
  };
  
  // Get container style based on variant and size
  const getContainerStyle = () => {
    const baseStyles: StyleProp<ViewStyle> = [styles.container, styles[`${size}Container`]];
    
    switch (variant) {
      case 'primary':
        baseStyles.push(styles.primaryContainer);
        break;
      case 'secondary':
        baseStyles.push(styles.secondaryContainer);
        break;
      case 'ghost':
        baseStyles.push(styles.ghostContainer);
        break;
    }
    
    if (disabled) {
      baseStyles.push(styles.disabledContainer);
    }
    
    return baseStyles;
  };
  
  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[getContainerStyle(), animatedStyle, style]}
      disabled={disabled}
      activeOpacity={0.7}
      testID={testID}
    >
      {icon}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.circle,
  },
  // Size variants
  smallContainer: {
    width: 32,
    height: 32,
  },
  mediumContainer: {
    width: 40,
    height: 40,
  },
  largeContainer: {
    width: 48,
    height: 48,
  },
  // Style variants
  primaryContainer: {
    backgroundColor: theme.colors.primary.main,
  },
  secondaryContainer: {
    backgroundColor: theme.colors.neutral.white,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  disabledContainer: {
    backgroundColor: theme.colors.neutral.light,
    opacity: 0.6,
  },
});

export default IconButton;