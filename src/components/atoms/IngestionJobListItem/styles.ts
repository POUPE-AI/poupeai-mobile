import { StyleSheet } from "react-native";
import { ThemeType } from "@/contexts/ThemeContext";
import { colors } from "@/constants/theme";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.theme[theme].surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 3.84,
      elevation: 2,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.theme[theme].background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.theme[theme].text,
      flex: 1,
      marginRight: 8,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
    },
    date: {
      fontSize: 13,
      color: colors.theme[theme].textSecondary,
      marginTop: 2,
    },
    chevron: {
      color: colors.theme[theme].textSecondary,
    },
  });
