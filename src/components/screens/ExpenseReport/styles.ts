import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

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
    expenseItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: themeColors.surface,
      padding: 16,
      borderRadius: 12,
      marginVertical: 4,
    },
    expenseInfo: {
      flex: 1,
    },
    expenseDescription: {
      fontSize: 16,
      fontWeight: "600",
      color: themeColors.text,
      marginBottom: 2,
    },
    expenseCategory: {
      fontSize: 14,
      color: themeColors.textSecondary,
      marginBottom: 2,
    },
    expenseDate: {
      fontSize: 12,
      color: themeColors.textSecondary,
    },
    expenseAmount: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.feedback.error,
    },
    buttonContainer: {
      marginVertical: 24,
      paddingBottom: 20,
    },
  });
