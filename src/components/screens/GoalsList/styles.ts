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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    loadingText: {
      fontSize: 16,
      color: colors.theme[themeType].textSecondary,
      marginTop: 16,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
      paddingHorizontal: 32,
    },
    errorText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.theme[themeType].text,
      marginTop: 16,
      textAlign: "center",
    },
    errorSubtext: {
      fontSize: 14,
      color: colors.theme[themeType].textSecondary,
      marginTop: 8,
      textAlign: "center",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
      paddingHorizontal: 32,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.theme[themeType].text,
      marginTop: 24,
      textAlign: "center",
    },
    emptySubtext: {
      fontSize: 16,
      color: colors.theme[themeType].textSecondary,
      marginTop: 8,
      marginBottom: 32,
      textAlign: "center",
      lineHeight: 24,
    },
  });
