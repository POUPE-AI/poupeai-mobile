import { StyleSheet } from 'react-native';
import { ThemeType } from '@/contexts/ThemeContext';
import { colors } from '@/constants/theme';

export const styles = (theme: ThemeType) => {
  const themeColors = colors.theme[theme];
  
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    container: {
      backgroundColor: themeColors.background,
      borderRadius: 16,
      width: '100%',
      maxWidth: 340,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
      gap: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: themeColors.text,
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    message: {
      fontSize: 16,
      color: themeColors.textSecondary,
      lineHeight: 22,
      marginBottom: 8,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '600',
      color: themeColors.text,
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
    deleteButton: {
      flex: 1,
      backgroundColor: colors.feedback.error,
    },
  });
};
