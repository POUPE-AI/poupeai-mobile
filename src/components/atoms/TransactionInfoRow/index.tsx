import { useTheme } from "@/contexts/ThemeContext";
import { Text } from "@/components/atoms/Text";
import { View } from "react-native";
import { styles } from "./style";

interface TransactionInfoRowProps {
  label: string;
  value?: string;
  children?: React.ReactNode;
}

export const TransactionInfoRow = ({ label, value, children }: TransactionInfoRowProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  return (
    <View style={style.row}>
      <Text variant="body" color="text">
        {label}:
      </Text>

      {children}

      {!children && (
      <Text variant="body" color="textSecondary">
        {value}
      </Text>
      )}
    </View>
  );
}