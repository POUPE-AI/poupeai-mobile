import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { ThemeType } from '@/contexts/ThemeContext';

export const styles = (theme: ThemeType) => {
  const themeColors = colors.theme[theme];
  
  return StyleSheet.create({
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    selectContainer: {
      marginBottom: 16,
    },
    selectLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: themeColors.text,
      marginBottom: 8,
    },
    selectButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: 8,
      backgroundColor: themeColors.surface,
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 50,
    },
    selectButtonText: {
      fontSize: 16,
      color: themeColors.text,
    },
    dayRow: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 16,
    },
    dayContainer: {
      flex: 1,
    },
    brandContainer: {
      marginBottom: 16,
    },
    brandLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: themeColors.text,
      marginBottom: 8,
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
