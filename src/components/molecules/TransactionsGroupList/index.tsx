import { ErrorContent } from "@/components/atoms/ErrorContent";
import { LoadingContent } from "@/components/atoms/LoadingContent";
import { Text } from "@/components/atoms/Text";
import { TransactionsListItem } from "@/components/atoms/TransactionsListItem";
import { colors } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useTransactions } from "@/hooks/useTransactions";
import { ActivityIndicator, View } from "react-native";
import { styles } from "./styles";
import { useEffect } from "react";

interface TransactionsGroupListProps {
  groupId: string;
  ignoreId?: string;
}

export const TransactionsGroupList = ({
  groupId,
  ignoreId,
}: TransactionsGroupListProps) => {
  const { theme } = useTheme();
  const style = styles(theme);
  const {
    data: transactions,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useTransactions({ purchaseGroupUuid: groupId });

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <LoadingContent text="transações" />;
  }

  if (error || !transactions) {
    return <ErrorContent text="Não foi possível carregar as transações." />;
  }

  const emptyTransactionsComponent = () => (
    <ErrorContent text="Nenhuma transação encontrada para este grupo." />
  );

  const transactionsList = transactions.pages.flatMap((page) => {
    if (ignoreId) {
      return page.content.filter((transaction) => transaction.id !== ignoreId);
    }

    return page.content;
  });

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text color="text" variant="h2">
          Transações Relacionadas
        </Text>
      </View>

      {transactionsList.length === 0 ? (
        emptyTransactionsComponent()
      ) : (
        <View style={style.listContent}>
          {transactionsList.map((item) => (
            <TransactionsListItem key={item.id} transaction={item} />
          ))}
          {hasNextPage ||
            (isFetchingNextPage && (
              <ActivityIndicator
                size="large"
                color={colors.primary[500]}
                style={{ marginTop: 16 }}
              />
            ))}
        </View>
      )}
    </View>
  );
};
