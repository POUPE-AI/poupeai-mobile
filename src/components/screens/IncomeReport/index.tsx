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
const mockIncomeData = {
  header: {
    status: 200,
    message: "Relatório financeiro gerado com sucesso.",
  },
  content: {
    totalIncome: 3600,
    categories: [
      { name: "Salario", balance: 3600 },
      { name: "Mercado", balance: 338.1 },
      { name: "Casa", balance: 196.64 },
      { name: "Trabalho", balance: 150 },
      { name: "Lazer", balance: 26 },
    ],
    mainIncomes: [
      {
        description: "Salario",
        categoryName: "Salario",
        date: "2025-08-01T00:00:00",
        amount: 1800,
      },
      {
        description: "Salario",
        categoryName: "Salario",
        date: "2025-07-08T00:00:00",
        amount: 1800,
      },
    ],
    startDate: "2025-07-02",
    endDate: "2025-08-02",
    textAnalysis:
      "O relatório financeiro apresenta um total de receitas de R$3600.00 no período analisado. As principais categorias de despesas incluem Casa, Mercado, Trabalho e Lazer. É importante analisar os gastos em cada categoria para identificar oportunidades de economia e otimizar o orçamento.",
    suggestion:
      "Com base nas suas receitas e despesas, observei que a maior parte dos seus gastos está concentrada nas categorias Casa e Mercado. Avalie se é possível reduzir os gastos nessas áreas. Continue mantendo o controle de suas finanças para garantir um futuro financeiro estável.",
    createdAt: "2025-08-02T20:51:12.2215882Z",
  },
};

export default function IncomeReportScreen() {
  const { colors: themeColors } = useTheme();
  const navigation = useNavigation();
  const style = styles(themeColors);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleRefresh = () => {
    // TODO: Implementar refresh dos dados
    console.log("Refreshing income report...");
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
        {/* Total de Receitas */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Total de Receitas</Text>
          <Text style={style.period}>
            {formatDate(mockIncomeData.content.startDate)} -{" "}
            {formatDate(mockIncomeData.content.endDate)}
          </Text>

          <FinancialInfoCard
            title="Total Recebido no Período"
            value={formatCurrency(mockIncomeData.content.totalIncome)}
            variant="positive"
          />
        </View>

        {/* Categorias de Receitas */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Receitas por Categoria</Text>
          {mockIncomeData.content.categories.map((category, index) => (
            <FinancialInfoCard
              key={index}
              title={category.name}
              value={formatCurrency(category.balance)}
              variant="positive"
            />
          ))}
        </View>

        {/* Principais Receitas */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Principais Receitas</Text>
          {mockIncomeData.content.mainIncomes.map((income, index) => (
            <View key={index} style={style.incomeItem}>
              <View style={style.incomeInfo}>
                <Text style={style.incomeDescription}>
                  {income.description}
                </Text>
                <Text style={style.incomeCategory}>{income.categoryName}</Text>
                <Text style={style.incomeDate}>{formatDate(income.date)}</Text>
              </View>
              <Text style={style.incomeAmount}>
                {formatCurrency(income.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Análise e Sugestões */}
        <View style={style.section}>
          <AnalysisCard
            title="Análise das Receitas"
            content={mockIncomeData.content.textAnalysis}
            icon="analytics-outline"
            variant="analysis"
          />

          <AnalysisCard
            title="Sugestões de Crescimento"
            content={mockIncomeData.content.suggestion}
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
