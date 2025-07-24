import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { colors } from '@/constants/theme';
import { styles } from './styles';

interface ActionButtonProps {
  iconName: string;
  iconColor?: string;
  onPress: () => void;
  size?: number;
  disabled?: boolean;
}

export const ActionButton = ({ 
  iconName, 
  iconColor, 
  onPress, 
  size = 16,
  disabled = false
}: ActionButtonProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const getIconColor = () => {
    if (disabled) return colors.theme[theme].textSecondary;
    if (iconColor) return iconColor;
    if (iconName.includes('trash')) return colors.feedback.error;
    return colors.theme[theme].textSecondary;
  };

  return (
    <TouchableOpacity
      style={[
        style.button,
        disabled && style.disabled
      ]}
      onPress={(e) => {
        e?.stopPropagation?.();
        onPress();
      }}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={iconName as any} 
        size={size} 
        color={getIconColor()} 
      />
    </TouchableOpacity>
  );
};
