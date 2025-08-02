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
    trendContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: themeColors.surface,
      padding: 16,
      borderRadius: 12,
      marginVertical: 4,
    },
    trendText: {
      fontSize: 16,
      color: themeColors.text,
      marginLeft: 8,
      flex: 1,
    },
    peakDayItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: themeColors.surface,
      padding: 12,
      borderRadius: 8,
      marginVertical: 2,
    },
    peakDayText: {
      fontSize: 14,
      color: themeColors.text,
      marginLeft: 8,
    },
    transactionItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: themeColors.surface,
      padding: 16,
      borderRadius: 12,
      marginVertical: 4,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionDescription: {
      fontSize: 16,
      fontWeight: "600",
      color: themeColors.text,
      marginBottom: 2,
    },
    transactionDate: {
      fontSize: 12,
      color: themeColors.textSecondary,
    },
    transactionAmount: {
      fontSize: 16,
      fontWeight: "bold",
    },
    buttonContainer: {
      marginVertical: 24,
      paddingBottom: 20,
    },
  });
