import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { createButtonStyles } from './styles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export const Button = ({ 
  title, 
  loading = false, 
  loadingText,
  variant = 'primary',
  size = 'medium',
  disabled,
  style,
  ...props 
}: ButtonProps) => {
  const { colors: themeColors } = useTheme();
  const styles = createButtonStyles(themeColors, variant, size, !!disabled, loading);

  const getTextColor = () => {
    if (variant === 'primary') return '#fff';
    if (variant === 'secondary') return themeColors.text;
    if (variant === 'outline') return '#ff660f';
    return '#fff';
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="small" 
            color={getTextColor()} 
          />
          <Text style={styles.text}>
            {loadingText || title}
          </Text>
        </View>
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
