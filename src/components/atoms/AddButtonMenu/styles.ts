import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => {
  return StyleSheet.create({
    addButton: {
      width: 52,
      height: 52,
      borderRadius: 28,
      backgroundColor: colors.primary[500],
      justifyContent: "center",
      alignItems: "center",
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    menuContainer: {
      backgroundColor: colors.theme[theme].surface,
      borderRadius: 16,
      padding: 20,
      width: "80%",
      maxWidth: 300,
      elevation: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
    },
    menuItem: {
      marginBottom: 12,
    },
    menuButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
    },
    menuButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 12,
    },
  });
};
