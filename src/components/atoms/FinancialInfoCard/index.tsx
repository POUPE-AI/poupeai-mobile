import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";

interface FinancialInfoCardProps {
  title: string;
  value: string;
  subtitle?: string;
  variant?: "default" | "positive" | "negative";
}

export const FinancialInfoCard: React.FC<FinancialInfoCardProps> = ({
  title,
  value,
  subtitle,
  variant = "default",
}) => {
  const { colors: themeColors } = useTheme();
  const style = styles(themeColors, variant);

  return (
    <View style={style.container}>
      <Text style={style.title}>{title}</Text>
      <Text style={style.value}>{value}</Text>
      {subtitle && <Text style={style.subtitle}>{subtitle}</Text>}
    </View>
  );
};
