import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";
import { th } from "date-fns/locale";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      marginTop: 8,
    },
    uploadButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.feedback.info,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    uploadButtonDisabled: {
      opacity: 0.6,
    },
    uploadButtonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
    },
  });