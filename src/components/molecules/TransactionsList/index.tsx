import React, { useMemo, useCallback } from "react";
import { View, SectionList, ActivityIndicator } from "react-native";
import { parseISO, isToday, isYesterday, isSameMonth, format } from "date-fns";
import { useTheme } from "../../../contexts/ThemeContext";
import { TransactionsListItem } from "../../atoms/TransactionsListItem";
import { TransactionsSeparator } from "../../atoms/TransactionsSeparator";
import { Transaction, TransactionSection } from "../../../types/transactions";
import { styles } from "./styles";
import { Text } from "@/components/atoms/Text";
import { useTransactions } from "@/hooks/useTransactions";
import { LoadingContent } from "@/components/atoms/LoadingContent";
import { ErrorContent } from "@/components/atoms/ErrorContent";
import { colors } from "@/constants/theme";

const getGroupKey = (dateString: string): string => {
  const date = parseISO(dateString);
  const today = new Date();

  if (isToday(date) || isYesterday(date)) {
    return dateString;
  }

  if (isSameMonth(date, today)) {
    return dateString;
  }

  return format(date, "yyyy-MM-01");
};

const groupTransactionsByDate = (
  transactions: Transaction[]
): TransactionSection[] => {
  const sortedTransactions = [...transactions].sort(
    (a, b) =>
      parseISO(b.issue_date).getTime() - parseISO(a.issue_date).getTime()
  );

  const groupedByDate = sortedTransactions.reduce((groups, transaction) => {
    const groupKey = getGroupKey(transaction.issue_date);

    if (!groups[groupKey]) {
      groups[groupKey] = {
        title: groupKey,
        date: groupKey,
        data: [],
      };
    }

    groups[groupKey].data.push(transaction);
    return groups;
  }, {} as Record<string, TransactionSection>);

  return Object.values(groupedByDate).sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
  );
};

export const TransactionsList = () => {
  const { theme } = useTheme();
  const style = styles(theme);

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTransactions({
    issue_date_end: format(new Date(), "yyyy-MM-dd"),
  });

  const transactions = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );

  const sections = useMemo(
    () => groupTransactionsByDate(transactions),
    [transactions]
  );

  const renderTransaction = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionsListItem transaction={item} />
    ),
    []
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: TransactionSection }) => (
      <TransactionsSeparator date={section.date} />
    ),
    []
  );

  const renderEmptyList = useCallback(
    () => (
      <View style={style.emptyContainer}>
        <Text color="text" variant="h3">
          Nenhuma transação encontrada
        </Text>
        <Text color="text" variant="caption">
          Adicione uma nova transação para começar
        </Text>
      </View>
    ),
    [style.emptyContainer]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <View style={style.container}>
      {isLoading ? (
        <LoadingContent text="transações" />
      ) : error ? (
        <ErrorContent text="Erro ao carregar transações" />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) =>
            `${item.id}-${item.issue_date}-${index}`
          }
          renderItem={renderTransaction}
          renderSectionHeader={renderSectionHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={style.listContent}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={renderEmptyList}
          refreshing={isLoading}
          onRefresh={refetch}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="small" color={colors.primary[500]} />
            ) : null
          }
        />
      )}
    </View>
  );
};
