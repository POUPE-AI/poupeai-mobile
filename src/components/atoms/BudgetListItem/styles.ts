import { colors } from '@/constants/theme';
import { ThemeType } from '@/contexts/ThemeContext';
import { StyleSheet } from 'react-native';

export const styles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.theme[theme].surface,
    borderRadius: 12,
    borderLeftWidth: 6,
    marginVertical: 6,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 1,
  },
  budgetInfo: {
    flex: 1,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.theme[theme].text,
    flex: 1,
    marginRight: 12,
  },
  limitText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.theme[theme].text,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryText: {
    fontSize: 14,
    color: colors.theme[theme].textSecondary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressSection: {
    gap: 6,
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: colors.theme[theme].textSecondary,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.theme[theme].border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  remainingContainer: {
    flex: 1,
  },
  remainingText: {
    fontSize: 12,
    color: colors.theme[theme].textSecondary,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
    marginTop: 4,
  },
});
