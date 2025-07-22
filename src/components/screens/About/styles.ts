import { StyleSheet } from 'react-native';
import { colors as themeColors } from '../../../constants/theme';

export const createAboutScreenStyles = (colors: typeof themeColors.theme.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 80,
    paddingHorizontal: 16,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
  },
  description: {
    lineHeight: 22,
  },
  developer: {
    fontSize: 16,
  },
  techList: {
    gap: 4,
  },
  techItem: {
    lineHeight: 20,
  },
  license: {
    lineHeight: 22,
    fontSize: 14,
  },
});
