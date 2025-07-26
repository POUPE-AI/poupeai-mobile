import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";
import { Dimensions, StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.theme[theme].surface,
      borderRadius: 12,
      padding: 16,
      height: 200,
      width: Dimensions.get("window").width - 32,
      position: "relative",
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 16,
      color: colors.theme[theme].textSecondary,
      marginBottom: 4,
    },
    percentage: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 8,
    },
    amount: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.theme[theme].text,
      marginBottom: 16,
    },
    backgroundChart: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      opacity: 0.3,
    },
  });
