import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export const styles = (themeType: ThemeType) =>
  StyleSheet.create({
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
  });
