import { StyleSheet } from 'react-native';
import { ThemeType } from '@/contexts/ThemeContext';
import { colors } from '@/constants/theme';

export const styles = (theme: ThemeType) => {
  const themeColors = colors.theme[theme];
  
  return StyleSheet.create({
    colorContainer: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: themeColors.text,
      marginBottom: 8,
    },
    predefinedColorsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    justifyContent: 'space-between',
      gap: 12,
      marginBottom: 8,
    },
    colorSwatch: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    colorSwatchSelected: {
      borderColor: themeColors.text,
    },
    customColorButton: {
      backgroundColor: themeColors.surface,
      borderColor: themeColors.border,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: 14,
      color: colors.feedback.error,
      marginTop: 4,
    },
  });
};
