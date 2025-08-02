import React from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { ReportCard } from "@/components/atoms/ReportCard";
import { styles } from "./styles";

const REPORT_TYPES = [
  {
    key: "overview",
    title: "Visão Geral",
    description: "Relatório completo das suas finanças",
    icon: "analytics-outline" as const,
    route: "(tabs)/reports/overview",
  },
  {
    key: "expense",
    title: "Despesas",
    description: "Análise detalhada dos seus gastos",
    icon: "trending-down-outline" as const,
    route: "(tabs)/reports/expense",
  },
  {
    key: "income",
    title: "Receitas",
    description: "Acompanhe suas fontes de renda",
    icon: "trending-up-outline" as const,
    route: "(tabs)/reports/income",
  },
  {
    key: "category",
    title: "Análise por Categorias",
    description: "Relatório detalhado por todas as categorias",
    icon: "pie-chart-outline" as const,
    route: "(tabs)/reports/category",
  },
];

export default function ReportsMainScreen() {
  const { colors: themeColors } = useTheme();
  const style = styles(themeColors);

  const navigateToReport = (route: string) => {
    router.push(route as any);
  };

  return (
    <ScrollView
      style={style.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 56 }}
    >
      <View style={style.header}>
        <Text style={style.title}>Relatórios Financeiros</Text>
        <Text style={style.subtitle}>
          Relatórios inteligentes gerados por IA para ajudar você a entender
          melhor suas finanças
        </Text>
      </View>

      <View style={style.content}>
        {REPORT_TYPES.map((report) => (
          <ReportCard
            key={report.key}
            title={report.title}
            description={report.description}
            icon={report.icon}
            onPress={() => navigateToReport(report.route)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
