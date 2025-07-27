import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.theme[theme].surface,
      borderRadius: 12,
      padding: 16,
      height: 160,
      overflow: "hidden",

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      elevation: 1,
    },
    content: {
      zIndex: 2,
      position: "relative",
    },
    titleContainer: {
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: 8,
      gap: 8,
    },
    title: {
      fontSize: 18,
      color: colors.theme[theme].text,
      fontWeight: "600",
    },
    tip: {
      fontSize: 14,
      color: colors.theme[theme].textSecondary,
      fontStyle: "italic",
      lineHeight: 16,
    },
    backgroundChart: {
      position: "absolute",
      bottom: 0,
      left: 8,
      right: 8,
      zIndex: 1,
      opacity: 0.2,
    },
  });
