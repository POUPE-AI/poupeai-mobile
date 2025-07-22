import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";

export const createGoalsListStyles = (themeType: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.theme[themeType].background,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    listHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    goalsList: {
      flex: 1,
    },
    flatListContent: {
      paddingBottom: 80,
    },
    listTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.theme[themeType].text,
    },
    addButton: {
      backgroundColor: colors.primary[500],
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    newGoalCard: {
      backgroundColor: colors.theme[themeType].background,
      borderRadius: 16,
      padding: 16,
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.primary[200],
      borderStyle: "dashed",
    },
    newGoalText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary[500],
      marginTop: 12,
      marginBottom: 4,
    },
    newGoalSubtext: {
      fontSize: 14,
      color: colors.theme[themeType].textSecondary,
      textAlign: "center",
    },
  });
