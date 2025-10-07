import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

export const styles = (
  themeColors: any,
  variant: "analysis" | "suggestion"
) => {
  const getIconColor = () => {
    return variant === "suggestion"
      ? colors.primary[500]
      : colors.feedback.info;
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
      borderLeftWidth: 3,
      borderLeftColor: getIconColor(),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: themeColors.text,
      marginLeft: 8,
    },
    content: {
      fontSize: 14,
      color: themeColors.text,
      lineHeight: 20,
    },
  });
};
