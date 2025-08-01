import { ThemeType } from "@/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export const styles = (themeType: ThemeType) =>
  StyleSheet.create({
    categoryTag: {
      paddingHorizontal: 16,
      borderRadius: 8,
    },
  });
