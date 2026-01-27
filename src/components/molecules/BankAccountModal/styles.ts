import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { ThemeType } from '@/contexts/ThemeContext';

export const styles = (theme: ThemeType) => {
  const themeColors = colors.theme[theme];

  return StyleSheet.create({
    switchContainer: {
      marginTop: 8,
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
    cancelButton: {
      flex: 1,
    },
    saveButton: {
      flex: 1,
    },
  });
};
