import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export const styles = (themeType: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.theme[themeType].background,
      paddingTop: 4,
      paddingHorizontal: 16,
    },
    card: {
      backgroundColor: colors.theme[themeType].surface,
      padding: 16,
      borderRadius: 12,

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      elevation: 1,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomColor: colors.theme[themeType].border,
      borderBottomWidth: 1,
      paddingBottom: 8,
    },
    cardContent: {
      marginTop: 16,
      gap: 8,
    },
    cardFooter: {
      marginTop: 16,
      flexDirection: "column",
      borderTopColor: colors.theme[themeType].border,
      borderTopWidth: 1,
      paddingTop: 8,
    },
    actionsContainer: {
      flexDirection: "row",
      gap: 12,
    },
    statusTag: {
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    receiptSection: {
      marginTop: 8,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.theme[themeType].border,
    },
  });