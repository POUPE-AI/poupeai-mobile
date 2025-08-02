import { StyleSheet } from "react-native";

export const styles = (themeColors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    header: {
      padding: 20,
      paddingBottom: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: themeColors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: themeColors.textSecondary,
      lineHeight: 22,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
  });
