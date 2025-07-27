import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { colors } from "@/constants/theme";

interface EstimatedSavingsCardProps {
  value: number;
  title?: string;
}

export const EstimatedSavingsCard = ({ 
  value, 
  title = "Economia Estimada" 
}: EstimatedSavingsCardProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const formatValue = () => {
    const formattedValue = value.toFixed(2).replace('.', ',');
    const prefix = value >= 0 ? '+R$ ' : 'R$ ';
    return `${prefix}${formattedValue}`;
  };

  const getValueColor = () => {
    return value >= 0 ? colors.feedback.success : colors.feedback.error;
  };

  const getIcon = () => {
    return value >= 0 ? "trending-up" : "trending-down";
  };

  return (
    <View style={style.card}>
      <View style={style.leftContent}>
          <Ionicons 
            name={getIcon()} 
            size={24} 
            color={colors.primary[500]}
          />
        <Text style={style.title}>{title}</Text>
      </View>
      
      <Text style={[style.value, { color: getValueColor() }]}>
        {formatValue()}
      </Text>
    </View>
  );
};
