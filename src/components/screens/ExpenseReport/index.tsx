import React, { useLayoutEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/contexts/ThemeContext";
import { FinancialInfoCard } from "@/components/atoms/FinancialInfoCard";
import { AnalysisCard } from "@/components/atoms/AnalysisCard";
import { Button } from "@/components/atoms/Button";
import { LoadingContent } from "@/components/atoms/LoadingContent";
import { ErrorContent } from "@/components/atoms/ErrorContent";
import { ReportHeaderRight } from "@/components/atoms/ReportHeaderRight";
import { useExpenseReport, useRefreshReports } from "@/hooks/useReports";
import { styles } from "./styles";

export default function ExpenseReportScreen() {
  const { colors: themeColors } = useTheme();
  const navigation = useNavigation();
  const style = styles(themeColors);

  // Hooks para buscar dados e refrescar
  const { data: reportData, isLoading, error, refetch } = useExpenseReport();
  const refreshReportsMutation = useRefreshReports();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleRefresh = async () => {
    try {
      await refreshReportsMutation.mutateAsync();
      refetch();
    } catch (error) {
      console.error("Erro ao atualizar relatório:", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <ReportHeaderRight onRefresh={handleRefresh} />,
    });
  }, [navigation]);

  if (isLoading) {
    return <LoadingContent text="Carregando relatório de despesas..." />;
  }

  if (error || !reportData) {
    return <ErrorContent text="Erro ao carregar relatório de despesas" />;
  }

  const { content } = reportData;

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
            {formatDate(content.startDate)} - {formatDate(content.endDate)}
          </Text>

          <FinancialInfoCard
            title="Total Gasto no Período"
            value={formatCurrency(content.totalExpense)}
            variant="negative"
          />
        </View>

        {/* Categorias de Despesas */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Despesas por Categoria</Text>
          {content.categories.map((category, index) => (
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
          {content.mainExpenses.map((expense, index) => (
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
            content={content.textAnalysis}
            icon="analytics-outline"
            variant="analysis"
          />

          <AnalysisCard
            title="Sugestões de Economia"
            content={content.suggestion}
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
