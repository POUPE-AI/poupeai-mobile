import { StyleSheet } from "react-native";
import { ThemeType } from "@/contexts/ThemeContext";
import { colors } from "@/constants/theme";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.theme[theme].text,
      marginBottom: 8,
    },
    iconButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.theme[theme].border,
      borderRadius: 8,
      backgroundColor: colors.theme[theme].background,
    },
    iconPreview: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.theme[theme].surface,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    iconButtonText: {
      flex: 1,
      fontSize: 16,
      color: colors.theme[theme].text,
    },
    errorText: {
      fontSize: 12,
      color: colors.feedback.error,
      marginTop: 4,
    },
    iconGrid: {
      maxHeight: 400,
    },
    iconRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingHorizontal: 8,
    },
    iconOption: {
      width: "22%",
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      marginBottom: 12,
      backgroundColor: colors.theme[theme].surface,
      borderWidth: 2,
      borderColor: "transparent",
    },
    iconOptionSelected: {
      borderColor: colors.primary[500],
      backgroundColor: colors.primary[100],
    },
  });
