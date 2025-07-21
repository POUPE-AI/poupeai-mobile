import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { createTextStyles } from './styles';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'subtitle';
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary';
  align?: 'left' | 'center' | 'right';
}

export const Text = ({ 
  variant = 'body',
  color = 'text',
  align = 'left',
  style,
  children,
  ...props 
}: TextProps) => {
  const { colors: themeColors } = useTheme();
  const textStyle = createTextStyles(themeColors, variant, color, align);

  return (
    <RNText style={[textStyle, style]} {...props}>
      {children}
    </RNText>
  );
};
