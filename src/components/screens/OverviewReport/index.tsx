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
import { useOverviewReport, useRefreshReports } from "@/hooks/useReports";
import { styles } from "./styles";

export default function OverviewReportScreen() {
  const { colors: themeColors } = useTheme();
  const navigation = useNavigation();
  const style = styles(themeColors);

  // Hooks para buscar dados e refrescar
  const { data: reportData, isLoading, error, refetch } = useOverviewReport();
  const refreshReportsMutation = useRefreshReports();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
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
    return <LoadingContent text="Carregando relatório..." />;
  }

  if (error || !reportData) {
    return <ErrorContent text="Erro ao carregar relatório de visão geral" />;
  }

  const { content } = reportData;

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
            {new Date(content.startDate).toLocaleDateString("pt-BR")} -{" "}
            {new Date(content.endDate).toLocaleDateString("pt-BR")}
          </Text>

          <FinancialInfoCard
            title="Saldo Atual"
            value={formatCurrency(content.balance)}
            variant={content.balance >= 0 ? "positive" : "negative"}
          />

          <View style={style.row}>
            <View style={style.halfCard}>
              <FinancialInfoCard
                title="Receitas"
                value={formatCurrency(content.totalIncome)}
                variant="positive"
              />
            </View>
            <View style={style.halfCard}>
              <FinancialInfoCard
                title="Despesas"
                value={formatCurrency(content.totalExpense)}
                variant="negative"
              />
            </View>
          </View>
        </View>

        {/* Categorias */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Principais Categorias</Text>
          {content.categories.map((category, index) => (
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
            content={content.textAnalysis}
            icon="analytics-outline"
            variant="analysis"
          />

          <AnalysisCard
            title="Sugestões"
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
