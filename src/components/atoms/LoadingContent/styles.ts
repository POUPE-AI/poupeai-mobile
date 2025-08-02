import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export const styles = (themeType: ThemeType) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
      backgroundColor: colors.theme[themeType].background,
    },
    loadingText: {
      fontSize: 16,
      color: colors.theme[themeType].textSecondary,
      marginTop: 16,
    },
  });
