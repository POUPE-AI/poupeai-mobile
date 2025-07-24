import { colors } from '@/constants/theme';
import { ThemeType } from '@/contexts/ThemeContext';
import { StyleSheet } from 'react-native';

export const styles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme[theme].background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.theme[theme].text,
  },
  addButton: {
    backgroundColor: colors.primary[500],
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.theme[theme].text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.theme[theme].textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },
});
