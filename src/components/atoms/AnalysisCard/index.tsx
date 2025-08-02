import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";

interface AnalysisCardProps {
  title: string;
  content: string;
  icon: keyof typeof Ionicons.glyphMap;
  variant?: "analysis" | "suggestion";
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({
  title,
  content,
  icon,
  variant = "analysis",
}) => {
  const { colors: themeColors } = useTheme();
  const style = styles(themeColors, variant);

  const getIconColor = () => {
    return variant === "suggestion" ? "#ff660f" : "#17a2b8";
  };

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Ionicons name={icon} size={20} color={getIconColor()} />
        <Text style={style.title}>{title}</Text>
      </View>
      <Text style={style.content}>{content}</Text>
    </View>
  );
};
