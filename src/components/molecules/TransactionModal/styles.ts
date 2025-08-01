import { StyleSheet } from 'react-native';
import { ThemeType } from '@/contexts/ThemeContext';
import { colors } from '@/constants/theme';

export const styles = (theme: ThemeType) => {
  const themeColors = colors.theme[theme];
  
  return StyleSheet.create({
    button: {
      flex: 1,
    }
  });
};