import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { ThemeType } from '@/contexts/ThemeContext';

export const styles = (theme: ThemeType) => {
  const themeColors = colors.theme[theme];
  
  return StyleSheet.create({
    container: {
      backgroundColor: themeColors.surface,
      marginHorizontal: 16,
      marginBottom: 12,
      borderRadius: 12,
      padding: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    monthContainer: {
      flex: 1,
    },
    monthText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: themeColors.text,
    },
    yearText: {
      fontSize: 14,
      color: themeColors.textSecondary,
      marginTop: 2,
    },
    amountContainer: {
      alignItems: 'flex-end',
    },
    amountText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: themeColors.text,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    paidDot: {
      backgroundColor: colors.feedback.success,
    },
    unpaidDot: {
      backgroundColor: colors.feedback.warning,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    paidText: {
      color: colors.feedback.success,
    },
    unpaidText: {
      color: colors.feedback.warning,
    },
    detailsContainer: {
      gap: 8,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    detailLabel: {
      fontSize: 14,
      color: themeColors.textSecondary,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '500',
      color: themeColors.text,
    },
    actionContainer: {
      marginTop: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: themeColors.border,
    },
    payButton: {
      alignSelf: 'flex-end',
    },
  });
};
