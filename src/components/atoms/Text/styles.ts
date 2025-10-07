export const createTextStyles = (
  themeColors: any,
  variant: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'subtitle',
  color: 'primary' | 'secondary' | 'text' | 'textSecondary',
  align: 'left' | 'center' | 'right'
) => {
  const getTextColor = () => {
    switch (color) {
      case 'primary': return '#ff660f';
      case 'secondary': return themeColors.textSecondary;
      case 'text': return themeColors.text;
      case 'textSecondary': return themeColors.textSecondary;
      default: return themeColors.text;
    }
  };

  const getTextStyle = () => {
    const baseStyle = {
      color: getTextColor(),
      textAlign: align as any,
    };

    switch (variant) {
      case 'h1':
        return {
          ...baseStyle,
          fontSize: 32,
          fontWeight: 'bold' as any,
          lineHeight: 40,
        };
      case 'h2':
        return {
          ...baseStyle,
          fontSize: 24,
          fontWeight: 'bold' as any,
          lineHeight: 32,
        };
      case 'h3':
        return {
          ...baseStyle,
          fontSize: 20,
          fontWeight: '600' as any,
          lineHeight: 28,
        };
      case 'subtitle':
        return {
          ...baseStyle,
          fontSize: 16,
          fontWeight: '500' as any,
          lineHeight: 24,
        };
      case 'body':
        return {
          ...baseStyle,
          fontSize: 16,
          fontWeight: '400' as any,
          lineHeight: 24,
        };
      case 'caption':
        return {
          ...baseStyle,
          fontSize: 14,
          fontWeight: '400' as any,
          lineHeight: 20,
        };
      default:
        return baseStyle;
    }
  };

  return getTextStyle();
};
