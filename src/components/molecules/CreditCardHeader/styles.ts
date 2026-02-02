import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { ThemeType } from '@/contexts/ThemeContext';

export const styles = (theme: ThemeType) => {
  const themeColors = colors.theme[theme];
  
  return StyleSheet.create({
    container: {
      backgroundColor: colors.primary[600],
      margin: 16,
      borderRadius: 16,
      padding: 20,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    cardName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
      flex: 1,
      marginRight: 12,
    },
    brandBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    brandText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    limitContainer: {
      marginBottom: 8,
    },
    limitLabel: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: 4,
    },
    limitValue: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    detailsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    detailItem: {
      alignItems: 'center',
    },
    detailLabel: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });
};
