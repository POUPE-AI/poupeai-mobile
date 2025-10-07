import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../atoms/Text';
import { useTheme } from '../../../contexts/ThemeContext';
import { createSettingsItemStyles } from './styles';
import { colors } from '@/constants/theme';

interface SettingsItemProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  showChevron?: boolean;
}

export const SettingsItem = ({ 
  title, 
  subtitle, 
  icon, 
  onPress, 
  disabled = false,
  children,
  showChevron = true
}: SettingsItemProps) => {
  const { colors: themeColors } = useTheme();
  const styles = createSettingsItemStyles(themeColors);

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component 
      style={[styles.container, disabled && styles.disabled]}
      onPress={!disabled ? onPress : undefined}
      disabled={disabled}
    >
      <View style={styles.iconContainer}>
        <Ionicons 
          name={icon as any} 
          size={20} 
          color={disabled ? themeColors.textSecondary : colors.primary[500]} 
        />
      </View>
      
      <View style={styles.content}>
        <Text variant="subtitle" color={disabled ? 'textSecondary' : 'text'}>
          {title}
        </Text>
        <Text variant="caption" color="textSecondary">
          {subtitle}
        </Text>
        {children}
      </View>
      
      {showChevron && !children && (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={themeColors.textSecondary} 
        />
      )}
    </Component>
  );
};
