import { View } from "react-native";
import { Text } from "@/components/atoms/Text";
import { FormatDate } from "@/utils/date";
import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";

interface TransactionsSeparatorProps {
  date: string;
}

export const TransactionsSeparator = ({ date }: TransactionsSeparatorProps) => {
  const { colors: themeColors } = useTheme();

  return (
    <View style={styles.container}>
      <Text color="textSecondary" style={styles.dateText}>
        {FormatDate(date)}
      </Text>
      <View
        style={[styles.separator, { backgroundColor: themeColors.border }]}
      />
    </View>
  );
};
