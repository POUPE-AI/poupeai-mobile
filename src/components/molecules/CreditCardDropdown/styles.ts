import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

export const styles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
    },
    dropdownContainer: {
      flex: 1,
    },
    createButton: {
      backgroundColor: colors.theme[theme].surface,
      borderWidth: 1,
      borderColor: colors.theme[theme].border,
      borderRadius: 12,
      width: 48,
      height: 48,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 0, // Alinhado com o dropdown
    },
    createButtonDisabled: {
      opacity: 0.7,
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.theme[theme].border,
      borderRadius: 12,
      backgroundColor: colors.theme[theme].surface,
    },
    loadingText: {
      fontSize: 14,
      color: colors.theme[theme].textSecondary,
      marginLeft: 8,
    },
  });
