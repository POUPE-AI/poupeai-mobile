import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { colors } from '@/constants/theme';

export const ThemeToggleButton = () => {
  const { toggleTheme, isDark, colors: themeColors } = useTheme();

  const dynamicStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: themeColors.surface,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    text: {
      color: themeColors.text,
      marginLeft: 8,
      fontSize: 16,
    },
  });

  return (
    <TouchableOpacity
      style={dynamicStyles.container}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={20}
        color={colors.primary[500]}
      />
      <Text style={dynamicStyles.text}>
        {isDark ? 'Modo Claro' : 'Modo Escuro'}
      </Text>
    </TouchableOpacity>
  );
};
