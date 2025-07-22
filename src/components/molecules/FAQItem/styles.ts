import { StyleSheet } from 'react-native';
import { colors as themeColors } from '../../../constants/theme';

export const createFAQItemStyles = (colors: typeof themeColors.theme.light) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 56,
  },
  question: {
    flex: 1,
    marginRight: 12,
    fontWeight: '500',
  },
  answer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  answerText: {
    lineHeight: 22,
  },
});
