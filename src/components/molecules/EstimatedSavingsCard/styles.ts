import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.theme[theme].surface,
      borderRadius: 12,
      padding: 16,

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      elevation: 1,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    leftContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    title: {
      fontSize: 16,
      color: colors.theme[theme].text,
      fontWeight: "600",
    },
    value: {
      fontSize: 16,
      fontWeight: "700",
    },
    detailsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    percentage: {
      fontSize: 14,
      fontWeight: "600",
    },
    comparisonText: {
      fontSize: 12,
      color: colors.theme[theme].text,
      opacity: 0.7,
    },
    message: {
      fontSize: 12,
      color: colors.theme[theme].text,
      opacity: 0.8,
      lineHeight: 16,
    },
  });
