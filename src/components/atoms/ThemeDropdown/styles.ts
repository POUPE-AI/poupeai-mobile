import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/theme';

export const createThemeDropdownStyles = (themeColors: any) => StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: themeColors.surface,
    padding: 8,
    borderBottomWidth: 1,
    borderColor: themeColors.border,
  },
  selectedValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedText: {
    fontSize: 14,
    color: themeColors.text,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: themeColors.surface,
    borderRadius: 12,
    margin: 20,
    width: '80%',
    maxHeight: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themeColors.text,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  selectedOption: {
    backgroundColor: colors.primary[500],
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: themeColors.text,
  },
  selectedOptionText: {
    color: '#fff',
  },
});
