import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { ThemeType } from '@/contexts/ThemeContext';

export const styles = (theme: ThemeType) => {
  const themeColors = colors.theme[theme];
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: themeColors.text,
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    errorText: {
      fontSize: 16,
      color: themeColors.textSecondary,
      textAlign: 'center',
    },
    listContainer: {
      paddingBottom: 72,
    },
  });
};
