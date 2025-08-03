import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { colors } from "@/constants/theme";
import { EstimatedSavingSection } from "@/types/dashboard";

interface EstimatedSavingsCardProps {
  data: EstimatedSavingSection;
  title?: string;
}

export const EstimatedSavingsCard = ({
  data,
  title = "Economia Estimada",
}: EstimatedSavingsCardProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const formatValue = () => {
    const formattedValue = Math.abs(data.estimated_savings)
      .toFixed(2)
      .replace(".", ",");
    const prefix = data.estimated_savings >= 0 ? "+R$ " : "R$ ";
    return `${prefix}${formattedValue}`;
  };

  const formatPercentage = () => {
    const percentage = Math.abs(data.savings_percentage);
    const sign = data.savings_percentage >= 0 ? "+" : "-";
    return `${sign}${percentage.toFixed(1).replace(".", ",")}%`;
  };

  const getValueColor = () => {
    return data.estimated_savings >= 0
      ? colors.feedback.success
      : colors.feedback.error;
  };

  const getIcon = () => {
    return data.estimated_savings >= 0 ? "trending-up" : "trending-down";
  };

  const getComparisonText = () => {
    switch (data.comparison_period) {
      case "monthly":
        return "vs mês anterior";
      case "weekly":
        return "vs semana anterior";
      case "yearly":
        return "vs ano anterior";
      default:
        return "vs período anterior";
    }
  };

  return (
    <View style={style.card}>
      <View style={style.content}>
        <View style={style.header}>
          <View style={style.leftContent}>
            <Ionicons name={getIcon()} size={24} color={colors.primary[500]} />
            <Text style={style.title}>{title}</Text>
          </View>

          <Text style={[style.value, { color: getValueColor() }]}>
            {formatValue()}
          </Text>
        </View>

        <View style={style.detailsRow}>
          <Text style={[style.percentage, { color: getValueColor() }]}>
            {formatPercentage()}
          </Text>
          <Text style={style.comparisonText}>{getComparisonText()}</Text>
        </View>

        {data.message && <Text style={style.message}>{data.message}</Text>}
      </View>
    </View>
  );
};
