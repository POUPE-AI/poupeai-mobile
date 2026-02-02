import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";

export const styles = (themeType: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.theme[themeType].background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.theme[themeType].border,
      backgroundColor: colors.theme[themeType].surface,
    },
    closeButton: {
      padding: 8,
      marginLeft: -8,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.theme[themeType].text,
    },
    placeholder: {
      width: 40,
    },
    webviewContainer: {
      flex: 1,
    },
    webview: {
      flex: 1,
      backgroundColor: colors.theme[themeType].background,
    },
  });