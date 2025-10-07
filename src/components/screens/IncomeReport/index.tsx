import React, { useLayoutEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTheme } from "@/contexts/ThemeContext";
import { FinancialInfoCard } from "@/components/atoms/FinancialInfoCard";
import { AnalysisCard } from "@/components/atoms/AnalysisCard";
import { Button } from "@/components/atoms/Button";
import { LoadingContent } from "@/components/atoms/LoadingContent";
import { ErrorContent } from "@/components/atoms/ErrorContent";
import { ReportHeaderRight } from "@/components/atoms/ReportHeaderRight";
import { useIncomeReport, useRefreshReports } from "@/hooks/useReports";
import { styles } from "./styles";

export default function IncomeReportScreen() {
  const { colors: themeColors } = useTheme();
  const navigation = useNavigation();
  const style = styles(themeColors);

  // Hooks para buscar dados e refrescar
  const { data: reportData, isLoading, error, refetch } = useIncomeReport();
  const refreshReportsMutation = useRefreshReports();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
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
    return <LoadingContent text="relatório de receitas" />;
  }

  if (error || !reportData) {
    return <ErrorContent text="Erro ao carregar relatório de receitas" />;
  }

  const { content } = reportData;

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
            {formatDate(content.startDate)} - {formatDate(content.endDate)}
          </Text>

          <FinancialInfoCard
            title="Total Recebido no Período"
            value={formatCurrency(content.totalIncome)}
            variant="positive"
          />
        </View>

        {/* Categorias de Receitas */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Receitas por Categoria</Text>
          {content.categories.map((category, index) => (
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
          {content.mainIncomes.map((income, index) => (
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
            content={content.textAnalysis}
            icon="analytics-outline"
            variant="analysis"
          />

          <AnalysisCard
            title="Sugestões de Crescimento"
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
