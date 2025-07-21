import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/theme';

export const createButtonStyles = (
  themeColors: any,
  variant: 'primary' | 'secondary' | 'outline',
  size: 'small' | 'medium' | 'large',
  disabled: boolean,
  loading: boolean
) => {
  const getBackgroundColor = () => {
    if (variant === 'primary') return colors.primary[500];
    if (variant === 'secondary') return themeColors.surface;
    if (variant === 'outline') return 'transparent';
    return colors.primary[500];
  };

  const getTextColor = () => {
    if (variant === 'primary') return '#fff';
    if (variant === 'secondary') return themeColors.text;
    if (variant === 'outline') return colors.primary[500];
    return '#fff';
  };

  return StyleSheet.create({
    button: {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      minHeight: size === 'small' ? 36 : size === 'large' ? 56 : 48,
      paddingHorizontal: size === 'small' ? 12 : size === 'large' ? 24 : 16,
      paddingVertical: size === 'small' ? 8 : size === 'large' ? 16 : 12,
      backgroundColor: getBackgroundColor(),
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: variant === 'outline' ? colors.primary[500] : 'transparent',
      opacity: (disabled || loading) ? 0.7 : 1,
    },
    text: {
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
      fontWeight: '600',
      color: getTextColor(),
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  });
};
