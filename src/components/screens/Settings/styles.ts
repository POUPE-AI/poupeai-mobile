import { StyleSheet } from 'react-native';
import { colors as themeColors } from '../../../constants/theme';

export const createSettingsScreenStyles = (colors: typeof themeColors.theme.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginTop: 16,
    gap: 8,
  },
  sectionTitle: {
    marginHorizontal: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
