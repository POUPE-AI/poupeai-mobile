import { useTheme } from "@/contexts/ThemeContext";
import { ActivityIndicator, Text, View } from "react-native";
import { styles } from "./styles";
import { colors } from "@/constants/theme";

interface LoadingContentProps {
  text: string;
}

export const LoadingContent = ({text}: LoadingContentProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  return (
    <View style={style.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
      <Text style={style.loadingText}>Carregando {text.toLowerCase()}...</Text>
    </View>
  );
};
