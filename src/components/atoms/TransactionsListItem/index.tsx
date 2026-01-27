import { TouchableOpacity, View } from "react-native";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Text } from "@/components/atoms/Text";
import { colors } from "@/constants/theme";
import { styles } from "./styles";
import { useTheme } from "@/contexts/ThemeContext";
import { Transaction } from "@/types/transactions";
import { useCategories } from "@/hooks/useCategories";
import { formatCurrencySimple } from "@/utils/currency";
import { router, useSegments } from "expo-router";
import { useEffect } from "react";

interface TransactionsListItemProps {
  transaction: Transaction;
}

export const TransactionsListItem = ({
  transaction,
}: TransactionsListItemProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const descriptionText =
    transaction.description.length > 20
      ? `${transaction.description.substring(0, 20)}...`
      : transaction.description;

  const {
    data: categories,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useCategories();

  useEffect(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const category = categories?.pages
    .flatMap((page) => page.content)
    .find((cat) => cat.id === transaction.categoryId);

  const amountText = `${
    category?.type === "EXPENSE" ? "- " : ""
  }${formatCurrencySimple(Math.abs(transaction.amount))}`;
  const amountColor =
    category?.type === "EXPENSE"
      ? colors.feedback.error
      : colors.feedback.success;

  const segments = useSegments();
  const isInTransactionStack = segments.includes("transactions");

  const handleOnPress = () => {
    if (isInTransactionStack) {
      router.push(`/transactions/${transaction.id}`);
    } else {
      router.navigate("/transactions");
      setTimeout(() => {
        router.push(`/transactions/${transaction.id}`);
      }, 20);
    }
  };

  return (
    <TouchableOpacity
      style={[
        style.container,
        { borderColor: category?.colorHex || colors.feedback.error },
      ]}
      onPress={handleOnPress}
      activeOpacity={0.7}
    >
      <View style={style.leftContainer}>
        <Text style={style.descriptionText}>{descriptionText}</Text>
        <Text style={style.categoryText}>
          {category?.name || "Desconhecido"}
        </Text>
      </View>
      <View style={style.rightContainer}>
        <Text style={[style.amountText, { color: amountColor }]}>
          {amountText}
        </Text>
        <Text style={style.dateText}>{formatDate(transaction.transactionDate)}</Text>
      </View>
    </TouchableOpacity>
  );
};
