import { colors } from '@/constants/theme';
import { ThemeType } from '@/contexts/ThemeContext';
import { StyleSheet } from 'react-native';

export const styles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.theme[theme].border,
    backgroundColor: colors.theme[theme].surface,
    gap: 6,
  },
  activeContainer: {
    backgroundColor: colors.theme[theme].background,
    borderWidth: 1.5,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  inactiveText: {
    color: colors.theme[theme].textSecondary,
  },
});
