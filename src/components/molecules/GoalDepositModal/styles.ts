import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { ThemeType } from '@/contexts/ThemeContext';

export const styles = (theme: ThemeType) => {
  const themeColors = colors.theme[theme];
  
  return StyleSheet.create({
    goalInfo: {
      backgroundColor: themeColors.surface,
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    goalTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: themeColors.text,
      marginBottom: 8,
    },
    goalDetail: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    goalLabel: {
      fontSize: 14,
      color: themeColors.textSecondary,
    },
    goalValue: {
      fontSize: 14,
      fontWeight: '500',
      color: themeColors.text,
    },
    cancelButton: {
      flex: 1,
    },
    confirmButton: {
      flex: 1,
    },
    fieldContainer: {
      marginBottom: 16,
    },
    fieldLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: themeColors.text,
      marginBottom: 8,
    },
    fieldHint: {
      fontSize: 12,
      color: themeColors.textSecondary,
    },
    errorContainer: {
      backgroundColor: colors.feedback.error + '20', // 20% opacity
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.feedback.error,
    },
    errorText: {
      color: colors.feedback.error,
      fontSize: 14,
      textAlign: 'center',
    },
  });
};
