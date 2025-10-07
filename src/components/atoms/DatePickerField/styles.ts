import { StyleSheet } from "react-native";

export const styles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    disabledContainer: {
      opacity: 0.7,
    },
  });
