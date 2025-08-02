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
const mockExpenseData = {
  header: {
    status: 200,
    message: null,
  },
  content: {
    totalExpense: 614.7,
    categories: [
      { name: "Casa", balance: 149.64 },
      { name: "Mercado", balance: 288.1 },
      { name: "Lazer", balance: 26 },
      { name: "Trabalho", balance: 150 },
    ],
    mainExpenses: [
      {
        description: "Caern",
        categoryName: "Casa",
        date: "2025-08-02T00:00:00",
        amount: 108.96,
      },
      {
        description: "Compras Mercado",
        categoryName: "Mercado",
        date: "2025-08-01T00:00:00",
        amount: 186.94,
      },
      {
        description: "Racao do Cachorro",
        categoryName: "Mercado",
        date: "2025-08-01T00:00:00",
        amount: 101.16,
      },
      {
        description: "Compra de Computador (1/8)",
        categoryName: "Trabalho",
        date: "2025-08-01T00:00:00",
        amount: 150,
      },
      {
        description: "Energia",
        categoryName: "Casa",
        date: "2025-08-02T00:00:00",
        amount: 40.68,
      },
    ],
    startDate: "2025-07-02",
    endDate: "2025-08-02",
    textAnalysis:
      "Durante o período analisado, as maiores despesas foram com 'Mercado' e 'Casa'. É importante ficar atento a esses gastos para manter as finanças equilibradas.",
    suggestion:
      "Monitore seus gastos na categoria 'Mercado' para garantir que você está dentro do orçamento.",
    createdAt: "2025-08-02T20:50:52.0395495Z",
  },
};

export default function ExpenseReportScreen() {
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
    console.log("Refreshing expense report...");
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
        {/* Total de Despesas */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Total de Despesas</Text>
          <Text style={style.period}>
            {formatDate(mockExpenseData.content.startDate)} -{" "}
            {formatDate(mockExpenseData.content.endDate)}
          </Text>

          <FinancialInfoCard
            title="Total Gasto no Período"
            value={formatCurrency(mockExpenseData.content.totalExpense)}
            variant="negative"
          />
        </View>

        {/* Categorias de Despesas */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Despesas por Categoria</Text>
          {mockExpenseData.content.categories.map((category, index) => (
            <FinancialInfoCard
              key={index}
              title={category.name}
              value={formatCurrency(category.balance)}
              variant="negative"
            />
          ))}
        </View>

        {/* Principais Despesas */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Principais Despesas</Text>
          {mockExpenseData.content.mainExpenses.map((expense, index) => (
            <View key={index} style={style.expenseItem}>
              <View style={style.expenseInfo}>
                <Text style={style.expenseDescription}>
                  {expense.description}
                </Text>
                <Text style={style.expenseCategory}>
                  {expense.categoryName}
                </Text>
                <Text style={style.expenseDate}>
                  {formatDate(expense.date)}
                </Text>
              </View>
              <Text style={style.expenseAmount}>
                {formatCurrency(expense.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Análise e Sugestões */}
        <View style={style.section}>
          <AnalysisCard
            title="Análise das Despesas"
            content={mockExpenseData.content.textAnalysis}
            icon="analytics-outline"
            variant="analysis"
          />

          <AnalysisCard
            title="Sugestões de Economia"
            content={mockExpenseData.content.suggestion}
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
