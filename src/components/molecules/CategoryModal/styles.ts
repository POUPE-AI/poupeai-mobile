import { StyleSheet } from 'react-native';
import { ThemeType } from '@/contexts/ThemeContext';
import { colors } from '@/constants/theme';

export const styles = (theme: ThemeType) => {
  const themeColors = colors.theme[theme];
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
    },
    closeButton: {
      padding: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: themeColors.text,
    },
    placeholder: {
      width: 40,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 24,
    },
    fieldContainer: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: themeColors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: themeColors.surface,
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
      fontSize: 16,
      color: themeColors.text,
    },
    inputError: {
      borderColor: colors.feedback.error,
    },
    errorText: {
      fontSize: 14,
      color: colors.feedback.error,
      marginTop: 4,
    },
    typeContainer: {
      marginBottom: 24,
    },
    typeButtonsContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    typeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: themeColors.border,
      backgroundColor: themeColors.surface,
      gap: 8,
    },
    typeButtonActive: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    typeButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: themeColors.text,
    },
    typeButtonTextActive: {
      color: '#fff',
    },
    colorContainer: {
      marginBottom: 16,
    },
    predefinedColorsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 16,
    },
    colorSwatch: {
      width: 32,
      height: 32,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    colorSwatchSelected: {
      borderColor: themeColors.text,
      borderWidth: 3,
    },
    customColorButton: {
      backgroundColor: themeColors.surface,
      borderWidth: 1,
      borderColor: themeColors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    colorPreviewContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    footer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: themeColors.border,
    },
    cancelButton: {
      flex: 1,
    },
    saveButton: {
      flex: 1,
    },

    // Color Picker Modal Styles
    colorPickerContainer: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    colorPickerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
    },
    colorPickerCancel: {
      fontSize: 16,
      color: themeColors.textSecondary,
    },
    colorPickerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: themeColors.text,
    },
    colorPickerDone: {
      fontSize: 16,
      color: colors.primary[500],
      fontWeight: '600',
    },
    colorPickerContent: {
      flex: 1,
      padding: 20,
    },
    colorPicker: {
      width: '100%',
      height: '100%',
    },
    colorPickerPreview: {
      height: 60,
      borderRadius: 12,
      marginBottom: 20,
    },
    colorPickerPanel: {
      height: 200,
      borderRadius: 12,
      marginBottom: 20,
    },
    colorPickerSlider: {
      height: 40,
      borderRadius: 20,
      marginBottom: 20,
    },
    colorPickerSwatches: {
      marginTop: 20,
    },
    colorPickerSwatch: {
      borderRadius: 8,
      margin: 4,
    },
  });
};
