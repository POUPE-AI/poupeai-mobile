import { StyleSheet } from "react-native";
import { ThemeType } from "@/contexts/ThemeContext";
import { colors } from "@/constants/theme";

export const styles = (theme: ThemeType) => {
  const themeColors = colors.theme[theme];

  return StyleSheet.create({
    footer: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: themeColors.border,
    },
    cancelButton: {
      flex: 1,
    },
    saveButton: {
      flex: 1,
    },
    categoryContainer: {
      marginBottom: 16,
    },
    categoryLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: themeColors.text,
      marginBottom: 8,
    },
    monthYearRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },
    monthContainer: {
      flex: 2,
    },
    monthLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: themeColors.text,
      marginBottom: 8,
    },
    yearContainer: {
      flex: 1,
    },
  });
};
