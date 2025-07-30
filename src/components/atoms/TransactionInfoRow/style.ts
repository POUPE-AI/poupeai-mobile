import { ThemeType } from "@/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export const styles = (themeType: ThemeType) => StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});