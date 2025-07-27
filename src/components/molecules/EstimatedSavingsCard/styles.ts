import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.theme[theme].surface,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      elevation: 1,
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
  });
