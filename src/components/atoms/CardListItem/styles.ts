import { colors } from '@/constants/theme';
import { ThemeType } from '@/contexts/ThemeContext';
import { StyleSheet } from 'react-native';

export const styles = (theme: ThemeType) => StyleSheet.create({
  container: {
    backgroundColor: colors.theme[theme].surface,
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 1,
  },
  cardInfo: {
    flex: 1,
    padding: 16,
    gap: 12,
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandText: {
    fontSize: 14,
    color: colors.theme[theme].textSecondary,
  },
  usedText: {
    fontSize: 14,
    color: colors.primary[500],
    fontWeight: '500',
  },
  progressSection: {
    gap: 6,
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availableText: {
    fontSize: 12,
    color: colors.theme[theme].textSecondary,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary[500],
  },
  datesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateItem: {
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 12,
    color: colors.theme[theme].textSecondary,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.theme[theme].text,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
});
