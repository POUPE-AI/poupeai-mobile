import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.feedback.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  completedText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  completedDate: {
    color: "#fff",
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
  },
});
