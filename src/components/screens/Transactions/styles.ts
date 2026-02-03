import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.theme[theme].background,
      padding: 16,
    },
    listHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    listTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.theme[theme].text,
    },
    buttonsContainer: {
      flexDirection: "row",
      gap: 8,
    },
    addButton: {
      backgroundColor: colors.primary[500],
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    importButton: {
      backgroundColor: colors.primary[500],
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
  });
