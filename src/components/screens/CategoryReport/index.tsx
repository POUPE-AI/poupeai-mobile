import React, { useLayoutEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/contexts/ThemeContext";
import { FinancialInfoCard } from "@/components/atoms/FinancialInfoCard";
import { AnalysisCard } from "@/components/atoms/AnalysisCard";
import { Button } from "@/components/atoms/Button";
import { ReportHeaderRight } from "@/components/atoms/ReportHeaderRight";
import { styles } from "./styles";

// Mock data - será substituído pelos dados reais da API
const mockCategoryData = {
  header: {
    status: 200,
    message: "Relatório financeiro gerado com sucesso.",
  },
  content: {
    category: "Geral",
    total: 3706.32,
    average: 716.78,
    trend: "Aumento nos gastos com Mercado.",
    peakDays: ["2025-08-01", "2025-08-02", "2025-07-08"],
    transactions: [
      {
        description: "Salario",
        date: "2025-08-01T00:00:00",
        amount: 1800,
      },
      {
        description: "Salario",
        date: "2025-07-08T00:00:00",
        amount: 1800,
      },
      {
        description: "Compras Mercado",
        date: "2025-08-01T00:00:00",
        amount: 186.94,
      },
      {
        description: "Compra de Computador (1/8)",
        date: "2025-08-01T00:00:00",
        amount: 150,
      },
      {
        description: "Caern",
        date: "2025-08-02T00:00:00",
        amount: 108.96,
      },
    ],
    startDate: "2025-07-02",
    endDate: "2025-08-02",
    textAnalysis:
      "As categorias Salário e Mercado são as que mais impactam no seu orçamento. Analise seus gastos e ganhos para um melhor planejamento financeiro.",
    suggestion:
      "Monitore seus gastos com Mercado e Casa para otimizar seu orçamento.",
    createdAt: "2025-08-02T20:51:30.7103157Z",
  },
};

export default function CategoryReportScreen() {
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
    console.log("Refreshing category report...");
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
        {/* Informações da Categoria */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>
            Categoria: {mockCategoryData.content.category}
          </Text>
          <Text style={style.period}>
            {formatDate(mockCategoryData.content.startDate)} -{" "}
            {formatDate(mockCategoryData.content.endDate)}
          </Text>

          <View style={style.row}>
            <View style={style.halfCard}>
              <FinancialInfoCard
                title="Total Movimentado"
                value={formatCurrency(mockCategoryData.content.total)}
                variant="default"
              />
            </View>
            <View style={style.halfCard}>
              <FinancialInfoCard
                title="Média Diária"
                value={formatCurrency(mockCategoryData.content.average)}
                variant="default"
              />
            </View>
          </View>
        </View>

        {/* Tendência */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Tendência</Text>
          <View style={style.trendContainer}>
            <Ionicons name="trending-up" size={20} color="#17a2b8" />
            <Text style={style.trendText}>
              {mockCategoryData.content.trend}
            </Text>
          </View>
        </View>

        {/* Dias de Pico */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Dias de Maior Movimentação</Text>
          {mockCategoryData.content.peakDays.map((day, index) => (
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

        {/* Transações Principais */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Principais Transações</Text>
          {mockCategoryData.content.transactions.map((transaction, index) => (
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
            title="Análise da Categoria"
            content={mockCategoryData.content.textAnalysis}
            icon="analytics-outline"
            variant="analysis"
          />

          <AnalysisCard
            title="Sugestões"
            content={mockCategoryData.content.suggestion}
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
