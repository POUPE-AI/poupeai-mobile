import { ThemeType } from "@/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export const styles = (themeType: ThemeType) =>
  StyleSheet.create({
    container: {
      marginTop: 16,
    },
    header: {
      marginBottom: 16,
    },
    listContent: {
      paddingBottom: 16,
      gap: 8,
    },
  });
