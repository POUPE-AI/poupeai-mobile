import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";
import { colors } from "@/constants/theme";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ErrorContentProps {
  text: string;
}

export const ErrorContent = ({ text }: ErrorContentProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  return (
    <View style={style.errorContainer}>
      <Ionicons
        name="alert-circle-outline"
        size={48}
        color={colors.feedback.error}
      />
      <Text style={style.errorText}>{text}</Text>
      <Text style={style.errorSubtext}>Tente novamente mais tarde</Text>
    </View>
  );
};
