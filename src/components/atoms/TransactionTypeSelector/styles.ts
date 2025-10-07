import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

export const styles = (theme: "light" | "dark") =>
  StyleSheet.create({
    typeContainer: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: colors.theme[theme].border,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: colors.theme[theme].surface,
    },
    typeButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: "center",
      backgroundColor: "transparent",
    },
    typeButtonActive: {
      backgroundColor: colors.primary[500],
    },
    typeButtonDisabled: {
      opacity: 0.6,
    },
    typeButtonText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.theme[theme].text,
    },
    typeButtonTextActive: {
      color: "#ffffff",
    },
    typeButtonTextDisabled: {
      opacity: 0.7,
    },
  });
