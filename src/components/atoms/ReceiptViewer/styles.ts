import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";

export const styles = (themeType: ThemeType) => {
  const isDark = themeType === "dark";

  return StyleSheet.create({
    container: {
      marginTop: 8,
    },
    labelContainer: {
      marginBottom: 8,
    },
    previewContainer: {
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: colors.theme[themeType].surface,
      borderWidth: 1,
      borderColor: colors.theme[themeType].border,
    },
    documentPreview: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      gap: 12,
    },
    documentInfo: {
      flex: 1,
      gap: 2,
    },
    iconColor: {
      color: colors.theme[themeType].textSecondary,
    },
    deleteButton: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      backgroundColor: colors.feedback.error,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    deleteText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
    },
  });
};