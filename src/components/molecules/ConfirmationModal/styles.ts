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
      backgroundColor:
        theme === "light" ? "#ffffff" : colors.theme[theme].surface,
      borderRadius: 16,
      padding: 24,
      width: "100%",
      maxWidth: 400,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    iconContainer: {
      marginBottom: 16,
    },
    icon: {
      color: colors.feedback.warning,
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
    buttonsContainer: {
      flexDirection: "row",
      gap: 12,
      width: "100%",
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    cancelButton: {
      backgroundColor: colors.theme[theme].background,
      borderWidth: 1,
      borderColor: colors.theme[theme].border,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.theme[theme].text,
    },
    confirmButton: {
      backgroundColor: colors.primary[500],
    },
    confirmButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#fff",
    },
    dangerButton: {
      backgroundColor: colors.feedback.error,
    },
    dangerButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#fff",
    },
  });
