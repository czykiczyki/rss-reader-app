import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  interpolateColor 
} from 'react-native-reanimated';
import theme from '../../theme';

interface TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  disabled?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  disabled = false,
  autoCapitalize = 'none',
  autoCorrect = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  onBlur,
  onFocus,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Animation values
  const focusAnim = useSharedValue(0);
  
  // Animated styles
  const borderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusAnim.value,
      [0, 1],
      [
        error ? theme.colors.error.main : theme.colors.neutral.light,
        error ? theme.colors.error.main : theme.colors.primary.main,
      ]
    );
    
    return {
      borderColor,
    };
  });
  
  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    focusAnim.value = withTiming(1, { duration: 200 });
    onFocus && onFocus(e);
  };
  
  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    focusAnim.value = withTiming(0, { duration: 200 });
    onBlur && onBlur(e);
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <AnimatedView style={[
        styles.inputContainer,
        error && styles.errorInput,
        disabled && styles.disabledInput,
        multiline && { height: numberOfLines * 24 + 16 },
        borderStyle,
      ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <RNTextInput
          style={[
            styles.input,
            leftIcon ? styles.noPaddingLeft : {},
            rightIcon ? styles.noPaddingRight : {},
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.neutral.main}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </AnimatedView>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium as any,
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral.white,
    paddingHorizontal: theme.spacing.sm,
    height: 48,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: theme.fontSize.md,
    color: theme.colors.neutral.darkest,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: theme.spacing.sm,
  },
  leftIcon: {
    marginRight: theme.spacing.xs,
  },
  rightIcon: {
    marginLeft: theme.spacing.xs,
  },
  errorInput: {
    borderColor: theme.colors.error.main,
  },
  disabledInput: {
    backgroundColor: theme.colors.neutral.lighter,
    opacity: 0.7,
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.error.main,
    marginTop: theme.spacing.xxs,
  },
  noPaddingLeft: {
    paddingLeft: 0,
  },
  noPaddingRight: {
    paddingRight: 0,
  },
});

export default TextInput;