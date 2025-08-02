import React from "react";
import { Text, ScrollView, View } from "react-native";
import { BalanceCard } from "@/components/molecules/BalanceCard";
import { CategoriesCard } from "@/components/molecules/CategoriesCard";
import { EstimatedSavingsCard } from "@/components/molecules/EstimatedSavingsCard";
import { TransactionsListItem } from "@/components/atoms/TransactionsListItem";
import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import { LoadingContent } from "@/components/atoms/LoadingContent";
import { ErrorContent } from "@/components/atoms/ErrorContent";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardScreen() {
  const { theme } = useTheme();
  const style = styles(theme);
  const { user } = useAuth();

  const today = new Date();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const end_date = endOfMonth.toISOString().split("T")[0];

  const {
    data: dashboard,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useDashboard();

  const {
    data: transactions,
    isLoading: transactionLoading,
    error: transactionsError,
  } = useTransactions({
    issue_date_end: end_date,
  });
  const lastTransactions =
    transactions?.pages[0]?.results
      .slice()
      .sort(
        (a, b) =>
          new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime()
      )
      .slice(0, 5) || [];

  if (dashboardLoading) return <LoadingContent text="dashboard" />;
  if (dashboardError) return <ErrorContent text="Erro ao carregar dashboard" />;

  if (!dashboard) {
    return (
      <ErrorContent text="Você não tem dados suficientes para gerar um dashboard." />
    );
  }

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
          data={[
            {
              data:
                dashboard?.balance?.chart_data?.map(
                  (item) => item.balance ?? 0
                ) || [],
            },
          ]}
          title="Saldo Total"
          percentage={dashboard?.balance?.difference ?? 0}
          amount={dashboard?.balance?.current_total ?? 0}
        />

        <BalanceCard
          data={[
            {
              data:
                dashboard?.incomes?.chart_data?.map(
                  (item) => item.total ?? 0
                ) || [],
            },
          ]}
          title="Receitas"
          percentage={dashboard?.incomes?.difference ?? 0}
          amount={dashboard?.incomes?.current_total ?? 0}
        />

        <BalanceCard
          data={[
            {
              data:
                dashboard?.expenses?.chart_data?.map(
                  (item) => item.total ?? 0
                ) || [],
            },
          ]}
          title="Despesas"
          percentage={dashboard?.expenses?.difference ?? 0}
          amount={dashboard?.expenses?.current_total ?? 0}
        />

        {/*         <BalanceCard
          data={[
            {
              data:
                dashboard?.invoices?.chart_data?.map((item) =>
                  typeof item.total_amount === "number" ? item.total_amount : 0
                ) || [],
            },
          ]}
          title="Faturas"
          percentage={dashboard?.invoices?.difference ?? 0}
          amount={dashboard?.invoices?.current_total ?? 0}
        /> */}
      </ScrollView>

      {/* <CategoriesCard
        data={mockCategoriesData}
        title="Categorias"
        tip="Alimentação lidera seus gastos este mês"
      /> */}

      <EstimatedSavingsCard
        value={dashboard?.estimated_saving ?? 0}
        title="Economia Estimada"
      />

      {/* Seção de Últimas Transações */}
      <View style={style.sectionContainer}>
        <Text style={style.sectionTitle}>Últimas Transações</Text>

        {transactionLoading ? (
          <LoadingContent text="transações" />
        ) : transactionsError ? (
          <ErrorContent text="Erro ao carregar transações" />
        ) : lastTransactions.length === 0 ? (
          <Text style={style.noTransactionsText}>
            Nenhuma transação encontrada.
          </Text>
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
