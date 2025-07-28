import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { ThemeType } from '@/contexts/ThemeContext';

export const styles = (theme: ThemeType) => {
  const themeColors = colors.theme[theme];
  
  return StyleSheet.create({
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
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
