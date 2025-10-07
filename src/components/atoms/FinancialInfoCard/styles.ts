import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

export const styles = (
  themeColors: any,
  variant: "default" | "positive" | "negative"
) => {
  const getValueColor = () => {
    switch (variant) {
      case "positive":
        return colors.feedback.success;
      case "negative":
        return colors.feedback.error;
      default:
        return themeColors.text;
    }
  };

  return StyleSheet.create({
    container: {
      backgroundColor: themeColors.surface,
      padding: 16,
      borderRadius: 12,
      marginVertical: 6,
      elevation: 1,
      shadowColor: themeColors.text,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 1,
    },
    title: {
      fontSize: 14,
      color: themeColors.textSecondary,
      marginBottom: 4,
    },
    value: {
      fontSize: 20,
      fontWeight: "bold",
      color: getValueColor(),
      marginBottom: 2,
    },
    subtitle: {
      fontSize: 12,
      color: themeColors.textSecondary,
    },
  });
};
