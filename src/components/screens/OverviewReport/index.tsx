import React, { useLayoutEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/contexts/ThemeContext";
import { FinancialInfoCard } from "@/components/atoms/FinancialInfoCard";
import { AnalysisCard } from "@/components/atoms/AnalysisCard";
import { Button } from "@/components/atoms/Button";
import { ReportHeaderRight } from "@/components/atoms/ReportHeaderRight";
import { styles } from "./styles";

// Mock data - será substituído pelos dados reais da API
const mockOverviewData = {
  header: {
    status: 200,
    message: "Relatório financeiro gerado com sucesso.",
  },
  content: {
    balance: 3403.36,
    totalIncome: 3600,
    totalExpense: 696.64,
    categories: [
      { name: "Salario", balance: 3600 },
      { name: "Mercado", balance: -338.1 },
      { name: "Casa", balance: -149.64 },
      { name: "Trabalho", balance: -150 },
      { name: "Lazer", balance: -26 },
    ],
    startDate: "2025-07-02",
    endDate: "2025-08-02",
    textAnalysis:
      "O período analisado apresenta um saldo positivo, impulsionado pela receita de salários. As maiores despesas concentram-se nas categorias 'Mercado' e 'Casa'.",
    suggestion:
      "Monitore seus gastos na categoria 'Mercado' para otimizar seu orçamento. Considere alternativas para reduzir os custos com 'Casa'.",
    createdAt: "2025-08-02T20:48:01.8747607Z",
  },
};

export default function OverviewReportScreen() {
  const { colors: themeColors } = useTheme();
  const navigation = useNavigation();
  const style = styles(themeColors);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleRefresh = () => {
    console.log("Refreshing overview report...");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <ReportHeaderRight onRefresh={handleRefresh} />,
    });
  }, [navigation]);

  return (
    <View style={style.container}>
      <ScrollView
        style={style.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* Resumo Financeiro */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Resumo do Período</Text>
          <Text style={style.period}>
            {new Date(mockOverviewData.content.startDate).toLocaleDateString(
              "pt-BR"
            )}{" "}
            -{" "}
            {new Date(mockOverviewData.content.endDate).toLocaleDateString(
              "pt-BR"
            )}
          </Text>

          <FinancialInfoCard
            title="Saldo Atual"
            value={formatCurrency(mockOverviewData.content.balance)}
            variant={
              mockOverviewData.content.balance >= 0 ? "positive" : "negative"
            }
          />

          <View style={style.row}>
            <View style={style.halfCard}>
              <FinancialInfoCard
                title="Receitas"
                value={formatCurrency(mockOverviewData.content.totalIncome)}
                variant="positive"
              />
            </View>
            <View style={style.halfCard}>
              <FinancialInfoCard
                title="Despesas"
                value={formatCurrency(mockOverviewData.content.totalExpense)}
                variant="negative"
              />
            </View>
          </View>
        </View>

        {/* Categorias */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Principais Categorias</Text>
          {mockOverviewData.content.categories.map((category, index) => (
            <FinancialInfoCard
              key={index}
              title={category.name}
              value={formatCurrency(Math.abs(category.balance))}
              variant={category.balance >= 0 ? "positive" : "negative"}
            />
          ))}
        </View>

        {/* Análise e Sugestões */}
        <View style={style.section}>
          <AnalysisCard
            title="Análise do Período"
            content={mockOverviewData.content.textAnalysis}
            icon="analytics-outline"
            variant="analysis"
          />

          <AnalysisCard
            title="Sugestões"
            content={mockOverviewData.content.suggestion}
            icon="bulb-outline"
            variant="suggestion"
          />
        </View>

        <View style={style.buttonContainer}>
          <Button
            title="Atualizar Relatório"
            onPress={handleRefresh}
            variant="primary"
          />
        </View>
      </ScrollView>
    </View>
  );
}
