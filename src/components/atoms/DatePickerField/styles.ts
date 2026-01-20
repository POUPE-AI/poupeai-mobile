import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

export const styles = (theme: "light" | "dark") =>
  StyleSheet.create({
    fieldContainer: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.theme[theme].text,
      marginBottom: 8,
    },
    dateInput: {
      borderWidth: 1,
      borderColor: colors.theme[theme].border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.theme[theme].surface,
      minHeight: 48,
      justifyContent: "center",
    },
    dateInputError: {
      borderColor: colors.feedback.error,
    },
    dateInputDisabled: {
      opacity: 0.6,
    },
    dateText: {
      fontSize: 16,
      color: colors.theme[theme].text,
    },
    dateTextDisabled: {
      color: colors.theme[theme].textSecondary,
    },
    placeholderText: {
      color: colors.theme[theme].textSecondary,
    },
    errorText: {
      color: colors.feedback.error,
      fontSize: 14,
      marginTop: 4,
    },
  });
