import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

export const styles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme[theme].background,
  },
});
