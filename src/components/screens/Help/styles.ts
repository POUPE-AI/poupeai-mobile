import { StyleSheet } from 'react-native';
import { colors as themeColors } from '../../../constants/theme';

export const createHelpScreenStyles = (colors: typeof themeColors.theme.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: 64,
  },
  header: {
    padding: 16,
    paddingBottom: 24,
  },
  subtitle: {
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 12,
    fontWeight: '600',
  },
  faqContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.border,
    gap: 1
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    gap: 16,
  },
  contactInfo: {
    flex: 1,
  },
});
