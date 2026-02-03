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
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.theme[theme].text,
      marginBottom: 8,
    },
    sectionDescription: {
      fontSize: 14,
      color: colors.theme[theme].textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    form: {
      gap: 8,
    },
    field: {
      gap: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.theme[theme].text,
    },
    errorText: {
      fontSize: 12,
      color: colors.feedback.error,
      marginTop: 4,
    },
    jobsList: {
      gap: 12,
    },
    emptyState: {
      padding: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      fontSize: 14,
      color: colors.theme[theme].textSecondary,
      textAlign: "center",
    },
  });
