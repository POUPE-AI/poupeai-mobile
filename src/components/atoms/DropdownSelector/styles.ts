import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

export const styles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.theme[theme].border,
    borderRadius: 12,
    backgroundColor: colors.theme[theme].surface,
  },
  containerError: {
    borderColor: colors.feedback.error,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 16,
    color: colors.theme[theme].text,
    flex: 1,
    marginLeft: 8,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  dropdown: {
    maxHeight: 200,
    borderTopWidth: 1,
    borderTopColor: colors.theme[theme].border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.theme[theme].border,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
});
