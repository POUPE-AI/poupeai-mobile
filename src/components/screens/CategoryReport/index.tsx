import React, { useLayoutEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/contexts/ThemeContext";
import { FinancialInfoCard } from "@/components/atoms/FinancialInfoCard";
import { AnalysisCard } from "@/components/atoms/AnalysisCard";
import { Button } from "@/components/atoms/Button";
import { LoadingContent } from "@/components/atoms/LoadingContent";
import { ErrorContent } from "@/components/atoms/ErrorContent";
import { ReportHeaderRight } from "@/components/atoms/ReportHeaderRight";
import { useCategoryReport, useRefreshReports } from "@/hooks/useReports";
import { styles } from "./styles";

export default function CategoryReportScreen() {
  const { colors: themeColors } = useTheme();
  const navigation = useNavigation();
  const style = styles(themeColors);

  // Hooks para buscar dados e refrescar
  const { data: reportData, isLoading, error, refetch } = useCategoryReport();
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
    return <LoadingContent text="Carregando análise por categorias..." />;
  }

  if (error || !reportData) {
    return <ErrorContent text="Erro ao carregar análise por categorias" />;
  }

  const { content } = reportData;

  return (
    <View style={style.container}>
      <ScrollView
        style={style.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* Análise por Categorias */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Análise por Categorias</Text>
          <Text style={style.period}>
            {formatDate(content.startDate)} - {formatDate(content.endDate)}
          </Text>

          <View style={style.row}>
            <View style={style.halfCard}>
              <FinancialInfoCard
                title="Total Movimentado"
                value={formatCurrency(content.total)}
                variant="default"
              />
            </View>
            <View style={style.halfCard}>
              <FinancialInfoCard
                title="Média"
                value={formatCurrency(content.average)}
                variant="default"
              />
            </View>
          </View>
        </View>

        {/* Tendência das Categorias */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Tendência das Categorias</Text>
          <View style={style.trendContainer}>
            <Ionicons name="trending-up" size={20} color="#17a2b8" />
            <Text style={style.trendText}>{content.trend}</Text>
          </View>
        </View>

        {/* Dias de Maior Atividade */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Dias de Maior Atividade</Text>
          {content.peakDays.map((day, index) => (
            <View key={index} style={style.peakDayItem}>
              <Ionicons
                name="calendar"
                size={16}
                color={themeColors.textSecondary}
              />
              <Text style={style.peakDayText}>{formatDate(day)}</Text>
            </View>
          ))}
        </View>

        {/* Principais Movimentações por Categoria */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>
            Principais Movimentações por Categoria
          </Text>
          {content.transactions.map((transaction, index) => (
            <View key={index} style={style.transactionItem}>
              <View style={style.transactionInfo}>
                <Text style={style.transactionDescription}>
                  {transaction.description}
                </Text>
                <Text style={style.transactionDate}>
                  {formatDate(transaction.date)}
                </Text>
              </View>
              <Text
                style={[
                  style.transactionAmount,
                  { color: transaction.amount > 0 ? "#28a745" : "#dc3545" },
                ]}
              >
                {formatCurrency(Math.abs(transaction.amount))}
              </Text>
            </View>
          ))}
        </View>

        {/* Análise e Sugestões */}
        <View style={style.section}>
          <AnalysisCard
            title="Análise das Categorias"
            content={content.textAnalysis}
            icon="analytics-outline"
            variant="analysis"
          />

          <AnalysisCard
            title="Sugestões por Categoria"
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
