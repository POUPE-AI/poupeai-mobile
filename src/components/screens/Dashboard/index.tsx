import React from "react";
import { Text, ScrollView, View } from "react-native";
import { BalanceCard } from "@/components/molecules/BalanceCard";
import { CategoriesCard } from "@/components/molecules/CategoriesCard";
import { EstimatedSavingsCard } from "@/components/molecules/EstimatedSavingsCard";
import { TransactionsListItem } from "@/components/atoms/TransactionsListItem";
//import CategoryChart from "@/components/atoms/CategoryChart";
//import EstimatedSavings from "@/components/atoms/EstimatedSavings";
import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";
import { Transaction } from "@/types/transactions";
import { useAccessToken } from "@/hooks/useAccessToken";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import { LoadingContent } from "@/components/atoms/LoadingContent";
import { ErrorContent } from "@/components/atoms/ErrorContent";

// Mock data para cada tipo de card
const mockData = {
  saldoTotal: [
    { data: [1200, 800, 950, 1235, 1100, 1300, 1235] },
    { data: [900, 1100, 850, 1150, 1050, 1200, 1000] },
    { data: [600, 750, 680, 900, 820, 950, 875] },
  ],
  receitas: [
    { data: [2500, 2800, 2600, 3200, 2900, 3500, 3100] },
    { data: [1800, 2100, 1900, 2400, 2200, 2600, 2300] },
  ],
  despesas: [
    { data: [1800, 2200, 1900, 2100, 2000, 2300, 2050] },
    { data: [1200, 1500, 1350, 1600, 1450, 1700, 1550] },
    { data: [800, 1000, 900, 1100, 950, 1200, 1100] },
  ],
  faturas: [
    { data: [450, 520, 480, 600, 550, 650, 580] },
    { data: [320, 380, 350, 420, 400, 480, 450] },
  ],
};

// Mock data para categorias
const mockCategoriesData = [
  { value: 850, label: "Alimentação" },
  { value: 420, label: "Transporte" },
  { value: 320, label: "Saúde" },
  { value: 280, label: "Lazer" },
  { value: 180, label: "Outros" },
];

export default function DashboardScreen() {
  const { theme } = useTheme();
  const style = styles(theme);

  const { user } = useAuth();

  const {
    data: transactions,
    isLoading: transactionLoading,
    error: transactionsError,
  } = useTransactions({ issue_date_end: new Date().toISOString().split('T')[0] });
  const lastTransactions =
    transactions?.pages[0]?.results
      .slice()
      .sort(
        (a, b) =>
          new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime()
      )
      .slice(0, 5) || [];

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.containerContent}
    >
      <View>
        <Text style={style.greeting}>Olá, {user?.name || "Desconhecido"}</Text>
        <Text style={style.subtitle}>Aqui está um resumo do seu mês</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.cardsContainer}
        style={style.horizontalScroll}
      >
        <BalanceCard
          data={mockData.saldoTotal}
          title="Saldo Total"
          percentage={-51.49}
          amount={1235.99}
        />

        <BalanceCard
          data={mockData.receitas}
          title="Receitas"
          percentage={12.35}
          amount={3100.5}
        />

        <BalanceCard
          data={mockData.despesas}
          title="Despesas"
          percentage={-8.2}
          amount={2050.75}
        />

        <BalanceCard
          data={mockData.faturas}
          title="Faturas"
          percentage={15.6}
          amount={580.25}
        />
      </ScrollView>

      <CategoriesCard
        data={mockCategoriesData}
        title="Categorias"
        tip="Alimentação lidera seus gastos este mês"
      />

      <EstimatedSavingsCard value={-150.25} title="Economia Estimada" />

      {/* Seção de Últimas Transações */}
      <View style={style.sectionContainer}>
        <Text style={style.sectionTitle}>Últimas Transações</Text>

        {transactionLoading ? (
          <LoadingContent text="transações" />
        ) : transactionsError ? (
          <ErrorContent text="Erro ao carregar transações" />
        ) : (
          lastTransactions.map((transaction) => (
            <TransactionsListItem
              key={transaction.id}
              transaction={transaction}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}
