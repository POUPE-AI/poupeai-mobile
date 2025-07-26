import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { View, Text } from "react-native";
import { BarChart, BarData } from "@/components/atoms/BarChart";
import { styles } from "./styles";

interface CategoriesCardProps {
  data: BarData[];
  title: string;
  tip: string;
}

export const CategoriesCard = ({ data, title, tip }: CategoriesCardProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const chartWidth = 280;
  const chartHeight = 120;

  return (
    <View style={style.card}>
      {/* Gráfico de fundo */}
      <BarChart
        data={data}
        width={chartWidth}
        height={chartHeight}
        showGradient={false}
        style={style.backgroundChart}
        theme={theme}
      />

      {/* Conteúdo sobreposto */}
      <View style={style.content}>
        <View style={style.titleContainer}>
          <Text style={style.title}>{title}</Text>
          <Text style={style.tip}>{tip}</Text>
        </View>
      </View>
    </View>
  );
};
