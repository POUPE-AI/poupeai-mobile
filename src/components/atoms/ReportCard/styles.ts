import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

export const styles = (themeColors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: themeColors.surface,
      padding: 16,
      borderRadius: 12,
      marginVertical: 6,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary[500],
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: themeColors.text,
      marginBottom: 4,
    },
    description: {
      fontSize: 14,
      color: themeColors.textSecondary,
    },
  });
