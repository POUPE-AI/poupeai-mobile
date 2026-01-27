import { Text } from "@/components/atoms/Text";
import { useCategory } from "@/hooks/useCategories";
import { getContrastColor } from "@/utils/color";
import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";

export const CategoryTag = ({ name, colorHex }: { name: string, colorHex?: string }) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const color = colorHex || "#EEE";
  const textColor = getContrastColor(color);

  return (
    <Text
      variant="body"
      style={[style.categoryTag, { backgroundColor: color, color: textColor }]}
    >
      {name}
    </Text>
  );
};
