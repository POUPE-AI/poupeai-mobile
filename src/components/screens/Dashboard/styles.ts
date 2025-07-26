import { colors } from "@/constants/theme";
import { ThemeType } from "@/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export const styles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme[theme].background,
    padding: 16,
  },
  containerContent: {
    paddingBottom: 96,
    gap: 8, // Espaçamento entre os elementos
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
  },
  horizontalScroll: {
    marginHorizontal: -16,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    gap: 16, // Espaçamento entre os cards
  },
  sectionContainer: {
    marginTop: 16,
    gap: 8,
  },
  sectionTitle: {
    color: colors.theme[theme].text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});