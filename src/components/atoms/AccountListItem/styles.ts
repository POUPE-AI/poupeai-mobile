import { colors } from '@/constants/theme';
import { ThemeType } from '@/contexts/ThemeContext';
import { StyleSheet } from 'react-native';

export const styles = (theme: ThemeType) => StyleSheet.create({
  container: {
    backgroundColor: colors.theme[theme].surface,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.theme[theme].border,
    marginVertical: 4,
    padding: 0, // Remove todo padding para o header ocupar 100%
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 1,
    flexDirection: 'column', // Mudança para coluna para header no topo
    overflow: 'hidden', // Para manter o border radius
  },
  defaultContainer: {
    borderLeftColor: colors.primary[500],
  },
  defaultHeader: {
    backgroundColor: colors.primary[500],
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingStart: 8
  },
  defaultHeaderText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1.5,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.theme[theme].text,
    flex: 1,
    marginRight: 12,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.feedback.success,
  },
  negativeBalance: {
    color: colors.feedback.error,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  descriptionText: {
    fontSize: 14,
    color: colors.theme[theme].textSecondary,
    lineHeight: 18,
    flex: 1,
    marginRight: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
