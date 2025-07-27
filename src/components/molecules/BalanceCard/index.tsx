import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { View, Text } from "react-native";
import { LineChart, LineData } from "@/components/atoms/LineChart";
import { styles } from "./styles";
import { colors } from "@/constants/theme";

interface BalanceCardProps {
    data: LineData[];
    title: string;
    percentage: number;
    amount: number;
}

export const BalanceCard = ({data, title, percentage, amount}: BalanceCardProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  // Obter cor da porcentagem baseada no valor
  const getPercentageColor = () => {
    return percentage >= 0 ? colors.feedback.success : colors.feedback.error;
  };

  const chartWidth = 280;
  const chartHeight = 160;

  return (
    <View style={style.card}>
      {/* Gráfico de fundo */}
      <LineChart
        lines={data}
        width={chartWidth}
        height={chartHeight}
        showArea={true}
        style={style.backgroundChart}
        theme={theme}
      />

      {/* Conteúdo sobreposto */}
      <View style={style.content}>
        <View style={style.titleContainer}>
          <Text style={style.title}>{title}</Text>
          <Text style={[style.percentage, { color: getPercentageColor() }]}>
            {percentage >= 0 ? '+' : ''}{percentage.toFixed(2).replace('.', ',')}%
          </Text>
        </View>
        <Text style={style.amount}>R$ {amount.toFixed(2).replace('.', ',')}</Text>
      </View>
    </View>
  );
};
