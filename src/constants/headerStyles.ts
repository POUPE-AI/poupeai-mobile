import { colors as themeColors } from './theme';
import { ThemeType } from '@/contexts/ThemeContext';

export const getHeaderStyles = (theme: ThemeType) => {
  const colors = themeColors.theme[theme];
  
  return {
    headerStyle: {
      backgroundColor: colors.background,
      elevation: 0, // Remove shadow on Android
      shadowOpacity: 0, // Remove shadow on iOS
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTintColor: colors.text,
    headerTitleStyle: {
      fontSize: 18,
      fontWeight: 'bold' as const,
    },
    headerBackTitleStyle: {
      fontSize: 16,
    },
    headerShadowVisible: false, // For newer versions of React Navigation
  };
};
