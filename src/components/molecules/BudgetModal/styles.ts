import { StyleSheet } from 'react-native';
import { ThemeType } from '@/contexts/ThemeContext';
import { colors } from '@/constants/theme';

export const styles = (theme: ThemeType) => {
  const themeColors = colors.theme[theme];
  
  return StyleSheet.create({
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 24,
    },
    footer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 16,
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
