import { Text } from "@/components/atoms/Text";
import { useCategory } from "@/hooks/useCategories";
import { getContrastColor } from "@/utils/color";
import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";

export const CategoryTag = ({ categoryId }: { categoryId: string }) => {
  const { theme } = useTheme();
  const style = styles(theme);
  const { data, isLoading, error } = useCategory(categoryId);

  const text = isLoading
    ? "Carregando..."
    : error
    ? "Erro"
    : data?.name || "Sem categoria";

  const color = data?.colorHex || "#EEE";
  const textColor = getContrastColor(color);

  return (
    <Text
      variant="body"
      style={[style.categoryTag, { backgroundColor: color, color: textColor }]}
    >
      {text}
    </Text>
  );
};
