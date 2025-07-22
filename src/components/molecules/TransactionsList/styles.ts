import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { ThemeType } from '@/contexts/ThemeContext';

export const styles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  listContent: {
    paddingBottom: 60,
    gap: 8,
  },
  emptyContainer: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
