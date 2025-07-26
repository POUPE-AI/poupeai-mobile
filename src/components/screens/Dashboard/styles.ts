import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
  container: {
    backgroundColor: colors.theme[theme].background,
    flexGrow: 1,
    padding: 16,
  },
  greeting: {
    color: colors.theme[theme].text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.theme[theme].textSecondary,
    fontSize: 14,
    marginBottom: 16,
  },
  horizontalScroll: {
    marginHorizontal: -16,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    gap: 16, // Espaçamento entre os cards
  },
});