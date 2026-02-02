import React, { useEffect, useState } from "react";
import { Text, ScrollView, View, RefreshControl } from "react-native";
import { parseISO, format, startOfDay, isBefore, isEqual } from "date-fns";
import { BalanceCard } from "@/components/molecules/BalanceCard";
import { EstimatedSavingsCard } from "@/components/molecules/EstimatedSavingsCard";
import { TransactionsListItem } from "@/components/atoms/TransactionsListItem";
import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import { LoadingContent } from "@/components/atoms/LoadingContent";
import { ErrorContent } from "@/components/atoms/ErrorContent";
import { useDashboard } from "@/hooks/useDashboard";
import { colors } from "@/constants/theme";

export default function DashboardScreen() {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const style = styles(theme);
  const { user } = useAuth();

  const today = new Date();

  const currentPeriod = format(today, "yyyy-MM");

  const {
    data: dashboard,
    isLoading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useDashboard({ period: currentPeriod });

  const {
    data: transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useTransactions();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchDashboard(), refetchTransactions()]);
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
    } finally {
      setRefreshing(false);
    }
  };
  const lastTransactions =
    transactions?.pages[0]?.content
      .slice()
      .filter((transaction) => {
        const transactionDate = parseISO(transaction.transactionDate);
        const todayStart = startOfDay(today);
        return (
          isBefore(transactionDate, todayStart) ||
          isEqual(transactionDate, todayStart)
        );
      })
      .sort(
        (a, b) =>
          parseISO(b.transactionDate).getTime() -
          parseISO(a.transactionDate).getTime(),
      )
      .slice(0, 5) || [];

  useEffect(() => {
    if (isAuthenticated) {
      refetchDashboard();
    }
  }, [isAuthenticated, transactions]);

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
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary[500]]}
          tintColor={colors.primary[500]}
        />
      }
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
                dashboard?.balance?.chartData?.map(
                  (item) => item.balance ?? 0,
                ) || [],
            },
          ]}
          title="Saldo Total"
          percentage={dashboard?.balance?.difference ?? 0}
          amount={dashboard?.balance?.currentTotal ?? 0}
        />

        <BalanceCard
          data={[
            {
              data:
                dashboard?.incomes?.chartData?.map((item) => item.total ?? 0) ||
                [],
            },
          ]}
          title="Receitas"
          percentage={dashboard?.incomes?.difference ?? 0}
          amount={dashboard?.incomes?.currentTotal ?? 0}
        />

        <BalanceCard
          data={[
            {
              data:
                dashboard?.expenses?.chartData?.map(
                  (item) => item.total ?? 0,
                ) || [],
            },
          ]}
          title="Despesas"
          percentage={dashboard?.expenses?.difference ?? 0}
          amount={dashboard?.expenses?.currentTotal ?? 0}
        />
      </ScrollView>

      <EstimatedSavingsCard
        data={
          dashboard?.estimatedSaving ?? {
            estimatedSavings: 0,
            savingsPercentage: 0,
            message: "",
            comparisonPeriod: "monthly",
          }
        }
        title="Economia Estimada"
      />

      {/* Seção de Últimas Transações */}
      <View style={style.sectionContainer}>
        <Text style={style.sectionTitle}>Últimas Transações</Text>

        {transactionsLoading ? (
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
