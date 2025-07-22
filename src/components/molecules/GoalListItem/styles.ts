import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export const createGoalListItemStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.theme[theme].surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,

      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      elevation: 1,
    },
    goalHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    goalInfo: {
      flex: 1,
    },
    progressSection: {
      gap: 8,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    progressText: {
      fontSize: 14,
      fontWeight: "500",
    },
    progressPercentage: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.primary[500],
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.theme[theme].border,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary[500],
      borderRadius: 4,
    },
    goalFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    remainingAmount: {
      fontSize: 12,
      opacity: 0.7,
    },
    daysRemaining: {
      fontSize: 12,
      color: colors.primary[500],
      fontWeight: "500",
    },
  });
