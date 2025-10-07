import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

export const styles = (theme: 'light' | 'dark') => StyleSheet.create({
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.theme[theme].text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.theme[theme].border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.theme[theme].text,
    backgroundColor: colors.theme[theme].surface,
  },
  inputError: {
    borderColor: colors.feedback.error,
  },
  errorText: {
    color: colors.feedback.error,
    fontSize: 14,
    marginTop: 4,
  },
});
