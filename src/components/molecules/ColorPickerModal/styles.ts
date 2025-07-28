import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

export const styles = (theme: 'light' | 'dark') => StyleSheet.create({
  previewContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  colorPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.theme[theme].border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerContainer: {
    marginBottom: 32,
  },
  colorPicker: {
    width: '100%',
  },
  panel: {
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.theme[theme].border,
  },
  hueSlider: {
    height: 40,
    borderRadius: 20,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
});
