import { StyleSheet } from "react-native";
import { ThemeType } from "@/contexts/ThemeContext";
import { colors } from "@/constants/theme";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.theme[theme].background,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    content: {
      width: "100%",
      maxWidth: 400,
      alignItems: "center",
    },
    iconContainer: {
      marginBottom: 16,
    },
    icon: {
      color: colors.feedback.warning,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.theme[theme].text,
      marginBottom: 16,
      textAlign: "center",
    },
    message: {
      fontSize: 16,
      color: colors.theme[theme].textSecondary,
      marginBottom: 12,
      textAlign: "center",
      lineHeight: 24,
    },
    submessage: {
      fontSize: 14,
      color: colors.theme[theme].textSecondary,
      marginBottom: 32,
      textAlign: "center",
      lineHeight: 20,
    },
    buttonsContainer: {
      width: "100%",
      gap: 12,
    },
    reactivateButton: {
      backgroundColor: colors.primary[500],
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 12,
      gap: 8,
    },
    reactivateButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#fff",
    },
    logoutButton: {
      backgroundColor: colors.theme[theme].surface,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.theme[theme].border,
      gap: 8,
    },
    logoutButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.theme[theme].text,
    },
  });
