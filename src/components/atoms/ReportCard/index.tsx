import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";

interface ReportCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  title,
  description,
  icon,
  onPress,
}) => {
  const { colors: themeColors } = useTheme();
  const style = styles(themeColors);

  return (
    <TouchableOpacity
      style={style.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={style.iconContainer}>
        <Ionicons name={icon} size={24} color={themeColors.text} />
      </View>
      <View style={style.textContainer}>
        <Text style={style.title}>{title}</Text>
        <Text style={style.description}>{description}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={themeColors.textSecondary}
      />
    </TouchableOpacity>
  );
};
