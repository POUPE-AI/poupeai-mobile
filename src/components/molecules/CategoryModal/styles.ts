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
      gap: 12,
      marginBottom: 8,
    },
    colorSwatch: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: 'transparent',
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
    footer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 20,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: themeColors.border,
    },
    cancelButton: {
      flex: 1,
    },
    saveButton: {
      flex: 1,
    },
  });
};
