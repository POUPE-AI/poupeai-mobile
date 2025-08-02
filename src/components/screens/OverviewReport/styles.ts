import { StyleSheet } from "react-native";

export const styles = (themeColors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    section: {
      marginVertical: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: themeColors.text,
      marginBottom: 8,
    },
    period: {
      fontSize: 14,
      color: themeColors.textSecondary,
      marginBottom: 16,
    },
    row: {
      flexDirection: "row",
      gap: 12,
    },
    halfCard: {
      flex: 1,
    },
    buttonContainer: {
      marginVertical: 24,
      paddingBottom: 20,
    },
  });
