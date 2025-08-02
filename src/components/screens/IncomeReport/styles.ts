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
    incomeItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: themeColors.surface,
      padding: 16,
      borderRadius: 12,
      marginVertical: 4,
    },
    incomeInfo: {
      flex: 1,
    },
    incomeDescription: {
      fontSize: 16,
      fontWeight: "600",
      color: themeColors.text,
      marginBottom: 2,
    },
    incomeCategory: {
      fontSize: 14,
      color: themeColors.textSecondary,
      marginBottom: 2,
    },
    incomeDate: {
      fontSize: 12,
      color: themeColors.textSecondary,
    },
    incomeAmount: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#28a745",
    },
    buttonContainer: {
      marginVertical: 24,
      paddingBottom: 20,
    },
  });
