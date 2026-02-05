import { StyleSheet } from "react-native";
import { ThemeType } from "@/contexts/ThemeContext";
import { colors } from "@/constants/theme";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.theme[theme].background,
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 32,
    },
    userName: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.theme[theme].text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: colors.theme[theme].textSecondary,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.theme[theme].text,
      marginBottom: 12,
    },
    infoCard: {
      backgroundColor: colors.theme[theme].surface,
      borderRadius: 12,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 3.84,
      elevation: 2,
    },
    infoItem: {
      paddingVertical: 12,
    },
    infoLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.theme[theme].textSecondary,
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    infoValue: {
      fontSize: 16,
      color: colors.theme[theme].text,
    },
    divider: {
      height: 1,
      backgroundColor: colors.theme[theme].border,
    },
    actionsSection: {
      gap: 12,
    },
    deactivateButton: {
      backgroundColor: colors.feedback.info,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 12,
      gap: 8,
    },
    deactivateButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#fff",
    },
    logoutButton: {
      backgroundColor: colors.feedback.error,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 12,
      gap: 8,
    },
    logoutButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#fff",
    },
  });
