import { StyleSheet } from "react-native";
import { ThemeType } from "@/contexts/ThemeContext";
import { colors } from "@/constants/theme";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    container: {
      backgroundColor: colors.theme[theme].surface,
      borderRadius: 16,
      padding: 24,
      width: "100%",
      maxWidth: 400,
      alignItems: "center",
    },
    iconContainer: {
      marginBottom: 16,
    },
    successIcon: {
      color: colors.feedback.success,
    },
    errorIcon: {
      color: colors.feedback.error,
    },
    infoIcon: {
      color: colors.primary[500],
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.theme[theme].text,
      marginBottom: 8,
      textAlign: "center",
    },
    message: {
      fontSize: 14,
      color: colors.theme[theme].textSecondary,
      marginBottom: 24,
      textAlign: "center",
      lineHeight: 20,
    },
    button: {
      width: "100%",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary[500],
    },
    successButton: {
      backgroundColor: colors.feedback.success,
    },
    errorButton: {
      backgroundColor: colors.feedback.error,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#fff",
    },
  });
